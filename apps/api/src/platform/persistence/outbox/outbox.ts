import { randomUUID } from 'node:crypto';
import { OutboxRecord } from './outbox-record.entity';

export type DomainEvent = Readonly<{
  eventId: string;
  eventType: string;
  aggregateId: string;
  organizationId?: string;
  correlationId?: string;
  causationId?: string;
  schemaVersion: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
}>;

export interface OutboxStore {
  enqueue(record: OutboxRecord): Promise<void>;
}

export interface OutboxDeliveryHandler {
  deliver(event: DomainEvent): Promise<void>;
}

export const OUTBOX_STORE = Symbol('OUTBOX_STORE');
export const OUTBOX_DELIVERY_HANDLER = Symbol('OUTBOX_DELIVERY_HANDLER');

export function createDomainEvent(
  input: Omit<DomainEvent, 'eventId' | 'occurredAt'>,
): DomainEvent {
  return {
    ...input,
    eventId: randomUUID(),
    occurredAt: new Date(),
  };
}

export function outboxRecordFor(event: DomainEvent): OutboxRecord {
  const record = new OutboxRecord();
  Object.assign(record, event);
  return record;
}

export function assertIdempotencyKey(key: string): string {
  if (!/^[A-Za-z0-9_-]{16,255}$/.test(key)) {
    throw new Error(
      'Idempotency key must be a URL-safe value between 16 and 255 characters',
    );
  }
  return key;
}
