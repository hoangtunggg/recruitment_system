# P4 Regression and Recovery Baseline

**Status:** EXECUTED — mixed baseline; known failures and exclusions recorded  
**Phase:** P4 Closure  
**Date:** 2026-10-05

## 1. Environment and command evidence

Node/pnpm were initially absent. P4 Enablement installed a portable Node runtime under
the user tool directory, enabled Corepack shims in that same tool directory, and did
not alter the repository's engine, package-manager, lockfile, or dependency versions.
Docker and database/client tooling remain unavailable.

| Check | Intended command | Status | Evidence / gate |
|---|---|---|---|
| Dependency install | `pnpm install --frozen-lockfile` | PASS | Exit 0; lockfile up to date; `prepare`/Husky completed. Node `v24.19.0`, pnpm `10.17.0`. |
| Build | `pnpm build` | PASS | Exit 0; target skeleton re-run: 7/7 Turbo tasks successful. Initial package-manager-discovery failure was resolved by Corepack shim outside the repository. |
| Typecheck | `pnpm check-types` | PASS | Exit 0; target skeleton re-run: 7/7 Turbo tasks successful. |
| Lint | `pnpm lint` | FAIL | Exit 1; existing Oxlint findings in auth/user/notification services; target-package lint passes. No source edited. |
| Unit test | `pnpm test` | FAIL | Exit 1; all three service Jest configurations find zero `*.spec.ts` unit tests. |
| Integration test | No project script | NOT_AVAILABLE | No integration-test script/suite exists; P5 harness remains required. |
| Auth E2E | `pnpm --filter auth-service test:e2e` | STALE | Exit 1 before test execution: callable `supertest` namespace import TS2349 and ts-jest TS151002; source also has obsolete greeting casing expectation. |
| User E2E | `pnpm --filter user-service test:e2e` | STALE | Exit 1 before test execution: same TS2349/TS151002 test-tooling incompatibility. |
| Notification E2E | `pnpm --filter notification-service test:e2e` | STALE | Exit 1 before test execution: nonexistent `notification-service.module`, plus TS2349/TS151002. |
| Migration/database startup | `pnpm --filter user-service migration:check` | FAIL | Exit 1: `.env` supplies no `dbName`/`clientUrl`; no migration was run. |
| PostgreSQL connectivity | `docker compose up -d postgresql`; `pg_isready` | NOT_AVAILABLE | Docker/Compose and PostgreSQL client tooling not installed. |
| Redis connectivity | `docker compose up -d redis`; `redis-cli ping` | NOT_AVAILABLE | Docker/Compose and Redis client tooling not installed. |

`STALE` identifies invalid current test/tooling source, not a target regression. This
is a documented exclusion policy only; no test or production source was edited.

### 1.1 Environment record

| Component | Result |
|---|---|
| Node.js | PASS — portable `v24.19.0`; satisfies repository `>=20`. |
| pnpm | PASS — `10.17.0`; matches `packageManager`. |
| Workspace | PASS — pnpm workspace has 8 projects; frozen lockfile install succeeds. |
| `node_modules` | PASS — installed by frozen-lockfile command. |
| Docker / Docker Compose | NOT_AVAILABLE — not installed/on PATH. |
| PostgreSQL CLI (`psql`, `pg_dump`, `pg_restore`) | NOT_AVAILABLE. |
| Redis CLI (`redis-cli`) | NOT_AVAILABLE. |

## 2. Characterization and target-regression harness

| ID | Minimum assertions | Current evidence | Status / gate |
|---|---|---|---|
| RB-IDENT-001 | Login: gRPC user lookup, active-account check, password verification, token issue | `AuthService.login` | CHARACTERIZATION_TEST_REQUIRED — before Identity cutover |
| RB-IDENT-002 | Access token: type/JTI/session key; reject absent/revoked/inactive account | token management, Redis, JWT strategy | CHARACTERIZATION_TEST_REQUIRED — before Identity cutover |
| RB-IDENT-003 | Refresh emits access token from refresh context | `refreshToken` | CHARACTERIZATION_TEST_REQUIRED — before Identity cutover |
| RB-IDENT-004 | Logout removes JTI token key and later access is denied | `logout`, Redis, auth strategies | CHARACTERIZATION_TEST_REQUIRED — before Identity cutover |
| RB-IDENT-005 | Current authorization is only global `Admin/User` plus gateway/JWT checks | P0 audit and guards | CHARACTERIZATION_TEST_REQUIRED — explicitly not equivalent to P1 authorization |
| RB-MAIL-001 | Reset dispatch invokes notification gRPC and persists reset token | `sendResetPasswordLink` | CHARACTERIZATION_TEST_REQUIRED — before Identity/Communication cutover |
| RB-MAIL-002 | Reset template renders then SMTP/SES adapter sends | `EmailService.forgotPasswordMailer` | CHARACTERIZATION_TEST_REQUIRED — before Communication cutover |
| RB-MAIL-003 | Dispatch failure is logged, not returned as a delivery result | `sendResetPasswordLink` subscription handler | CHARACTERIZATION_TEST_REQUIRED — before Communication cutover |
| RB-PERM-001 | Tenant isolation, allow/deny, assignment, organization-wide, Platform Admin denial | Current source cannot model membership/tenant policy | TARGET_REGRESSION_TEST_REQUIRED — P5 harness; before Organization/domain cutover |
| RB-LC-001 | Valid/invalid transitions for Request, Job, Application, Interview, Offer | Current source has none of these domains | TARGET_REGRESSION_TEST_REQUIRED — module suite before each lifecycle enables |
| RB-CON-001 | Duplicate Application, Offer/headcount, idempotency, transactional outbox | Current source has none of these invariants | TARGET_REGRESSION_TEST_REQUIRED — database concurrency harness before relevant cutovers |

