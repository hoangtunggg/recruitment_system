# P0 Documentation Inventory

**P0 task status:** DONE  
**Audit date:** 2026-10-05

## 1. Classification rule

`AGENTS.md` defines `DRAFT`, `APPROVED`, `DEPRECATED`, and `ARCHIVED` as document
states. P0 does not assign one of those states to an existing document when its state
is not explicitly declared. Such documents are recorded below as **status not
declared** and are not authoritative business requirements.

## 2. Governing instruction

| Document | Observed state | P0 treatment |
|---|---|---|
| `AGENTS.md` | Mandatory repository-agent instructions; no document-status header; untracked at the start of P0 | Governing technical instruction for this audit, below only the explicit user task |

## 3. Required product documentation

None of the product source-of-truth paths referenced by `AGENTS.md` currently exist.

| Required path | Current state | Consequence |
|---|---|---|
| `docs/product/PRODUCT_CONTEXT.md` | Missing | No approved product scope beyond `AGENTS.md` |
| `docs/product/DOMAIN_GLOSSARY.md` | Missing | No reviewed canonical terminology catalog |
| `docs/product/ACTORS.md` | Missing | Actor descriptions exist only in `AGENTS.md` |
| `docs/product/PERMISSIONS.md` | Missing | No approved permission matrix |
| `docs/product/BUSINESS_RULES.md` | Missing | No stable `BR-*` rules |
| `docs/product/USE_CASE_CATALOG.md` | Missing | No stable use-case index |
| `docs/product/use-cases/` | Missing | No approved use-case specifications |
| Lifecycle/state-machine documents | Missing | Conceptual status lists in `AGENTS.md` are not detailed transition specifications |

This absence blocks business implementation but does not block completion of the P0
current-state audit.

## 4. Existing documentation inventory

### 4.1 Root documents

| Document | Status declaration | Current subject | P0 observation |
|---|---|---|---|
| `README.md` | None | AI Recruitment Platform, target services, setup | Conflicts with the no-AI product scope and overstates components that do not exist |
| `CONTRIBUTING.md` | None | Generic contribution workflow | Process reference only; not a business/architecture source of truth |
| `CLAUDE.md` | None | Tool-specific agent workflow | Its expected documentation tree does not match the repository or `AGENTS.md` target tree |
| Service `README.md` files | None | Generic NestV11 setup | Starter documentation, not service/domain contracts |

### 4.2 Architecture documents

| Document/group | Status declaration | Current subject | P0 observation |
|---|---|---|---|
| `docs/architecture/overview.md` | None | AI recruitment microservices | Conflicts with no-AI scope and current implementation |
| `docs/architecture/services.md` | None | Auth/user/job/interview/notification/AI services | Several described services are absent |
| `docs/architecture/api-contracts.md` | None | TCP and HTTP contracts for AI recruitment | Differs from active gRPC code, auth payload, roles, and error shapes |
| `docs/architecture/data-model.md` | None | Per-service recruitment and AI schemas | Mostly unimplemented and includes AI persistence |
| `docs/architecture/data-pipeline.md` | None | RAG ingestion/indexing | Prohibited target under current no-AI instruction |
| `docs/architecture/ai-integration.md` | None | AI interview service | Prohibited target under current no-AI instruction |
| `docs/service-communication.md` | None | TCP between NestJS services, REST to AI | Active code uses gRPC |
| `docs/architecture/adr/adr-001..006` | `Accepted` | Legacy gateway, DB, TCP, interview/AI, web, and Job/Application decisions | Lower priority than `AGENTS.md`; multiple decisions conflict with it or remain unimplemented |

### 4.3 Planning and design documents

| Document/group | Status declaration | Current subject | P0 observation |
|---|---|---|---|
| `docs/sprint-plan.md` | None | Delivery plan centered on AI/RAG workstreams | Not valid for the current product scope |
| `docs/sprint-0-kickoff.md` | None | AI service and RAG kickoff | Not valid for the current product scope |
| `docs/design/wireframes.md` | None | Legacy UI notes | Requires product review during P1 before reuse |
| `docs/conventions.md` | None | Naming, module layout, API and workflow conventions | Some technical conventions match current code; response/testing sections drift from implementation |

## 5. AI-related legacy documentation

AI/ML behavior is extensively described in the root README and architecture/planning
documents, including AI interview evaluation, RAG, GPT integration, candidate scoring,
question generation, an `ai-service`, and `ai_db`.

Under `AGENTS.md` section 56 these concepts are not part of the current platform. P0
records the conflict but does not delete, rename, archive, or edit those legacy files.
Their final disposition requires an approved later-phase documentation/migration
decision.

## 6. Missing target-architecture documentation

The target tree named by `AGENTS.md` is not present:

```text
docs/product/
docs/engineering/
docs/codex/
docs/adr/
```

`docs/restructure/` is introduced by P0 solely for the audit, conflict register, and
tracker. No target architecture, migration map, engineering standard, or new ADR is
approved by this work.

## 7. Documentation blockers

1. No approved product context or glossary.
2. No approved actor/permission matrix.
3. No business rules with stable `BR-*` identifiers.
4. No use cases with stable `UC-*` identifiers.
5. No reviewed lifecycle/state-machine specifications.
6. No approved target architecture resolving modular backend versus existing services.
7. No current API/error/authorization contract.
8. No `MIGRATION_MAP.md` for controlled legacy replacement.
9. Existing legacy documents generally have no explicit status.

These blockers should be resolved in the sequence defined by the restructure tracker;
they are not resolved by P0.

