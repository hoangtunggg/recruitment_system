import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { IdentitySessionEntity } from './identity-session.entity';
import { IdentityTokenEntity } from './identity-token.entity';
import { IdentityUserEntity } from './identity-user.entity';
import { MfaRecoveryCodeEntity } from './mfa-recovery-code.entity';
import {
  AccountState,
  IdentityRepository,
  IdentityTokenPurpose,
  IdentityUser,
  SecretTokenRecord,
  SessionFamily,
} from '../identity.types';

@Injectable()
export class MikroIdentityRepository implements IdentityRepository {
  constructor(private readonly em: EntityManager) {}
  async findUserByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<IdentityUser | undefined> {
    const value = await this.em.findOne(IdentityUserEntity, { normalizedEmail });
    return value ? this.user(value) : undefined;
  }
  async findUserById(id: string): Promise<IdentityUser | undefined> {
    const value = await this.em.findOne(IdentityUserEntity, { id });
    return value ? this.user(value) : undefined;
  }
  async createUser(user: IdentityUser): Promise<void> {
    this.em.persist(this.em.create(IdentityUserEntity, user));
    await this.em.flush();
  }
  async saveUser(user: IdentityUser): Promise<void> {
    const entity = await this.em.findOneOrFail(IdentityUserEntity, { id: user.id });
    Object.assign(entity, user);
    await this.em.flush();
  }
  async saveToken(token: SecretTokenRecord): Promise<void> {
    this.em.persist(this.em.create(IdentityTokenEntity, token));
    await this.em.flush();
  }
  async consumeToken(input: {
    tokenHash: string;
    purpose: IdentityTokenPurpose;
    now: Date;
  }): Promise<SecretTokenRecord | undefined> {
    const entity = await this.em.findOne(IdentityTokenEntity, {
      tokenHash: input.tokenHash,
      purpose: input.purpose,
      consumedAt: null,
      supersededAt: null,
    });
    if (!entity || entity.expiresAt <= input.now) return undefined;
    entity.consumedAt = input.now;
    await this.em.flush();
    return this.token(entity);
  }
  async supersedeActiveTokens(
    userId: string,
    purpose: IdentityTokenPurpose,
    now: Date,
  ): Promise<void> {
    await this.em.nativeUpdate(
      IdentityTokenEntity,
      { userId, purpose, consumedAt: null, supersededAt: null },
      { supersededAt: now },
    );
  }
  async countTokensSince(input: {
    userId: string;
    purpose: IdentityTokenPurpose;
    since: Date;
  }): Promise<number> {
    return this.em.count(IdentityTokenEntity, {
      userId: input.userId,
      purpose: input.purpose,
      createdAt: { $gte: input.since },
    });
  }
  async saveSession(session: SessionFamily): Promise<void> {
    this.em.persist(this.em.create(IdentitySessionEntity, session));
    await this.em.flush();
  }
  async consumeRefreshToken(input: {
    tokenHash: string;
    now: Date;
  }): Promise<SessionFamily | undefined> {
    const entity = await this.em.findOne(IdentitySessionEntity, {
      refreshTokenHash: input.tokenHash,
    });
    if (!entity) return undefined;
    if (
      entity.revokedAt ||
      entity.absoluteExpiresAt <= input.now ||
      entity.idleExpiresAt <= input.now
    ) {
      entity.replayDetectedAt ??= input.now;
      entity.revokedAt ??= input.now;
      await this.em.flush();
      return undefined;
    }
    entity.revokedAt = input.now;
    entity.rotatedAt = input.now;
    await this.em.flush();
    return this.session(entity);
  }
  async revokeSessionFamily(id: string, now: Date, replay = false): Promise<void> {
    const entity = await this.em.findOne(IdentitySessionEntity, { id });
    if (entity) {
      entity.revokedAt ??= now;
      if (replay) entity.replayDetectedAt ??= now;
      await this.em.flush();
    }
  }
  async revokeAllSessions(userId: string, now: Date): Promise<void> {
    await this.em.nativeUpdate(
      IdentitySessionEntity,
      { userId, revokedAt: null },
      { revokedAt: now },
    );
  }
  async consumeRecoveryCode(input: {
    userId: string;
    codeHash: string;
    now: Date;
  }): Promise<boolean> {
    return (
      (await this.em.nativeUpdate(
        MfaRecoveryCodeEntity,
        { userId: input.userId, codeHash: input.codeHash, consumedAt: null },
        { consumedAt: input.now },
      )) === 1
    );
  }
  private user(e: IdentityUserEntity): IdentityUser {
    return {
      id: e.id,
      normalizedEmail: e.normalizedEmail,
      displayEmail: e.displayEmail,
      accountState: e.accountState as AccountState,
      passwordHash: e.passwordHash,
      emailVerifiedAt: e.emailVerifiedAt,
      platformAdmin: e.platformAdmin,
      mfaEnabledAt: e.mfaEnabledAt,
      mfaSecretCiphertext: e.mfaSecretCiphertext,
      mfaKeyReference: e.mfaKeyReference,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    };
  }
  private token(e: IdentityTokenEntity): SecretTokenRecord {
    return {
      id: e.id,
      userId: e.userId,
      purpose: e.purpose,
      tokenHash: e.tokenHash,
      expiresAt: e.expiresAt,
      consumedAt: e.consumedAt,
      supersededAt: e.supersededAt,
      createdAt: e.createdAt,
    };
  }
  private session(e: IdentitySessionEntity): SessionFamily {
    return {
      id: e.id,
      userId: e.userId,
      refreshTokenHash: e.refreshTokenHash,
      absoluteExpiresAt: e.absoluteExpiresAt,
      idleExpiresAt: e.idleExpiresAt,
      revokedAt: e.revokedAt,
      replayDetectedAt: e.replayDetectedAt,
      createdAt: e.createdAt,
      rotatedAt: e.rotatedAt,
    };
  }
}
