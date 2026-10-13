export type UserId = string;

export enum AccountState {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum IdentityTokenPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export type IdentityUser = Readonly<{
  id: UserId;
  normalizedEmail: string;
  displayEmail: string;
  accountState: AccountState;
  passwordHash: string;
  emailVerifiedAt?: Date;
  platformAdmin: boolean;
  mfaEnabledAt?: Date;
  mfaSecretCiphertext?: string;
  mfaKeyReference?: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type SecretTokenRecord = Readonly<{
  id: string;
  userId: UserId;
  purpose: IdentityTokenPurpose;
  tokenHash: string;
  expiresAt: Date;
  consumedAt?: Date;
  supersededAt?: Date;
  createdAt: Date;
}>;

export type SessionFamily = Readonly<{
  id: string;
  userId: UserId;
  refreshTokenHash: string;
  absoluteExpiresAt: Date;
  idleExpiresAt: Date;
  revokedAt?: Date;
  replayDetectedAt?: Date;
  createdAt: Date;
  rotatedAt?: Date;
}>;

export type IdentityAuditEvent = Readonly<{
  action: string;
  userId?: string;
  correlationId?: string;
  occurredAt: Date;
  metadata?: Record<string, string | number | boolean | undefined>;
}>;

export interface IdentityRepository {
  findUserByNormalizedEmail(normalizedEmail: string): Promise<IdentityUser | undefined>;
  findUserById(userId: string): Promise<IdentityUser | undefined>;
  createUser(user: IdentityUser): Promise<void>;
  saveUser(user: IdentityUser): Promise<void>;
  saveToken(token: SecretTokenRecord): Promise<void>;
  consumeToken(input: {
    tokenHash: string;
    purpose: IdentityTokenPurpose;
    now: Date;
  }): Promise<SecretTokenRecord | undefined>;
  supersedeActiveTokens(
    userId: string,
    purpose: IdentityTokenPurpose,
    now: Date,
  ): Promise<void>;
  countTokensSince(input: {
    userId: string;
    purpose: IdentityTokenPurpose;
    since: Date;
  }): Promise<number>;
  saveSession(session: SessionFamily): Promise<void>;
  consumeRefreshToken(input: {
    tokenHash: string;
    now: Date;
  }): Promise<SessionFamily | undefined>;
  revokeSessionFamily(sessionId: string, now: Date, replay?: boolean): Promise<void>;
  revokeAllSessions(userId: string, now: Date): Promise<void>;
  consumeRecoveryCode(input: {
    userId: string;
    codeHash: string;
    now: Date;
  }): Promise<boolean>;
}

export interface IdentityAuditSink {
  append(event: IdentityAuditEvent): Promise<void>;
}

export interface BreachedPasswordChecker {
  isRejected(password: string): Promise<boolean>;
}

export interface IdentityKeyService {
  signAccessToken(input: {
    subject: string;
    sessionId: string;
    platformAdmin: boolean;
  }): Promise<string>;
}

export interface TotpSecretProtector {
  encrypt(secret: string): Promise<{ ciphertext: string; keyReference: string }>;
  decrypt(input: { ciphertext: string; keyReference: string }): Promise<string>;
}

export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');
export const IDENTITY_AUDIT_SINK = Symbol('IDENTITY_AUDIT_SINK');
export const BREACHED_PASSWORD_CHECKER = Symbol('BREACHED_PASSWORD_CHECKER');
export const IDENTITY_KEY_SERVICE = Symbol('IDENTITY_KEY_SERVICE');
export const TOTP_SECRET_PROTECTOR = Symbol('TOTP_SECRET_PROTECTOR');
