# P0 Architecture Conflict Register

**P0 task status:** DONE; all listed conflicts remain unresolved  
**Audit date:** 2026-10-05

## 1. Usage

This register identifies incompatible sources or material gaps. It deliberately does
not select a solution. Resolution requires the source-of-truth order in `AGENTS.md`
and the appropriate later restructure phase.

| ID | Severity | Conflict | Evidence | Current authority/result | Resolution gate |
|---|---|---|---|---|---|
| P0-AC-001 | CRITICAL | Current product scope forbids AI, while legacy documentation defines AI interviewing, scoring, RAG, GPT, and an AI service as core product features. | `AGENTS.md` §§0,56 versus `README.md`, `docs/architecture/ai-integration.md`, `data-pipeline.md`, sprint documents | `AGENTS.md` wins; AI material is non-authoritative legacy, but is not reclassified or removed in P0 | P1 product approval and later documentation cleanup |
| P0-AC-002 | HIGH | Target prefers `apps/api`, `apps/web`, and `apps/notification-worker`; current repository has three NestJS services under `apps/*-service`. | `AGENTS.md` §25 versus workspace/app tree | Exact target deployment architecture is unresolved | P3 target architecture/ADR |
| P0-AC-003 | HIGH | Application must be a first-class domain, while legacy ADR-006 merges Application into Job. | `AGENTS.md` §§6-8 versus ADR-006 | `AGENTS.md` domain boundary has higher priority; implementation shape remains undecided | P1 domain model, then P3 architecture |
| P0-AC-004 | CRITICAL | Authorization must be organization-scoped and permission/resource aware; current model has one global `user.role`. | `AGENTS.md` §§5,18,45 versus `User.role`, `Role.Admin/User`, and global RBAC guard | Current implementation cannot represent required authorization semantics | P1 permissions, P3 security architecture |
| P0-AC-005 | HIGH | Legacy ADR-003 and service docs prescribe NestJS TCP; active source uses gRPC and `.proto` contracts. | ADR-003 and `service-communication.md` versus app modules, consumers, and `libs/common/src/grpc` | gRPC is current runtime behavior; target transport is unresolved | P3 transport ADR |
| P0-AC-006 | HIGH | Legacy ADR-002 prescribes database per service; Compose has one default PostgreSQL DB and only user-service implements persistence. | ADR-002/data-model versus `docker-compose.yml` and user-service MikroORM config | Current deployment does not implement the ADR | P3 data ownership/topology ADR |
| P0-AC-007 | MEDIUM | ADR-001 says APISIX only and removal of Kong, but Kong compose/config/env/volume artifacts remain. | ADR-001 versus `docker-compose-kong.yml`, `config/kong`, `.env.example`, Compose volume | APISIX is active; legacy Kong artifacts remain | P4 gap analysis/P8 cleanup after validation |
| P0-AC-008 | HIGH | Legacy docs describe Candidate and Employer as global roles; target actors include organization-scoped Recruiter, Hiring Manager, Interviewer, and Organization Admin. | Legacy README/API contracts versus `AGENTS.md` §§4-5 | Target actor model requires P1 specification | P1 actors/permissions/glossary |
| P0-AC-009 | HIGH | Legacy API contract uses `sub`, `@AuthUser`, `@Roles`, TCP patterns, HTTP 400 validation, and `{data,meta}` wrappers; runtime uses `id/jti`, `@User`, custom RBAC metadata, gRPC, HTTP 422, and mostly raw responses. | `api-contracts.md`/`conventions.md` versus active auth, validation, transport, and controller code | No single approved current API contract exists | P3 API standard, P4 gap analysis |
| P0-AC-010 | HIGH | Root README and service catalog present job/interview/AI/web components and multi-DB/MinIO startup as available, but those components and routes are absent. | README/services docs versus repository and APISIX/Compose inventory | Documentation overstates implementation | Later documentation status/cleanup after P1-P3 decisions |
| P0-AC-011 | HIGH | Communication target expects a clear side-effect boundary and potentially reliable delivery; current password-reset mail is a direct non-awaited gRPC call with no durable delivery history/outbox. | `AGENTS.md` §§34-35 versus `AuthService.sendResetPasswordLink` | Current behavior is recorded, not changed | P1 notification requirements/P3 event architecture |
| P0-AC-012 | HIGH | Governance owns auditable security/business actions, but no audit domain or durable audit model exists. | `AGENTS.md` §§6-7,36 versus current source/data model | Target capability absent | P1 audit requirements/P3 governance architecture |
| P0-AC-013 | MEDIUM | Target shared code must have clear responsibility; current `common` and `core` are broad cross-cutting buckets. | `AGENTS.md` §28 versus `libs/common` and `libs/core` | Current ownership is legacy and unresolved | P3 package boundaries/P4 migration map |
| P0-AC-014 | HIGH | Documentation authority depends on status, but most existing product/architecture documents have no `DRAFT/APPROVED/DEPRECATED/ARCHIVED` declaration. | `AGENTS.md` §§2-3 versus documentation inventory | They cannot serve as approved business requirements | P1 documentation governance |
| P0-AC-015 | HIGH | Incremental migration requires a migration map, but none exists. | `AGENTS.md` §§53-54 versus repository tree | Legacy code must not be moved/deleted until a later approved map exists | P4 gap analysis/migration map |

## 2. Unresolved architecture questions

The following questions are intentionally not answered in P0:

1. Will the target backend be one modular NestJS application, several deployable
   services, or a staged hybrid?
2. Which existing service functionality is retained, wrapped, or replaced?
3. What is the approved internal communication model?
4. What is the approved database topology while preserving domain ownership?
5. What is the canonical identity, organization-membership, role, and permission model?
6. What API success/error/pagination contract becomes authoritative?
7. Which legacy ADRs remain accepted, are superseded, or become deprecated?
8. How and when will AI-oriented documents be archived or removed from active guidance?
9. What audit, outbox, retry, idempotency, and observability guarantees are required?
10. What compatibility period is required for current auth/user/notification endpoints?

## 3. Blockers carried forward

| Blocker | Blocks | Needed evidence |
|---|---|---|
| No approved product documentation | Domain design and implementation | Approved product context, glossary, actors, permissions, rules, use cases |
| No approved target architecture | Skeleton/foundation migration | Architecture document and ADRs resolving deployment, transport, data, and contracts |
| No reliable regression baseline | Safe incremental migration | Passing unit/integration/E2E baseline with known failures classified |
| No migration map | Moving or deleting legacy code | Reviewed mapping from current component to target owner and replacement gate |
| `AGENTS.md` is not tracked at P0 start | Shared enforcement of repository rules | Repository decision to version the file |

