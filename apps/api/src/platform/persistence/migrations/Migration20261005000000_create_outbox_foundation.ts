import { Migration } from '@mikro-orm/migrations';

/**
 * Additive P6 technical foundation only. It creates no business-domain schema.
 * Execute only through the operational destructive-migration gate documented here.
 */
export class Migration20261005000000_create_outbox_foundation extends Migration {
  override async up(): Promise<void> {
    this.addSql('create schema if not exists "outbox";');
    this.addSql(
      'create table "outbox"."records" ("id" uuid not null, "event_id" varchar(160) not null, "event_type" varchar(160) not null, "aggregate_id" varchar(160) not null, "organization_id" varchar(160) null, "correlation_id" varchar(160) null, "causation_id" varchar(160) null, "schema_version" varchar(40) not null, "payload" jsonb not null, "status" varchar(255) not null, "attempts" int not null, "occurred_at" timestamptz not null, "delivered_at" timestamptz null, "last_failure" text null, "version" int not null, constraint "records_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "outbox"."records" add constraint "records_event_id_unique" unique ("event_id");',
    );
    this.addSql(
      'create index "records_delivery_idx" on "outbox"."records" ("status", "occurred_at");',
    );
    this.addSql(
      'create table "outbox"."idempotency_records" ("id" uuid not null, "scope" varchar(160) not null, "key" varchar(255) not null, "request_fingerprint" varchar(80) not null, "response" jsonb null, "created_at" timestamptz not null, "version" int not null, constraint "idempotency_records_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "outbox"."idempotency_records" add constraint "idempotency_scope_key_unique" unique ("scope", "key");',
    );
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "outbox"."idempotency_records";');
    this.addSql('drop table if exists "outbox"."records";');
  }
}