Target suites use approved P1 rule/use-case IDs and P3 ownership/transaction constraints.
They must not invent current business behavior solely to make tests green.

## 3. Stale-test exclusion policy

| ID | Test | Reason | Replacement evidence |
|---|---|---|---|
| E2E-STALE-001 | `apps/auth-service/test/app.e2e-spec.ts` | TS2349 callable namespace import; ts-jest TS151002; expected casing differs from actual greeting | RB-IDENT-001 through RB-IDENT-005; optional repaired health test |
| E2E-STALE-002 | `apps/notification-service/test/app.e2e-spec.ts` | Nonexistent imported module; TS2349 callable namespace import; ts-jest TS151002 | RB-MAIL-001 through RB-MAIL-003; optional repaired health test |
| E2E-STALE-003 | `apps/user-service/test/app.e2e-spec.ts` | TS2349 callable namespace import and ts-jest TS151002; greeting only even after tooling repair | RB-IDENT-001 through RB-IDENT-005 |

## 4. Backup and restore gate

### PostgreSQL — NOT_EXECUTED

Docker/database tools are unavailable. Before destructive migration, run the following
against a disposable or snapshot-controlled target, never an unverified production DB:

```powershell
docker compose up -d postgresql
docker compose exec -T postgresql pg_isready -U $env:DEFAULT_PG_USER -d $env:DEFAULT_PG_DATABASE
docker compose exec -T postgresql pg_dump -U $env:DEFAULT_PG_USER -Fc $env:DEFAULT_PG_DATABASE > .\backup-before-migration.dump
docker compose exec -T postgresql createdb -U $env:DEFAULT_PG_USER recruitment_restore_check
Get-Content -Encoding Byte .\backup-before-migration.dump | docker compose exec -T postgresql pg_restore -U $env:DEFAULT_PG_USER -d recruitment_restore_check --clean --if-exists
docker compose exec -T postgresql psql -U $env:DEFAULT_PG_USER -d recruitment_restore_check -c "SELECT count(*) FROM users;"
```

Acceptance: `pg_isready`, readable backup, isolated restore, `users` row-count and
identity/email reconciliation, migration-state check, and documented rollback owner.

### Redis — NOT_EXECUTED

| Key class | Recovery expectation |
|---|---|
| `user:<id>:info` and ephemeral locks | Cache/rebuildable; may be discarded intentionally. |
| `user:<id>:token:<jti>` | Session/revocation state; preserve or explicitly invalidate all sessions. |
| `user:<id>:reset_password` | Recovery state; preserve if compatibility requires it, otherwise explicitly invalidate outstanding links. |

Before destructive work: confirm persistence, export/snapshot and isolated restore,
sample keys/TTLs without logging token values, and approve session/recovery invalidation.
Compose requests AOF; that alone is not proof of a restore.

## 5. P6 foundation comparison

P6 added target-only technical code and did not alter legacy behavior. The following
results are comparison evidence, not a reclassification of legacy failures:

| Check | P6 result | Classification |
|---|---|---|
| `pnpm install --frozen-lockfile` | PASS, exit 0 | No dependency-resolution regression |
| `pnpm build` | PASS, 7/7 workspace tasks | No `NEW_P6_FAILURE` |
| `pnpm check-types` | PASS, 7/7 workspace tasks | No `NEW_P6_FAILURE` |
| `pnpm --filter @recruitment/api lint` | PASS, zero findings | P6 foundation validation |
| `pnpm --filter @recruitment/api test` | PASS, 7/7 tests | P6 foundation validation |
| Root `pnpm lint` | FAIL in legacy auth/user/notification services only | `EXISTING_BASELINE_FAILURE` |
| Root `pnpm test` | FAIL because legacy Jest suites have no unit-test matches; target foundation tests pass | `EXISTING_BASELINE_FAILURE` |
| `pnpm --filter @recruitment/api migration:check` with complete non-secret `TARGET_*` config | Config/mapping loaded; PostgreSQL connect returned `ECONNREFUSED 127.0.0.1:5432` | Existing unavailable-PostgreSQL environment gate; no migration ran |

The target outbox migration is additive technical infrastructure and is not executed.
PostgreSQL/Redis availability and backup/restore rehearsal remain mandatory before any
Identity data or domain cutover.
