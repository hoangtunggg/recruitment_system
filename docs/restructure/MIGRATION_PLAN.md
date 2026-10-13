# P4 Migration Plan — Controlled Current-to-Target Transition

**Status:** APPROVED — plan only; implementation is not authorized by this artifact  
**Phase:** P4 — Current → Target Gap Analysis  
**Date:** 2026-10-05  
**Map:** [MIGRATION_MAP.md](./MIGRATION_MAP.md) is the item-level source of truth.
**Baseline evidence:** [REGRESSION_BASELINE.md](./REGRESSION_BASELINE.md).

## 1. Objective and non-goals

Transition the current NestJS auth/user/notification starter into the P3 Modular
Monolith without losing identity data, relaxing tenant isolation, or deleting a legacy
capability before its replacement has been implemented and validated. This plan does
not authorize code changes, source moves, database migrations, deployment changes, or
legacy cleanup. It does not introduce AI/ML, matching/scoring, RAG, generic business
`common/core`, extra business microservices, or out-of-scope integrations.

## 2. Entry gate for P5

P5 entry was approved after the executed baseline in
[`REGRESSION_BASELINE.md`](./REGRESSION_BASELINE.md): frozen install, build and
typecheck pass; lint/unit failures and stale E2E suites are classified. P5 creates
only the target skeleton. The remaining test, database and recovery evidence blocks
cutover, not skeleton creation.

| Required evidence | Current state | Owner phase | Gate result now |
|---|---|---|---|
| Repeatable install/build/typecheck/lint/test command inventory | Executed and classified | P4 Enablement | DONE |
| Repair/quarantine known stale E2E tests with evidence | Auth/User SuperTest/ts-jest stale; Notification also has missing module | P4 Enablement | DONE — repair remains a pre-cutover test task |
| Characterization tests for retained auth/user/mail behavior | Planned with stable pre-cutover gates | P6/domain migration | BLOCKED for cutover only |
| User/Redis data inventory and backup/restore rehearsal | Not executed; Docker/database tooling unavailable | P6 before identity cutover | BLOCKED for data migration only |
| Target test harness for P1 permissions/lifecycles/concurrency | Missing, with named required harnesses | P6/domain migration | BLOCKED for domain cutover only |

## 3. Execution sequence and dependency chain

The following is the mandatory capability order. Each row begins only after its own
preconditions and earlier cutover validation pass. A later phase may implement the
row; P4 assigns neither an implementer nor a schedule.

| Order | Capability | Map IDs | Depends on | Required cutover proof | Cannot retire yet |
|---|---|---|---|---|---|
| 0 | Baseline and technical seams | 001–004, 026, 030–034 | P5 entry gate | Repeatable quality commands; current auth/data characterization; target test harness | All legacy apps/libs/infrastructure |
| 0.5 | Transactional outbox/event-delivery foundation | 019 | PostgreSQL migration framework; ADR-P3-005 | Atomic write, versioned event envelope, retry/idempotency and recovery proof | No communication flow may rely on it until its validation passes |
| 1 | Identity | 005–008 | Baseline, data inventory, target security contract, outbox foundation for governed side effects | Account/data reconciliation; issuer/audience/session verification; recovery/MFA; no header trust; audit evidence | auth-service, user-service, legacy auth/Redis helpers |
| 2 | Organization | 009 | Identity subject and policy ports | Membership, fixed-role union, tenant isolation, approval config and Platform Admin boundary | Global `User.role`/RBAC paths |
| 3 | Candidate | 010 | Identity; Organization access context where tenant interaction is required | Candidate self-scope, resume version/snapshot input, privacy boundary | Nothing absent may be treated as legacy replacement |
| 4 | Recruitment Planning | 011 | Organization and approval configuration | Request lifecycle, approval and headcount invariant/concurrency | Nothing absent may be treated as legacy replacement |
| 5 | Job | 012 | Organization, approved Request context | Job lifecycle/linkage and tenant/audit checks | Nothing absent may be treated as legacy replacement |
| 6 | Application | 013 | Candidate, Job, Organization | Immutable snapshot and database-backed duplicate invariant; lifecycle tests | Nothing absent may be treated as legacy replacement |
| 7 | Interview | 014 | Application port and Organization assignments | Scheduling/feedback lifecycle, least-privilege visibility, notifications/audit | Nothing absent may be treated as legacy replacement |
| 8 | Offer | 015 | Application and Planning public ports | Approval/send/response/expiry plus concurrent confirm-hire/headcount proof | Nothing absent may be treated as legacy replacement |
| 9 | Communication | 016–018 | Identity mail use case; validated transactional outbox foundation (019) | Idempotent outbox dispatch, delivery history/retry/final-failure and templates | notification-service, gRPC notification contract |
| 10 | Governance | 028 | Validated outbox foundation (019); all governed domain commands | Append-only/redacted audit writes and authorized tenant-scoped audit reads | Request logging as a claimed audit substitute |
| 11 | Legacy retirement | 020–025, 027, 029, 032, 035 | Every replacement proof and approved compatibility/deployment decision | Import/deployment/reference scans, full regression, data reconciliation and rollback evidence | Delete only the item proven unused by its map condition |

