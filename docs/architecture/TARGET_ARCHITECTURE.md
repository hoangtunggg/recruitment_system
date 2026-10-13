# Target Architecture — Recruitment Management Platform

**Status:** APPROVED  
**Phase:** P3 — Target Architecture  
**Business source of truth:** approved P1 product package  
**Scope:** target only; no source-code, migration, or deployment change is authorized by this document

## 1. Current versus target

| Concern | CURRENT evidence (P0) | TARGET decision |
|---|---|---|
| Shape | NestJS starter with `auth-service`, `user-service`, and `notification-service` | Modular Monolith; one deployable API codebase with explicit domain modules |
| Internal transport | gRPC between services; gateway-injected auth header | In-process public module ports; no network transport for module collaboration |
| Edge | APISIX active; legacy Kong artifacts exist | One HTTPS edge/gateway or direct ingress; gateway never supplies trusted identity without cryptographic verification |
| Persistence | PostgreSQL/MikroORM only in user-service | PostgreSQL system of record with schema-per-domain ownership |
| Notifications | Separate service, SMTP/SES, no durable history | Communication module plus optional worker consuming durable outbox records |
| Scope | Legacy material advertises AI and extra services | No AI/ML, matching, scoring, RAG, or AI service |

The current architecture is evidence for migration planning only. It does not constrain
the target architecture.

## 2. Architecture style

The target is a **Modular Monolith**. It is one logical application, one versioned API,
and one PostgreSQL system of record. Modules communicate through explicit in-process
application ports and durable domain events; they do not use gRPC, HTTP, shared
repositories, or direct private-table writes to communicate.

The same codebase may run a separately scaled **notification/outbox worker**. This is
an operational process boundary, not a new business service or a separate ownership
boundary. A later process/service split requires a new ADR with load, availability,
security, ownership, and operational evidence.

## 3. Module boundaries and dependency direction

```text
API / worker adapters
        ↓
module application layer (commands, queries, public ports)
        ↓
module domain layer (aggregates, policies, domain events)
        ↓
module infrastructure adapters (PostgreSQL, mail, cache, observability)
```

Each module has `api`, `application`, `domain`, and `infrastructure` packages. A module
may depend inward on its own layers and outward only on another module's published
application port/contracts. Domain entities, repositories, ORM models, tables, and
internal events are private. There is no generic business `common` or `core` module.
Only narrow technical packages are allowed: `platform/http`, `platform/persistence`,
`platform/security`, `platform/observability`, and `platform/testing`; none may contain
recruitment business rules, entities, permissions, or workflows.

**P5 implementation evidence:** the inactive structural skeleton exists at
`apps/api/src`, with `modules/<domain>/{api,application,domain,infrastructure}` and
the approved `platform/*` technical areas. Its entry point is not invoked, it exposes
no route, and it imports no legacy application, gRPC contract, repository, or database
model. This confirms a repository path only; it does not change any target behavior or
deployment boundary.

**P6 implementation evidence:** `apps/api/src/platform` now provides target-only
validated configuration, MikroORM/PostgreSQL transaction and migration wiring,
problem-details/DTO validation/pagination, fail-closed authentication interfaces,
generic tenant-aware authorization evaluation, structured redacted logging/correlation,
safe audit intents, and a technical outbox/idempotency persistence model. It remains
inactive, has no business-domain entity/workflow, and creates no traffic cutover.

| Module | Owns | Published collaboration |
|---|---|---|
| Identity | User, credentials, verified email, MFA, sessions, account state, platform-role metadata | authenticated subject, account lifecycle/recovery commands |
| Organization | Organization, Membership, fixed roles, role-derived permissions, assignments, approval configuration | authorization context, assignment/configuration lookup/commands |
| Recruitment Planning | Recruitment Request, request approval history, requested/filled/remaining headcount | approved request context, headcount/confirm-hire coordination |
| Candidate | Candidate Profile, resume versions, candidate preferences | candidate identity/resume-version snapshot input |
| Job | Job, publication state, recruitment owner, Request linkage | eligible/open Job context |
| Application | Application, immutable submission snapshot, screening/pipeline, rejection/history, `HIRED` state | application progression and confirm-hire command |
| Interview | Interview, rounds, schedule, assignments, feedback, scorecards | interview readiness/outcome reference |
| Offer | Offer versions, approval, send/response/expiry/withdrawal | accepted/declined/expired outcome reference |
| Communication | notification intent, delivery attempts/history, template/channel preference | delivery request/status only; no recruitment decision |
| Governance | audit records and security-event traceability | append-only audit recording/query within permitted metadata scope |

`Application` remains first-class and is never folded into Candidate, Job, or a
generic pipeline module. Cross-module writes use named public commands, never private
repository access.

## 4. Data ownership and database architecture

PostgreSQL is the authoritative transactional store. The target uses one database
cluster and one application database with private schemas:

```text
identity | organization | recruitment_planning | candidate | job
application | interview | offer | communication | governance | outbox
```

Each schema has module-owned migrations and tables. IDs may be referenced across
schemas as opaque identifiers, but modules must not query or update another module's
private tables. Cross-schema foreign keys are avoided unless a future ADR proves they
do not weaken module ownership; application-level invariants are enforced through
public ports and transactions.

Tenant-owned records carry a non-null `organization_id` derived server-side. Candidate
profile/identity data is global-to-candidate and never implicitly becomes tenant data;
an Application and all recruitment artifacts derived from it carry their single owning
Organization. Database constraints/indexes include tenant-leading access indexes and
the approved one-Application-per-Candidate+Job invariant. Database access always binds
tenant scope from the authenticated/authorized server context, not request input.

