# Target persistence conventions

- PostgreSQL is the target system of record; the target process requires
  `TARGET_DATABASE_URL` and never reads a client-supplied tenant scope.
- Each business module owns its schema, entity mappings, repository and migrations.
  `platform/persistence` has no generic `BaseEntity` or cross-domain repository.
- Module migrations are additive and named `MigrationYYYYMMDDHHMMSS_<purpose>.ts`.
  A migration must have an explicit forward-only/reversible assessment, validation
  evidence and the P4 destructive-migration gate before execution.
- Timestamps, soft deletion, tenant-leading indexes and optimistic versions are
  selected by the owning module and approved data rule; they are not inherited from a
  generic base model.
- The only P6 persistence records are technical outbox/idempotency records in the
  `outbox` schema. No business-domain table is created in this phase.
