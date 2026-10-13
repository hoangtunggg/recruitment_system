# P7 Identity Migration Readiness

**Status:** READY_FOR_TARGET_IMPLEMENTATION — cutover remains blocked by environment/data readiness  
**Phase:** P7 Identity Domain Migration  
**Date:** 2026-10-06  
**Scope:** pre-implementation evidence only; no Identity source, schema, route, or legacy behavior changed.

## 1. Authoritative requirements confirmed

The following are approved and sufficient as boundaries, but not as a complete secure
implementation specification:

| Requirement | Authority | Target scope |
|---|---|---|
| `UC-AUTH-001`–`006` | `USE_CASE_CATALOG.md` §2, §15 | Authentication, session end, credential recovery/change, Platform Admin account management, candidate registration, staff invitation acceptance |
| `BR-AUTH-001`–`007` | `BUSINESS_RULES.md` §2 | Identity is not a business role; backend authorization and server-derived identity |
| `BR-AUTH-008`, `013` | `P1-OD-003`, `067` | Candidate is independent of membership; normalized verified-email registration grants no staff authority |
| `BR-AUTH-014`, `015` | `P1-OD-068` | Non-enumerating reset, 15-minute single-use reset token, five requests/account/hour, reset revocation, TOTP/recovery-code policy |
| `BR-AUTH-016` | `P1-OD-069` | Account states and constrained Platform Admin lifecycle/recovery authority |
| `BR-AUD-004`, `007` | `P1-OD-067`–`069` | Security audit required; no password, token, OTP secret, recovery code, or raw reset token may be recorded |
| `PERM-PLATFORM-ACCOUNT-MANAGE`, `PERM-PLATFORM-ACCOUNT-LIFECYCLE-MANAGE` | `PERMISSIONS.md` | Platform metadata/lifecycle only; no impersonation, tenant-content access, or organization-role mutation |

P3 confirms Identity owns user, credentials, verified email, MFA, sessions and account
state; Organization owns membership, fixed organization roles, invitation lifecycle and
tenant authority. P4 maps legacy auth/user/Redis behavior to P4-MIG-005–008.

## 2. Initial blocker record

| ID | Severity | Missing approved decision | Affected implementation | Why it blocks |
|---|---|---|---|---|
| P7-ID-BLK-001 | CRITICAL | Password policy parameters: accepted algorithm/cost, minimum/maximum length, composition/breach policy, password-history/reuse rule | Candidate registration, login, password change/reset | Resolved by explicit 2026-10-06 approval; see `P7_IDENTITY_SECURITY_DECISIONS.md` §2. |
| P7-ID-BLK-002 | CRITICAL | Email-verification challenge expiry, reuse/rotation and resend rate-limit policy | Candidate registration and verification | Resolved by explicit 2026-10-06 approval; see `P7_IDENTITY_SECURITY_DECISIONS.md` §3. |
| P7-ID-BLK-003 | CRITICAL | Access-token signing algorithm/key source/rotation, access/refresh TTLs, refresh replay/rotation family policy | Login, access/refresh session lifecycle, token verification | Resolved by explicit 2026-10-06 approval; see `P7_IDENTITY_SECURITY_DECISIONS.md` §4. |
| P7-ID-BLK-004 | CRITICAL | TOTP-secret encryption/key-management and verified lost-factor support procedure | MFA enrollment, verification, disable/recovery | Resolved by explicit 2026-10-06 approval; see `P7_IDENTITY_SECURITY_DECISIONS.md` §5. |
| P7-ID-BLK-005 | HIGH | Published Organization invitation-acceptance port and invitation data contract | `UC-AUTH-006` staff acceptance | Resolved for Identity design by `P7_IDENTITY_ORGANIZATION_INVITATION_CONTRACT.md`; invitation/membership/roles remain Organization-owned and runtime Organization work is not authorized. |
| P7-ID-BLK-006 | HIGH | PostgreSQL/Redis environment, legacy Identity data inventory, backup/restore and reconciliation evidence | Identity migration validation/cutover | P4 explicitly requires these before any Identity data migration or cutover. Docker, PostgreSQL and Redis remain unavailable. |

## 3. Legacy characterization inventory

