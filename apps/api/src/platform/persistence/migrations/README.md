# Target migration execution policy

Migrations are generated/reviewed per owning schema and use the naming convention
`MigrationYYYYMMDDHHMMSS_<purpose>.ts`. Run only an additive, reviewed migration against
an environment with a verified backup/restore rehearsal. Production migration execution
is operationally controlled and never happens on target application startup.

Destructive changes require the P4 backup/restore, reconciliation, rollback/replay,
deployment sequencing and explicit approval gates. A down method is provided only where
rollback is safe; otherwise the migration records an approved forward-repair path.
