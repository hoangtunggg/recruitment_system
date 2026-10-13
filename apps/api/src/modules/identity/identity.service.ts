import { Inject, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  assertPasswordLength,
  createOpaqueToken,
  hashOpaqueToken,
  normalizeEmail,
  REFRESH_ABSOLUTE_TTL_MS,
  REFRESH_IDLE_TTL_MS,
  RESET_TOKEN_TTL_MS,
  VERIFICATION_TOKEN_TTL_MS,
} from './identity-security';
import {
  AccountState,
  BREACHED_PASSWORD_CHECKER,
  BreachedPasswordChecker,
  IDENTITY_AUDIT_SINK,
  IDENTITY_KEY_SERVICE,
  IDENTITY_REPOSITORY,
  IdentityAuditSink,
  IdentityKeyService,
  IdentityRepository,
  IdentityTokenPurpose,
  IdentityUser,
  SessionFamily,
} from './identity.types';
import { Argon2idPasswordHasher } from './password-hasher';
import { ApplicationError, ErrorCode } from '../../platform/http/errors';

export type SessionTokens = Readonly<{
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}>;

@Injectable()
export class IdentityService {
  private readonly passwordHasher = new Argon2idPasswordHasher();

  constructor(
    @Inject(IDENTITY_REPOSITORY) private readonly repository: IdentityRepository,
    @Inject(IDENTITY_AUDIT_SINK) private readonly audit: IdentityAuditSink,
    @Inject(BREACHED_PASSWORD_CHECKER)
    private readonly breachedPasswords: BreachedPasswordChecker,
    @Inject(IDENTITY_KEY_SERVICE) private readonly keys: IdentityKeyService,
  ) {}

  async registerCandidate(input: {
    email: string;
    password: string;
    now?: Date;
    correlationId?: string;
  }): Promise<{ userId: string; verificationToken: string }> {
    const now = input.now ?? new Date();
    const normalizedEmail = normalizeEmail(input.email);
    if (!normalizedEmail || !normalizedEmail.includes('@')) throw this.invalid();
    assertPasswordLength(input.password);
    if (await this.breachedPasswords.isRejected(input.password)) throw this.invalid();
    if (await this.repository.findUserByNormalizedEmail(normalizedEmail))
      throw this.conflict();

    const user: IdentityUser = {
      id: randomUUID(),
      normalizedEmail,
      displayEmail: input.email.trim(),
      accountState: AccountState.PENDING_VERIFICATION,
      passwordHash: await this.passwordHasher.hash(input.password),
      platformAdmin: false,
      createdAt: now,
      updatedAt: now,
    };
    try {
      await this.repository.createUser(user);
    } catch {
      throw this.conflict();
    }
    const verificationToken = await this.issueToken(
      user,
      IdentityTokenPurpose.EMAIL_VERIFICATION,
      now,
    );
    await this.audit.append({
      action: 'identity.registration.created',
      userId: user.id,
      correlationId: input.correlationId,
      occurredAt: now,
    });
    return { userId: user.id, verificationToken };
  }

  async verifyEmail(input: {
    token: string;
    now?: Date;
    correlationId?: string;
  }): Promise<void> {
    const now = input.now ?? new Date();
    const record = await this.repository.consumeToken({
      tokenHash: hashOpaqueToken(input.token),
      purpose: IdentityTokenPurpose.EMAIL_VERIFICATION,
      now,
    });
    if (!record) throw this.invalid();
    const user = await this.repository.findUserById(record.userId);
    if (!user || user.accountState !== AccountState.PENDING_VERIFICATION)
      throw this.invalid();
    await this.repository.saveUser({
      ...user,
      accountState: AccountState.ACTIVE,
      emailVerifiedAt: now,
      updatedAt: now,
    });
    await this.audit.append({
      action: 'identity.email.verified',
      userId: user.id,
      correlationId: input.correlationId,
      occurredAt: now,
    });
  }

  async resendVerification(input: { email: string; now?: Date }): Promise<void> {
    const now = input.now ?? new Date();
    const normalizedEmail = normalizeEmail(input.email);
    const user = await this.repository.findUserByNormalizedEmail(normalizedEmail);
    // Deliberately indistinguishable for unknown/non-pending accounts.
    if (!user || user.accountState !== AccountState.PENDING_VERIFICATION) return;
    const count = await this.repository.countTokensSince({
      userId: user.id,
      purpose: IdentityTokenPurpose.EMAIL_VERIFICATION,
      since: new Date(now.getTime() - 60 * 60 * 1000),
    });
    if (count >= 5) return;
    await this.repository.supersedeActiveTokens(
      user.id,
      IdentityTokenPurpose.EMAIL_VERIFICATION,
      now,
    );
    await this.issueToken(user, IdentityTokenPurpose.EMAIL_VERIFICATION, now);
    await this.audit.append({
      action: 'identity.email.verification_resent',
      userId: user.id,
      occurredAt: now,
    });
  }