## 5. Authentication, authorization, and tenant isolation

Identity issues short-lived signed access tokens and rotated refresh/session tokens;
the API verifies signature, issuer, audience, expiry, and revocation/session state.
No application trusts a gateway-injected `x-auth-user` header as identity proof.
Verified-email recovery, TOTP MFA for `PLATFORM_ADMIN` and `ORG_ADMIN`, recovery-code
handling, session revocation, rate limiting, and non-enumerating recovery responses
follow P1.

Authorization is an API/application-layer policy decision using authenticated User,
active membership, fixed role union, role-derived permission, organization scope,
assignment/ownership, resource state, and business preconditions. It is repeated at
the public module port for sensitive commands. Candidate self-scope is separate from
staff membership. `ORG_ADMIN` has no implicit recruitment-content authority.
`PLATFORM_ADMIN` can administer platform metadata/account lifecycle but cannot
impersonate or read tenant recruitment content. No direct user grant, custom role,
tenant hierarchy, cross-tenant resource, or break-glass content path exists.

## 6. Transaction boundaries and domain events

One aggregate/module command uses one local PostgreSQL transaction. The transaction
persists state, audit intent, and outbox records atomically. Retries use idempotency
keys for externally triggered submission, send, response, expiry, and confirm-hire
operations; lifecycle writes use conditional/versioned state transitions.

Cross-domain operations are explicit orchestrations through public ports:

- opening a valid Job coordinates Request `IN_RECRUITMENT`;
- Interview readiness enables, but never directly writes, Application progression;
- Offer outcomes enable Application/Planning commands;
- confirm-hire atomically validates Request capacity, creates the single Application
  `HIRED` outcome, and increments filled headcount; no capacity is reserved at
  `OFFERED`.

Where multiple module commands must satisfy an immediate P1 invariant, the
orchestrator runs them in the same database transaction without accessing private
repositories. Committed domain events go to the outbox and are delivered after commit.
Events are immutable facts with event ID, aggregate ID, organization ID where present,
correlation/causation IDs, schema version, occurrence time, and minimal payload.

## 7. Notification and audit architecture

Communication consumes durable outbox delivery requests after commit. It sends email
and, where a UI exists, in-app notification; no SMS or external recruitment/calendar
integration is in scope. Delivery retries are idempotent and at-least-once; final
delivery failure is recorded and never rolls back committed recruitment state.

Governance writes append-only audit records in the same transaction as the governed
command where possible. Records include actor, action, target, organization when
applicable, timestamp, correlation ID, reason and safe metadata. Passwords, raw
tokens, OTP secrets, recovery codes, and other secrets are never recorded. Audit
read authorization preserves tenant boundaries; Platform Admin sees permitted platform
metadata/security events, never recruitment content.

## 8. API and error conventions

The target exposes HTTPS JSON REST under `/api/v1`. Controllers/adapters are thin and
invoke module commands/queries; they do not expose ORM entities or accept lifecycle
status as a generic mutable field. Mutations use named operations such as
`/applications/{id}:screen` or `:confirm-hire`, with server-derived actor/tenant
context and an idempotency key where retryable.

Responses use versioned DTOs. Errors use a stable problem-details envelope containing
machine `code`, HTTP `status`, safe `message`, correlation ID, and optional safe field
violations. Authorization failures do not disclose cross-tenant resource existence;
invalid lifecycle transitions produce a distinct conflict code. API, validation,
authentication, authorization, and concurrency errors are mapped centrally at the
HTTP adapter boundary.

## 9. Deployment and observability

Initial deployment boundaries are:

```text
Internet → TLS ingress/gateway → API process
                               → notification/outbox worker (private)
API/worker → PostgreSQL; Redis for session revocation/rate limiting; mail provider
```

Only the ingress reaches the API; the worker, PostgreSQL, Redis, and mail credentials
are private. The API verifies tokens itself. Secrets are injected by the deployment
secret manager and never committed. PostgreSQL backup/restore and migration execution
are operationally controlled, not performed on application startup.

All processes emit structured logs, metrics, and OpenTelemetry-compatible traces with
correlation IDs. Required signals include authentication/recovery outcomes, authorization
denials, tenant-scope violations, lifecycle transitions, outbox lag/failure, mail
delivery result, audit-write failure, database pool/latency/error rate, and worker
health. Logs redact credentials and sensitive recruitment content.

## 10. Migration-relevant constraints

P3 authorizes no migration. Future migration planning must:

1. inventory current auth/user/notification data and JWT/Redis dependencies;
2. preserve identity/account history and introduce normalized email uniqueness safely;
3. backfill `organization_id` only with an explicit verified ownership mapping—never
   infer tenant ownership from a client field;
4. introduce module schema migrations in additive, reversible stages;
5. create audit/outbox storage before relying on asynchronous notification;
6. prove Application uniqueness, lifecycle versioning, and confirm-hire headcount
   concurrency with database constraints/tests;
7. retire gRPC/gateway-header trust/Kong artifacts only after replacement validation;
8. retain legal retention values as deployment configuration/policy inputs, not hard
   coded assumptions.

## 11. P3 gate

The approved target has no CRITICAL or HIGH architecture decision left implicit. The
only non-architectural external parameter is P1 retention/legal policy. P4 may compare
the current starter against this target, but P4 is not started by this document.
