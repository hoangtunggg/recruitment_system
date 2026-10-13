import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { AccountState } from '../identity.types';

@Entity({ schema: 'identity', tableName: 'users' })
@Index({
  properties: ['normalizedEmail'],
  name: 'identity_users_normalized_email_unique',
  options: { unique: true },
})
export class IdentityUserEntity {
  @PrimaryKey({ type: 'uuid' }) id: string = randomUUID();
  @Property({ type: 'varchar', length: 320 }) normalizedEmail!: string;
  @Property({ type: 'varchar', length: 320 }) displayEmail!: string;
  @Property({ type: 'varchar', length: 32 }) accountState: AccountState =
    AccountState.PENDING_VERIFICATION;
  @Property({ type: 'text' }) passwordHash!: string;
  @Property({ type: 'timestamptz', nullable: true }) emailVerifiedAt?: Date;
  @Property({ type: 'boolean' }) platformAdmin = false;
  @Property({ type: 'timestamptz', nullable: true }) mfaEnabledAt?: Date;
  @Property({ type: 'text', nullable: true }) mfaSecretCiphertext?: string;
  @Property({ type: 'varchar', length: 255, nullable: true }) mfaKeyReference?: string;
  @Property({ type: 'timestamptz' }) createdAt = new Date();
  @Property({ type: 'timestamptz' }) updatedAt = new Date();
}
