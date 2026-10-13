import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';

@Entity({ schema: 'identity', tableName: 'session_families' })
@Index({
  properties: ['refreshTokenHash'],
  name: 'identity_sessions_refresh_hash_unique',
  options: { unique: true },
})
export class IdentitySessionEntity {
  @PrimaryKey({ type: 'uuid' }) id: string = randomUUID();
  @Property({ type: 'uuid' }) userId!: string;
  @Property({ type: 'varchar', length: 64 }) refreshTokenHash!: string;
  @Property({ type: 'timestamptz' }) absoluteExpiresAt!: Date;
  @Property({ type: 'timestamptz' }) idleExpiresAt!: Date;
  @Property({ type: 'timestamptz', nullable: true }) revokedAt?: Date;
  @Property({ type: 'timestamptz', nullable: true }) replayDetectedAt?: Date;
  @Property({ type: 'timestamptz' }) createdAt = new Date();
  @Property({ type: 'timestamptz', nullable: true }) rotatedAt?: Date;
}
