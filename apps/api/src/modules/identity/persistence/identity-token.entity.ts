import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';
import { IdentityTokenPurpose } from '../identity.types';

@Entity({ schema: 'identity', tableName: 'secret_tokens' })
@Index({
  properties: ['tokenHash', 'purpose'],
  name: 'identity_tokens_hash_purpose_unique',
  options: { unique: true },
})
export class IdentityTokenEntity {
  @PrimaryKey({ type: 'uuid' }) id: string = randomUUID();
  @Property({ type: 'uuid' }) userId!: string;
  @Property({ type: 'varchar', length: 32 }) purpose!: IdentityTokenPurpose;
  @Property({ type: 'varchar', length: 64 }) tokenHash!: string;
  @Property({ type: 'timestamptz' }) expiresAt!: Date;
  @Property({ type: 'timestamptz', nullable: true }) consumedAt?: Date;
  @Property({ type: 'timestamptz', nullable: true }) supersededAt?: Date;
  @Property({ type: 'timestamptz' }) createdAt = new Date();
}
