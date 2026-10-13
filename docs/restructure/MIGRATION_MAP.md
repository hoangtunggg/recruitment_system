# P4 Migration Map — Current to Target

**Status:** APPROVED — planning artifact only  
**Phase:** P4 — Current → Target Gap Analysis  
**Date:** 2026-10-05  
**Authorities:** [P0 Current State Audit](./CURRENT_STATE_AUDIT.md), [P3 Target Architecture](../architecture/TARGET_ARCHITECTURE.md), [P3 decision records](../architecture/P3_DECISION_RECORDS.md), and approved P1 product sources routed by `AGENTS.md`.

## 1. Reading this map

This is an inventory by **responsibility**, not a folder-move script. `MOVE` means a
small, bounded implementation can be transplanted after compatibility tests; it never
authorizes an immediate filesystem move. `REFACTOR` preserves a capability while
changing its boundary, contract, or security behavior. `REWRITE` means the current
implementation is absent or materially incompatible. `DELETE` means retire only after
the stated replacement/no-runtime-reference condition. `KEEP` means retain in place
for the migration unless a subsequent implementation task changes it.

P5 created the inactive target application at `apps/api`, and P6 implemented only its
technical foundation. Target module paths are now
`apps/api/src/modules/<module>/{api,application,domain,infrastructure}` and narrow
technical paths are `apps/api/src/platform/<area>`. These are structural boundaries
only; domain paths contain no migrated business logic, routes, traffic, or legacy
imports. P6 has an additive technical-only `outbox` mapping/migration and no
business-domain schema. A blank target path remains intentional when a component must
disappear rather than be migrated.

## 2. Migration inventory

