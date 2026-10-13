import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';

@Entity({ schema: 'outbox', tableName: 'idempotency_records' })
@Unique({ properties: ['scope', 'key'] })
export class IdempotencyRecord {
  @PrimaryKey({ type: 'uuid' })
  id = randomUUID();

  @Property({ type: 'varchar', length: 160 })
  scope!: string;

  @Property({ type: 'varchar', length: 255 })
  key!: string;

  @Property({ type: 'varchar', length: 80 })
  requestFingerprint!: string;

  @Property({ type: 'jsonb', nullable: true })
  response?: Record<string, unknown>;

  @Property({ type: 'timestamptz' })
  createdAt = new Date();

  @Property({ version: true, type: 'integer' })
  version = 1;
}