| Current component | Observed behavior | Target treatment |
|---|---|---|
| `apps/auth-service/src/modules/auth/auth.service.ts` | gRPC User lookup, JWT with global role, Redis JTI/reset token, direct notification gRPC | Retain active. Do not import/copy it into target. Target replaces only after approved security policy and compatibility/data validation. |
| `apps/user-service/src/data-access/user/user.entity.ts` | One legacy `users` table, global role field, password hash and basic MFA flag | Retain active. Target Identity cannot infer data conversion, email normalization or membership meaning from this schema. |
| `libs/core/src/auth/**` | Gateway header/global role trust | Explicitly incompatible with P3; target must verify signed tokens itself after P7-ID-BLK-003 is resolved. |
| `libs/core/src/redis/**` | Redis JTI/reset keys, including pattern deletion | Retain for legacy. Target session/revocation store requires P7-ID-BLK-003 and P7-ID-BLK-006 validation. |

## 4. Traceability status

| Requirement family | Rule/permission | Planned target owner | Code/API/test status |
|---|---|---|---|
| Authenticate/end session | `UC-AUTH-001/002`; `BR-AUTH-001/004` | Identity application/API + session persistence | READY for non-destructive target implementation; cutover/data validation blocked by P7-ID-BLK-006 |
| Credential recovery/change and MFA | `UC-AUTH-003`; `BR-AUTH-014/015`; `BR-AUD-004/007` | Identity application/API + credential/session persistence | READY for non-destructive target implementation; cutover/data validation blocked by P7-ID-BLK-006 |
| Platform account management | `UC-AUTH-004`; lifecycle permissions; `BR-AUTH-012/016` | Identity application/API; Governance audit intent | READY for target design/implementation; cutover data validation remains blocked |
| Candidate registration | `UC-AUTH-005`; `BR-AUTH-008/013` | Identity application/API; Candidate profile remains separate | READY for target implementation; cutover/data validation blocked by P7-ID-BLK-006 |
| Staff invitation acceptance | `UC-AUTH-006`; `BR-AUTH-010/013`; `BR-AUD-007` | Identity acceptance adapter + Organization published port | READY against the resolved design contract; Organization runtime implementation remains future work |

No target API, persistence migration, Identity entity, controller, security event, or
test is marked implemented. This preserves the P7 prohibition on inventing security
policy or putting Organization membership logic in Identity.

## 5. Conditions before implementation and cutover

1. Apply the approved `P7-ID-BLK-001` through `004` baseline without broadening its
   authorization or Organization-ownership constraints.
2. Use the published Organization invitation-acceptance contract without moving
   Organization ownership into Identity; its runtime implementation remains future work.
3. Before data migration or cutover, provide non-production PostgreSQL and Redis, execute the P4 backup/restore and
   Identity data inventory/reconciliation gate, then run database-backed uniqueness,
   token reuse/revocation and concurrency tests.

Legacy remains `LEGACY_ACTIVE` and target traffic remains inactive. A subsequent P7
implementation task may create non-destructive target Identity code; no cutover,
destructive migration, legacy removal, or Organization implementation is authorized
by this readiness assessment.

## 6. Blocker-resolution update

| ID | Current status | Disposition |
|---|---|---|
| `P7-ID-BLK-001` | RESOLVED | Explicit user approval, 2026-10-06; password baseline in `docs/architecture/P7_IDENTITY_SECURITY_DECISIONS.md` §2. |
| `P7-ID-BLK-002` | RESOLVED | Explicit user approval, 2026-10-06; verification baseline in the security decision record §3. |
| `P7-ID-BLK-003` | RESOLVED | Explicit user approval, 2026-10-06; access/refresh/session/key baseline in the security decision record §4. |
| `P7-ID-BLK-004` | RESOLVED | Explicit user approval, 2026-10-06; TOTP, secret protection and controlled recovery baseline in the security decision record §5. |
| `P7-ID-BLK-005` | RESOLVED_FOR_IDENTITY_DESIGN | Published ownership-safe contract is in `docs/architecture/P7_IDENTITY_ORGANIZATION_INVITATION_CONTRACT.md`; runtime Organization implementation remains future work. |
| `P7-ID-BLK-006` | OPEN — CUTOVER_ONLY | Environment/data readiness remains unavailable, but after 001–004 approval it does not prevent non-destructive target Identity implementation. It still blocks database validation and cutover. |

## 7. Identity data migration readiness — execution plan