| ID | Current path/component | Current responsibility | Target domain/module and target path | Action | Dependencies / prerequisites | Risk | Validation required | Legacy removal condition | Order |
|---|---|---|---|---|---|---|---|---|---|
| P4-MIG-001 | Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, TypeScript/Nest workspace configuration | Builds the three-service starter workspace | Platform build; retained root configuration | KEEP | Reproducible install and command inventory | Low | `pnpm` install, build/typecheck/lint command baseline recorded | N/A; replacement app can coexist in workspace | 0 — baseline |
| P4-MIG-002 | Root `docker-compose.yml`, `.env.example` | Local PostgreSQL, Redis, APISIX/etcd and development configuration | Deployment/platform configuration | REFACTOR | Secret inventory; target API/worker topology; no production values copied | High — current config may imply unsafe trust or stale dependencies | API/worker/database/Redis reachability, secret injection, direct-service access denied | Remove superseded values only after target compose/deployment is validated | 0 — baseline |
| P4-MIG-003 | `libs/common/src/dto`, validation, generic HTTP error/filter/response pieces | Shared HTTP DTO, validation and error helpers with inconsistent current response behavior | `platform/http` | REFACTOR | ADR-P3-007 API/error convention; target contract tests | Medium | Problem-detail, validation, pagination and versioned DTO contract tests | No target imports from these legacy exports; all active API routes use target adapters | 0 — baseline |
| P4-MIG-004 | `libs/common/src/utilities/{hash,random,time,string,validation}.util.ts` | Narrow crypto/random/time/string/validation helpers | `platform/security` and `platform/*` | MOVE | Per-helper dependency/security review; no business rule embedded | Medium | Unit tests, secure random/hash review, no legacy import remaining for moved helper | Replacement helper passes tests and all consumers are migrated | 0 — baseline |
| P4-MIG-005 | `apps/auth-service/src/modules/auth/**` | Login, signup, refresh, logout, password reset/change | Identity; `modules/identity` | REFACTOR | P4-MIG-006/007; P1 `BR-AUTH-*`; ADR-P3-004 | Critical — token trust, recovery, MFA/session rules and endpoint compatibility | Authentication/recovery non-enumeration, token issuer/audience/revocation, session, MFA, rate-limit and audit tests | Target Identity flows validated and legacy endpoint compatibility/retirement decision executed | 1 — Identity |
| P4-MIG-006 | `apps/user-service/src/data-access/user/**`, `modules/user/**`, MikroORM migration | User record, password hash, basic profile, repository and mapper | Identity; `modules/identity/infrastructure` and `identity` schema | REFACTOR | Account data inventory, normalized-email plan, P4-MIG-001 baseline | Critical — credential/account history loss; current DB lacks email unique constraint | Backup/restore rehearsal, row reconciliation, unique-email migration test, password verification, soft-delete/account-state tests | Identity data copied/reconciled and target reads/writes are authoritative | 1 — Identity |
| P4-MIG-007 | `libs/core/src/auth/**`, `libs/core/src/redis/**`, JWT/Redis config | Gateway-header auth, global RBAC, JTI cache/session utilities | Identity plus `platform/security` | REWRITE | P1 role/tenant approvals; ADR-P3-004; P4-MIG-006 | Critical — spoofable header model and global roles violate tenant isolation | Token verification, header-spoof rejection, tenant isolation, candidate self-scope, Platform Admin denial, session-revocation tests | Target policy enforcement runs at API and public module ports; no application trusts `x-auth-user` | 1 — Identity |
| P4-MIG-008 | `apps/user-service/src/commands/create-admin.*`, legacy `Role` enum/decorators/guards | Bootstrap global admin and `Admin/User` RBAC | Identity platform-account operations + Organization membership authorization | REWRITE | P4-MIG-007; P1 `PERM-*`, `BR-ORG-*`, `BR-AUTH-*` | Critical — broad privilege or Platform Admin tenant-content exposure | Fixed-role union, membership activation, approval authority, least-privilege and cross-tenant denial tests | Target provisioning and authorization validated; old global-role path has no callers/data dependency | 1–2 — Identity → Organization |
| P4-MIG-009 | No current component | Organization, Membership, assignment, organization/tenant and approval configuration | Organization; `modules/organization` and `organization` schema | REWRITE | P4-MIG-006–008; approved P1 Organization/Permission sources | Critical — every tenant-owned domain depends on authoritative scope | Membership/role-union, assignment, approval-config, tenant-leading query and cross-tenant denial tests | N/A — greenfield target owner | 2 — Organization |
| P4-MIG-010 | No current component | Candidate profile, resume versions and preferences | Candidate; `modules/candidate` and `candidate` schema | REWRITE | Identity subject port; P1 candidate rules/use cases | High — global candidate identity must not leak into tenant data | Candidate self-scope, resume-version immutability and access tests | N/A — greenfield target owner | 3 — Candidate |
| P4-MIG-011 | No current component | Recruitment Request, approval history, headcount | Recruitment Planning; `modules/recruitment-planning` and schema | REWRITE | Organization authorization/configuration; P1 Request lifecycle | High — approval/headcount invariant | Full transition, approval-authority, audit and headcount concurrency tests | N/A — greenfield target owner | 4 — Recruitment Planning |
| P4-MIG-012 | No current component | Job and publication linked to Recruitment Request | Job; `modules/job` and schema | REWRITE | P4-MIG-009, P4-MIG-011; P1 Job lifecycle | High — only approved/capable Requests can open jobs | Job transition, request linkage, tenant scope and audit tests | N/A — greenfield target owner | 5 — Job |
| P4-MIG-013 | No current component | Application, immutable submission snapshot, screening/pipeline, rejection and `HIRED` outcome | Application; `modules/application` and schema | REWRITE | Candidate, Job, Organization; P1 Application lifecycle/snapshot/duplicate rules | Critical — one-Application uniqueness and immutable historical snapshot | Constraint and concurrent duplicate tests; state transition, snapshot and tenant tests | N/A — greenfield target owner | 6 — Application |
| P4-MIG-014 | No current component | Interview rounds, scheduling, assignments, feedback and scorecards | Interview; `modules/interview` and schema | REWRITE | Application public port; Organization assignment; P1 Interview lifecycle/feedback rules | High — assignment visibility and immutable feedback policy | Interview transition, assignment, feedback lock, authorization, notification/audit tests | N/A — greenfield target owner | 7 — Interview |
| P4-MIG-015 | No current component | Offer version, approval, send, response, expiry/withdrawal | Offer; `modules/offer` and schema | REWRITE | Application/Planning public ports; P1 Offer lifecycle/headcount rules | Critical — offer acceptance must not reserve capacity; confirm-hire concurrency | Offer state/idempotency, approval, expiry, concurrent confirm-hire and audit tests | N/A — greenfield target owner | 8 — Offer |
| P4-MIG-016 | `apps/notification-service/src/modules/{email,send-mail}/**` | SMTP/SES password-reset message delivery by gRPC; no history | Communication; `modules/communication/infrastructure` and optional worker | REFACTOR | P4-MIG-019 transactional outbox foundation; identity mail flow; provider credential review | High — direct send can lose delivery trace or duplicate on retry | Outbox dispatch, idempotency, retry/final-failure record, template rendering and no-state-rollback tests | Target delivery history/retry validated and identity no longer calls notification service | 9 — Communication |
| P4-MIG-017 | `libs/email-template/**` | React email layout and reset-password template | Communication templates; target template package/path selected in P5 | MOVE | P4-MIG-016 template contract and content/security review | Medium | Rendering/snapshot and safe-link tests | Target renderer uses template; no legacy service import remains | 9 — Communication |
| P4-MIG-018 | `libs/common/src/events/{notification,user}.event.ts` | gRPC-oriented event message shapes | Communication/Governance public event contracts | REWRITE | P4-MIG-019; ADR-P3-005 event schema/versioning rules | High — events lack target envelope and durable delivery guarantee | Transactional outbox, event envelope/version, correlation and duplicate-consumer tests | Outbox events replace all consumers; no gRPC event call remains | 9 — Communication |
| P4-MIG-019 | No current component | Transactional outbox storage, immutable event envelope and delivery-dispatch contract; technical foundation only | `outbox` schema plus `platform/persistence`/worker adapter; no business-domain owner | REWRITE | PostgreSQL migration framework; ADR-P3-005 | Critical — a non-atomic event path can lose or duplicate side effects | Atomic state/audit-intent/outbox write, event schema/version, retry/idempotency, lag/failure/recovery tests | Foundation is used only through public technical contract and has no pending/legacy caller | 0.5 — technical prerequisite before Communication |
| P4-MIG-028 | No current component | Append-only audit records and security-event traceability | Governance; `modules/governance` and `governance` schema | REWRITE | P4-MIG-019; P1 audit rules; ADR-P3-005 | Critical — audit must be atomic, redacted and tenant-safe | Atomic rollback, redaction, tenant audit-read and governed-command coverage tests | N/A — greenfield target owner | 10 — Governance |
| P4-MIG-020 | `libs/common/src/grpc/**`, service consumers/clients and gRPC config | Inter-service RPC/proto contracts | No target equivalent; public in-process ports replace it | DELETE | P4-MIG-005/006/016 and all target module ports validated | Critical — premature deletion disconnects auth/user/mail flows | No gRPC listeners/clients/imports, target API contract and end-to-end replacement tests | All production paths use in-process ports/outbox; compatibility window ended | 11 — legacy retirement |
| P4-MIG-021 | `libs/core/src/microservice/**`, TCP config, microservice interceptors/status utility | Legacy service bootstrapping/TCP and RPC response behavior | No target equivalent | DELETE | P4-MIG-020; target API/worker deployed | High — stale runtime bootstrap can hide residual dependency | Static import scan, API/worker startup and failure-handling tests | No workspace package imports or deploys legacy microservice infrastructure | 11 — legacy retirement |
| P4-MIG-022 | `config/apisix/**`, APISIX references in Compose | Current HTTP edge routing/JWT claim-header injection | Target ingress configuration; exact managed-ingress location selected by deployment work | REFACTOR | ADR-P3-004/008; P4-MIG-005/007 | Critical — target must reject header spoofing and API verifies tokens itself | TLS/route tests, direct-service network denial, spoof-header rejection, auth verification test | Target ingress/API validation deployed and APISIX replacement configuration accepted | 11 — legacy retirement |
| P4-MIG-023 | `docker-compose-kong.yml`, `config/kong/**`, Kong env/volume references | Stale alternate gateway artifacts | No target equivalent | DELETE | P4-MIG-022 and repository-reference scan | Medium — deletion before confirming no operational user | Deployment owner confirms not used; no manifest/docs/runtime reference | One chosen ingress is validated and no Kong deployment remains | 11 — legacy retirement |
| P4-MIG-024 | `libs/common/src/config/{grpc,tcp,kafka,rabbitmq,payment,chat,firebase,google,aws-s3}.config.ts`; matching `libs/core` adapters | Unused/starter external transport and out-of-scope integration configuration | No target equivalent in approved P1/P3 scope | DELETE | Runtime reference/deployment-secret inventory; P4-MIG-016 keeps only SMTP/SES need | High — hidden consumers or secrets can be missed | Reference scan, build, deployment/config inventory; no approved target capability depends on it | No active source/config/deployment reference and no approved integration owner | 11 — legacy retirement |
| P4-MIG-025 | `libs/common/src/enums/app.enum.ts`, `decorators/{rbac,access-control,user}.ts`, `core/base/**` | Global role metadata, request-user parsing and generic entity/repository/service base classes | Organization authorization, Identity context; module-local domain/persistence code | REWRITE | P4-MIG-007–009; target package boundaries | Critical — generic base and global roles can bypass domain ownership/policy | No direct global role check, policy/tenant/ownership tests, module dependency test | Each domain owns its model/repository; no business import remains from `common/core` | 11 — legacy retirement |
| P4-MIG-026 | Existing `apps/*/test/**`, no domain tests, root test scripts | Shallow/stale service E2E tests; no reliable regression suite | `platform/testing` and module-local tests | REWRITE | P4-MIG-001; current behavior inventory; P1 traceability | Critical — no safety net for identity/data cutover | P5 regression baseline in §3; test command results recorded and repeatable | Replacement suites cover retained behavior and legacy tests are either repaired or explicitly retired with replacement evidence | 0 then every order |
| P4-MIG-027 | Root README, AI/service/transport documentation and legacy ADRs without status | Overstated AI/microservice/product claims | Documentation governance; current/P1/P3/P4 sources | DELETE | P1/P3/P4 approved sources; documentation owner review | Medium — contributors may follow obsolete guidance | Link/status audit; no active router points at legacy claims | Replacement authoritative docs are linked and legacy material is archived/deprecated/removed by approved cleanup task | 11 — legacy retirement |
| P4-MIG-029 | `libs/core/src/http/**` | Axios wrapper/module; static reference scan found definitions only, no application consumer | No target owner; external HTTP client is not a P1/P3 capability | DELETE | Re-run workspace import scan after dependencies are installable; deployment integration inventory | Low — an unobserved runtime consumer could be missed | Build/typecheck and import scan show no consumer; no approved integration needs it | No source/deployment import or approved integration owner remains | 11 — legacy retirement |
| P4-MIG-030 | `libs/common/src/docs/**`, `decorators/api-document.decorator.ts` | Swagger bootstrap and endpoint documentation decorators; used by all three app controllers/auth endpoints | `platform/http/openapi` | REFACTOR | ADR-P3-007; API version/authorization contract | Medium — current documentation can expose stale routes/security schemes | Target OpenAPI generation and route/security contract tests | Target API documentation replaces legacy decorators on active routes | 0 then target API cutover |
| P4-MIG-031 | `libs/common/src/middlewares/http-logger.middleware.ts` | Redacted HTTP request logging; registered by all three current apps | `platform/observability/http` | REFACTOR | ADR-P3-008; log redaction/correlation policy | Medium — `req.user` and recruitment content need target-safe fields | Redaction, correlation-ID, security-event and no-secret logging tests | Target observability middleware is installed and validated | 0 then target API cutover |
| P4-MIG-032 | `libs/common/src/pipes/file-validation.pipe.ts` | Generic upload MIME/size validation; static reference scan found definition only | No target owner; file upload/storage is outside approved P1/P3 scope | DELETE | Re-run workspace import scan; confirm no approved file/resume-upload design introduces it | Low — a future resume upload feature might need a new domain-owned validator | Build/typecheck/import scan proves no consumer; P1 scope remains unchanged | No caller and no approved target file capability exists | 11 — legacy retirement |
| P4-MIG-033 | `libs/common/src/utilities/error.util.ts` | Safe error-object projection; used by HTTP logger and exception filter | `platform/http` and `platform/observability` | REFACTOR | P4-MIG-003, P4-MIG-031; ADR-P3-007 | Medium — target problem details/logging must not leak secrets | Problem-detail and log-redaction tests | Target error mapping/log projection replaces all imports | 0 then target API cutover |
| P4-MIG-034 | `libs/common/src/utilities/log.util.ts` | Winston configuration and bootstrap logging; used by all three current apps | `platform/observability` | REFACTOR | ADR-P3-008; P4-MIG-031 | Medium — current service listener messages conflict with target process topology | Structured-log/metric/trace and redaction tests for API/worker | Target bootstrap observability runs in all target processes | 0 then target API/worker cutover |
| P4-MIG-035 | `libs/common/src/utilities/rrule.util.ts` | Recurring-event helper; static reference scan found definition only | No target owner; recurrence/calendar is outside approved P1/P3 scope | DELETE | Re-run workspace import scan; confirm no approved lifecycle requires recurrence | Low — no current caller, but future scheduling scope would need a domain-owned design | Build/typecheck/import scan proves no consumer and P1 scope remains unchanged | No caller and no approved target recurrence capability exists | 11 — legacy retirement |

