import { Migration } from '@mikro-orm/migrations';

/** Additive target-only Identity schema. Never execute before the P7 cutover gate. */
export class Migration20261006000000_create_identity_target extends Migration {
  override async up(): Promise<void> {
    this.addSql('create schema if not exists "identity";');
    this.addSql(
      'create table "identity"."users" ("id" uuid not null, "normalized_email" varchar(320) not null, "display_email" varchar(320) not null, "account_state" varchar(32) not null, "password_hash" text not null, "email_verified_at" timestamptz null, "platform_admin" boolean not null, "mfa_enabled_at" timestamptz null, "mfa_secret_ciphertext" text null, "mfa_key_reference" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "identity_users_pkey" primary key ("id"));',
    );
    this.addSql(
      'create unique index "identity_users_normalized_email_unique" on "identity"."users" ("normalized_email");',
    );
    this.addSql(
      'create table "identity"."secret_tokens" ("id" uuid not null, "user_id" uuid not null, "purpose" varchar(32) not null, "token_hash" varchar(64) not null, "expires_at" timestamptz not null, "consumed_at" timestamptz null, "superseded_at" timestamptz null, "created_at" timestamptz not null, constraint "identity_tokens_pkey" primary key ("id"));',
    );
    this.addSql(
      'create unique index "identity_tokens_hash_purpose_unique" on "identity"."secret_tokens" ("token_hash", "purpose");',
    );
    this.addSql(
      'create table "identity"."session_families" ("id" uuid not null, "user_id" uuid not null, "refresh_token_hash" varchar(64) not null, "absolute_expires_at" timestamptz not null, "idle_expires_at" timestamptz not null, "revoked_at" timestamptz null, "replay_detected_at" timestamptz null, "created_at" timestamptz not null, "rotated_at" timestamptz null, constraint "identity_sessions_pkey" primary key ("id"));',
    );
    this.addSql(
      'create unique index "identity_sessions_refresh_hash_unique" on "identity"."session_families" ("refresh_token_hash");',
    );
    this.addSql(
      'create table "identity"."mfa_recovery_codes" ("id" uuid not null, "user_id" uuid not null, "code_hash" varchar(64) not null, "created_at" timestamptz not null, "consumed_at" timestamptz null, constraint "identity_mfa_recovery_codes_pkey" primary key ("id"));',
    );
    this.addSql(
      'create unique index "identity_mfa_recovery_code_unique" on "identity"."mfa_recovery_codes" ("user_id", "code_hash");',
    );
  }

  override async down(): Promise<void> {
    this.addSql('drop schema if exists "identity" cascade;');
  }
}
