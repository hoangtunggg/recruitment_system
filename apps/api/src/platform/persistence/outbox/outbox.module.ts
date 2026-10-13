import { Module } from '@nestjs/common';
import { MikroOutboxStore } from './mikro-outbox.store';
import { OUTBOX_STORE } from './outbox';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MikroOutboxStore, { provide: OUTBOX_STORE, useExisting: MikroOutboxStore }],
  exports: [OUTBOX_STORE],
})
export class OutboxModule {}
