import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { randomUUID } from 'node:crypto';

export enum OutboxDeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Entity({ schema: 'outbox', tableName: 'records' })
export class OutboxRecord {
  @PrimaryKey({ type: 'uuid' })
  id = randomUUID();

  @Property({ type: 'varchar', length: 160, unique: true })
  eventId!: string;

  @Property({ type: 'varchar', length: 160 })
  eventType!: string;

  @Property({ type: 'varchar', length: 160 })
  aggregateId!: string;

  @Property({ type: 'varchar', length: 160, nullable: true })
  organizationId?: string;

  @Property({ type: 'varchar', length: 160, nullable: true })
  correlationId?: string;

  @Property({ type: 'varchar', length: 160, nullable: true })
  causationId?: string;

  @Property({ type: 'varchar', length: 40 })
  schemaVersion!: string;

  @Property({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Property({ type: 'varchar', length: 32 })
  status: OutboxDeliveryStatus = OutboxDeliveryStatus.PENDING;

  @Property({ type: 'integer' })
  attempts = 0;

  @Property({ type: 'timestamptz' })
  occurredAt = new Date();

  @Property({ type: 'timestamptz', nullable: true })
  deliveredAt?: Date;

  @Property({ type: 'text', nullable: true })
  lastFailure?: string;

  @Property({ version: true, type: 'integer' })
  version = 1;
}