### Known legacy inventory

| Area | Current evidence | Target migration treatment |
|---|---|---|
| User identifier | Legacy `users.id` UUID primary key | Preserve as stable source identifier; reconcile every source ID to exactly one target Identity user. |
| Email | Legacy `users.email` lacks a database uniqueness constraint | Compute normalized-email duplicate report before creating target unique index; do not choose a survivor automatically. |
| Credential | Legacy `users.password` is a password hash, but hash algorithm/parameters need inventory | Classify hashes by prefix/algorithm; preserve compatible hashes only after approved verifier compatibility test, otherwise force approved reset. |
| Verification/account state | `emailVerified`, `isActive`, legacy global `role` | Map verification/state only after review: `emailVerified=false` cannot be assumed equivalent to a newly issued challenge; global role must not migrate to Organization role. |
| MFA | `is_2fa_enabled` only | Do not infer enrolled secret/recovery state; require re-enrollment unless an audited, decryptable approved migration source exists. |
| Sessions/reset | Redis `user:<id>:token:<jti>`, `user:<id>:reset_password` | Do not copy raw token/reset values. Choose explicit invalidation or verified hash/session migration after P7 security approval. |
| Profile fields | Name/contact/profile fields | Identity migrates only identity-owned account metadata; Candidate profile ownership remains a later Candidate migration. |

### Mandatory database/Redis checks when tooling is available

```sql
-- normalized-email conflicts: must be reviewed before adding target uniqueness
select lower(trim(email)) as normalized_email, count(*)
from users
group by lower(trim(email))
having count(*) > 1;

-- account-state and verification inventory; no automatic mapping until reviewed
select is_active, email_verified, role, count(*)
from users
group by is_active, email_verified, role;
```

Run the following in a non-production/snapshot-controlled environment only:

1. execute the P4 PostgreSQL backup/isolated restore rehearsal;
2. record source row count, distinct UUID count, normalized-email duplicate/conflict
   list, password-hash algorithm distribution, verification/account-state distribution
   and MFA metadata availability;
3. inventory Redis key count/TTL categories without logging values; classify every
   session/reset key as invalidate, preserve-hash, or replay under approved policy;
4. run additive Identity migration against a restored copy, then reconcile source and
   target UUID/email/state counts and exception list;
5. prove target unique email constraint, reset-token single-use, refresh replay
   revocation and concurrent registration with database-backed tests;
6. retain rollback by keeping legacy authoritative and target traffic inactive until
   reconciliation, characterization and security tests pass.

Docker, PostgreSQL and Redis tooling remain unavailable in the current environment;
none of the above is claimed as executed or PASS.

## 8. P7 implementation evidence — partial and inactive

The target contains additive Identity user/token/session entities, a target-only
migration, repository boundary, password policy/Argon2id implementation, and initial
registration, verification, login, refresh, logout, and password-reset application
paths. The migration was not executed. Runtime adapters for the breached-password
provider, KMS-backed ES256 signing/TOTP encryption, and Governance audit persistence
are intentionally fail-closed until separately configured; they are not substitutes
for those integrations.

No Organization behavior, membership, role, candidate profile, legacy source,
runtime routing, data migration, or cutover was changed. MFA lifecycle, account
lifecycle API, staff invitation runtime orchestration, and database-backed
concurrency/characterization tests remain incomplete.

TOTP/recovery-code primitives now provide the approved SHA-256, six-digit,
30-second, ±1-step verification and ten-code generation behavior. This is only
unit-level evidence: secret encryption, one-time persistence consumption, enrollment,
disable, recovery, and privileged enforcement remain incomplete.

MFA persistence schema now includes encrypted-secret metadata on the Identity user and
hashed, consumable recovery-code rows. The additive migration remains unexecuted.
Schema constraints are `IMPLEMENTED_IN_SCHEMA`; recovery-code race behavior is
`PENDING_DATABASE_VALIDATION`. Production secret protection remains fail-closed;
the deterministic protector is test-only, so KMS deployment validation is
`PENDING_DEPLOYMENT_VALIDATION`.

The earlier P6 foundation test failure is resolved as a package-command working
directory issue, not an Identity or MikroORM source defect. The target foundation
passes when executed from `apps/api`; see `RESTRUCTURE_TRACKER.md` §27.
