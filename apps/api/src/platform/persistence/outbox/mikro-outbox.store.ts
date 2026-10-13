import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { OutboxStore } from './outbox';
import { OutboxRecord } from './outbox-record.entity';

/** Must be called inside the owning command's DatabaseTransactionRunner callback. */
@Injectable()
export class MikroOutboxStore implements OutboxStore {
  constructor(private readonly entityManager: EntityManager) {}

  async enqueue(record: OutboxRecord): Promise<void> {
    this.entityManager.persist(record);
  }
}