  async login(input: {
    email: string;
    password: string;
    now?: Date;
  }): Promise<SessionTokens> {
    const now = input.now ?? new Date();
    const user = await this.repository.findUserByNormalizedEmail(
      normalizeEmail(input.email),
    );
    if (
      !user ||
      user.accountState !== AccountState.ACTIVE ||
      !(await this.passwordHasher.verify(input.password, user.passwordHash))
    )
      throw this.invalid();
    return this.createSession(user, now);
  }

  async refresh(input: { refreshToken: string; now?: Date }): Promise<SessionTokens> {
    const now = input.now ?? new Date();
    const tokenHash = hashOpaqueToken(input.refreshToken);
    const session = await this.repository.consumeRefreshToken({ tokenHash, now });
    if (!session) throw this.invalid();
    const user = await this.repository.findUserById(session.userId);
    if (!user || user.accountState !== AccountState.ACTIVE) throw this.invalid();
    return this.createSession(user, now);
  }

  async logout(sessionId: string, now = new Date()): Promise<void> {
    await this.repository.revokeSessionFamily(sessionId, now);
  }

  async requestPasswordReset(input: { email: string; now?: Date }): Promise<void> {
    const now = input.now ?? new Date();
    const user = await this.repository.findUserByNormalizedEmail(
      normalizeEmail(input.email),
    );
    if (!user || user.accountState === AccountState.DEACTIVATED) return;
    await this.repository.supersedeActiveTokens(
      user.id,
      IdentityTokenPurpose.PASSWORD_RESET,
      now,
    );
    await this.issueToken(user, IdentityTokenPurpose.PASSWORD_RESET, now);
    await this.audit.append({
      action: 'identity.password.reset_requested',
      userId: user.id,
      occurredAt: now,
    });
  }

  async confirmPasswordReset(input: {
    token: string;
    password: string;
    now?: Date;
  }): Promise<void> {
    const now = input.now ?? new Date();
    assertPasswordLength(input.password);
    if (await this.breachedPasswords.isRejected(input.password)) throw this.invalid();
    const record = await this.repository.consumeToken({
      tokenHash: hashOpaqueToken(input.token),
      purpose: IdentityTokenPurpose.PASSWORD_RESET,
      now,
    });
    if (!record) throw this.invalid();
    const user = await this.repository.findUserById(record.userId);
    if (!user) throw this.invalid();
    await this.repository.saveUser({
      ...user,
      passwordHash: await this.passwordHasher.hash(input.password),
      updatedAt: now,
    });
    await this.repository.revokeAllSessions(user.id, now);
    await this.audit.append({
      action: 'identity.password.reset_completed',
      userId: user.id,
      occurredAt: now,
    });
  }

  async changeAccountState(input: {
    userId: string;
    next: AccountState.SUSPENDED | AccountState.ACTIVE | AccountState.DEACTIVATED;
    actorId: string;
    reason: string;
    now?: Date;
  }): Promise<void> {
    const now = input.now ?? new Date();
    const user = await this.repository.findUserById(input.userId);
    if (!user || !input.reason.trim()) throw this.invalid();
    if (
      user.accountState === AccountState.DEACTIVATED &&
      input.next !== AccountState.DEACTIVATED
    )
      throw this.invalid();
    await this.repository.saveUser({ ...user, accountState: input.next, updatedAt: now });
    await this.repository.revokeAllSessions(user.id, now);
    await this.audit.append({
      action: `identity.account.${input.next.toLowerCase()}`,
      userId: user.id,
      occurredAt: now,
      metadata: { actorId: input.actorId },
    });
  }

  private async issueToken(
    user: IdentityUser,
    purpose: IdentityTokenPurpose,
    now: Date,
  ): Promise<string> {
    const token = createOpaqueToken();
    await this.repository.saveToken({
      id: randomUUID(),
      userId: user.id,
      purpose,
      tokenHash: hashOpaqueToken(token),
      createdAt: now,
      expiresAt: new Date(
        now.getTime() +
          (purpose === IdentityTokenPurpose.EMAIL_VERIFICATION
            ? VERIFICATION_TOKEN_TTL_MS
            : RESET_TOKEN_TTL_MS),
      ),
    });
    return token;
  }

  private async createSession(user: IdentityUser, now: Date): Promise<SessionTokens> {
    const refreshToken = createOpaqueToken();
    const session: SessionFamily = {
      id: randomUUID(),
      userId: user.id,
      refreshTokenHash: hashOpaqueToken(refreshToken),
      createdAt: now,
      absoluteExpiresAt: new Date(now.getTime() + REFRESH_ABSOLUTE_TTL_MS),
      idleExpiresAt: new Date(now.getTime() + REFRESH_IDLE_TTL_MS),
    };
    await this.repository.saveSession(session);
    const accessToken = await this.keys.signAccessToken({
      subject: user.id,
      sessionId: session.id,
      platformAdmin: user.platformAdmin,
    });
    return { accessToken, refreshToken, sessionId: session.id };
  }

  private invalid(): ApplicationError {
    return new ApplicationError(
      ErrorCode.AUTHENTICATION_INVALID,
      HttpStatus.UNAUTHORIZED,
      'Authentication request cannot be completed',
    );
  }
  private conflict(): ApplicationError {
    return new ApplicationError(
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT,
      'Identity already exists',
    );
  }
}
