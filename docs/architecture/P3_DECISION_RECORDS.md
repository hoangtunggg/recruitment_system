# P3 Architecture Decision Records

**Status:** APPROVED  
**Scope:** architecture decisions for the P3 target only

| ID | Decision | Status | Rationale / consequence |
|---|---|---|---|
| `ADR-P3-001` | Use a Modular Monolith first | APPROVED | P1 domains need strong local invariants; current services do not justify distributed ownership. A process split needs new evidence/ADR. |
| `ADR-P3-002` | Use explicit domain modules and published in-process ports | APPROVED | Prevents direct private-data mutation; prohibits generic business `common/core`. |
| `ADR-P3-003` | PostgreSQL schema-per-domain in one application database | APPROVED | Preserves ownership while enabling atomic P1 headcount/hire invariants. |
| `ADR-P3-004` | Enforce P1 authentication, authorization, and strict tenant isolation in API/module boundaries | APPROVED | Replaces trust in gateway-injected identity; preserves fixed roles, assignment scope, and Platform Admin restrictions. |
| `ADR-P3-005` | Local transaction plus transactional outbox and idempotent commands | APPROVED | Makes audit/event/notification durable without distributed transactions or a broker requirement. |
| `ADR-P3-006` | Communication worker is an operational worker, not a business microservice | APPROVED | Allows retry/scale while Communication ownership remains in the modular monolith. |
| `ADR-P3-007` | HTTPS REST `/api/v1` with versioned DTO/problem details | APPROVED | One external contract; gRPC is not target module transport. |
| `ADR-P3-008` | Private deployment network, API token verification, PostgreSQL/Redis/mail dependencies, and OTel observability | APPROVED | Removes gateway-header trust and establishes operational boundaries/signals. |
| `ADR-P3-009` | Use additive, verified migration stages only in later phases | APPROVED | P3 does not authorize migration; protects tenant, history, audit, and headcount invariants. |

**Pending critical/high ADRs:** none. Legal retention jurisdiction/duration is an
external P1 policy parameter, not an architecture ADR.