## 3. Required regression baseline before P5

P5 must not treat existing tests as a safety net until the following evidence exists:

1. a reproducible clean install, build, typecheck, lint and every current test command,
   with observed pass/fail output and known failures classified;
2. repaired or explicitly quarantined stale shallow E2E tests (notably the nonexistent
   Notification module import and Auth expectation mismatch), with no false claim that
   they protect behavior;
3. characterization/API tests for retained current Identity behavior: signup, login,
   refresh, logout, password reset/change, account activation/deactivation, gateway
   access and email dispatch invocation;
4. a PostgreSQL/Redis data inventory plus backup/restore and row-count/hash-verification
   rehearsal for `users` and session/reset state;
5. P1-derived target acceptance suites: tenant isolation and fixed roles; all five
   lifecycle transitions; Application duplicate/snapshot rules; Interview feedback;
   Offer → confirm-hire/headcount concurrency; audit and outbox notification behavior;
6. target API error/DTO and authorization-contract tests, including direct-service and
   injected-header spoofing denial.

Items 1–4 are P5 entry prerequisites. Items 5–6 are acceptance requirements that must
grow with the replacement modules; their test harness should be established before the
first identity cutover.

## 4. Coverage, ownership, and deliberate non-mapping

All material current runtime responsibilities are mapped. The target owns every P1
business capability: Identity (P4-MIG-005–008), Organization (009), Candidate (010),
Recruitment Planning (011), Job (012), Application (013), Interview (014), Offer
(015), Communication (016–018), Governance (028), and the neutral outbox technical
foundation (019). P4-MIG-029–035 classify the previously unclassified technical
packages with static reference evidence. There is no migration of AI/ML,
matching, scoring, RAG, SMS, calendar, or external recruiting integration because P1
and P3 explicitly place them out of scope.

The only intentionally unresolved *path* is the optional notification-worker bootstrap
and template package location; P3 chooses its ownership and behavior, while P5 selects
the repository location. This is not an unmapped business capability or architecture
decision.

## 5. Dependency and retirement rules

The capability sequence is **technical baseline → transactional outbox foundation →
Identity → Organization → Candidate → Recruitment Planning → Job → Application →
Interview → Offer → Communication → Governance**. The technical outbox foundation
precedes Communication, while Governance retains ownership of audit records and remains
the final named business-domain step. This resolves the former order inversion without
changing Communication or Governance ownership.

No `DELETE` row authorizes deletion during P4. For every deletion, replacement
implementation, regression validation, deployment/reference scan, approved compatibility
decision, and the row's stated legacy-removal condition are mandatory. No private table,
repository, ORM entity, or module internals may become a shortcut dependency during the
coexistence period.
