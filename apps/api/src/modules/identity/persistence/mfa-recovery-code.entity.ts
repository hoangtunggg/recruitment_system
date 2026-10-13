import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';

@Entity({ schema: 'identity', tableName: 'mfa_recovery_codes' })
@Index({
  properties: ['userId', 'codeHash'],
  name: 'identity_mfa_recovery_code_unique',
  options: { unique: true },
})
export class MfaRecoveryCodeEntity {
  @PrimaryKey({ type: 'uuid' }) id: string = randomUUID();
  @Property({ type: 'uuid' }) userId!: string;
  @Property({ type: 'varchar', length: 64 }) codeHash!: string;
  @Property({ type: 'timestamptz' }) createdAt = new Date();
  @Property({ type: 'timestamptz', nullable: true }) consumedAt?: Date;
}