### 3.1 Outbox/Governance dependency resolution

`P4-MIG-019` is now a technical foundation at order 0.5, before every dependent
Communication item. It owns only outbox storage and event-delivery mechanics;
`P4-MIG-028` remains the Governance business-domain migration at order 10 and owns
audit records/security-event traceability. Thus the executable dependency is
`019 → 016/018` and `019 → 028`; neither edge points backward in the plan and neither
changes business ownership.

### 3.2 Coexistence rules

1. A target module accesses another module only via its published application port;
   it never reads or writes another module's private tables/repositories.
2. A target write uses an additive, reversible schema migration and records audit/outbox
   intent in the same local transaction where P3 requires it.
3. User identity records are copied/reconciled before the target becomes authoritative;
   email uniqueness and organization ownership are never inferred from request input.
4. Compatibility routing has an explicit expiry and telemetry. It is removed only after
   the corresponding target flow, data reconciliation and regression validation pass.
5. A data migration has a backup, rollback/replay, row-count reconciliation and a
   documented owner before it executes. Application startup never performs it.
6. No current gRPC, APISIX header trust, Kong, generic `common/core`, or unused
   integration component is removed merely because its target is planned.

## 4. High-risk migrations and required controls

| Risk area | Why it is high risk | Required control before cutover |
|---|---|---|
| Identity data and credentials | Current user table has the account data; email has no database unique constraint | Backup/restore rehearsal, duplicate-email remediation decision, row/hash reconciliation, authentication regression suite |
| Token/gateway trust | Current services parse APISIX `x-auth-user`; target must verify token itself | Direct-service isolation and spoofed-header rejection tests; issuer/audience/session tests |
| Tenant authorization | Current global `Admin/User` cannot represent P1 roles/scopes | Organization first; permission + membership + ownership + state tests on every sensitive public port |
| Application duplicate/snapshot | New invariant with no current implementation | Database constraint, concurrent submit test, immutable snapshot test |
| Offer/confirm-hire/headcount | Cross-domain immediate invariant; no existing code | Transactional orchestration with concurrent confirm-hire/retry/idempotency tests |
| Audit/outbox/mail | Current mail is a direct non-durable gRPC call | Atomic audit/outbox write, idempotent worker and final delivery-failure evidence |
| gRPC and gateway retirement | Auth/user/mail are wired through gRPC and current ingress | Full replacement traffic/contract tests plus deployment/import scans before removal |

## 5. Dependency blockers

| ID | Blocker | Effect | Resolution evidence |
|---|---|---|---|
| P4-BLK-001 | No reliable regression baseline | Blocks P5 entry and every cutover claim | §2 evidence complete and recorded |
| P4-BLK-002 | Current identity data quality/ownership has not been measured | Blocks safe Identity/Organization data migration | User/Redis inventory, duplicate email review, backup/restore/reconciliation plan |
| P4-BLK-003 | No approved compatibility window for current `/auth`, `/user`, `/notification` consumers | Blocks retirement dates for services/gRPC | Product/operational owner records client inventory and retirement decision |
| P4-BLK-004 | Retention legal parameters remain external policy | Does not block P4/P5 skeleton; blocks implementation of final retention/deletion behavior | Jurisdiction, duration, legal hold and deletion procedure from Privacy/Legal (`P1-OD-005`) |
| P4-BLK-005 | Current runtime/deployment references to Kong and unused integrations are not independently verified | Blocks their physical removal | Deployment owner confirmation and manifest/secret/reference scan |

## 6. P4 completion and P5 handoff

P4 is complete when every material CURRENT responsibility has a target owner or an
explicit retirement condition, its action and dependency are recorded, and no legacy
component is implicitly authorized for removal. P5 has now established the inactive
target skeleton without changing current traffic or behavior.

P6 Technical Foundation is complete: target-only configuration, database/migration,
HTTP/error/validation/pagination, security/authorization, observability/audit, and
outbox/idempotency foundations exist with focused tests. Its additive outbox migration
has not been executed. The next phase is P7 Domain Migration only when separately
authorized; no domain cutover may precede its required test, data, and recovery gates.
