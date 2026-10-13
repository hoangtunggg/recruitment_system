import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

/** A narrow technical transaction boundary; domain commands own their invariants. */
@Injectable()
export class DatabaseTransactionRunner {
  constructor(private readonly entityManager: EntityManager) {}

  run<T>(work: (transactionalEntityManager: EntityManager) => Promise<T>): Promise<T> {
    return this.entityManager.transactional(work);
  }
}
