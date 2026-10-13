# P4 Documentation Status Inventory

**Status:** RECORDED — no legacy document is changed or removed by P4 Closure  
**Authorities:** `AGENTS.md` source hierarchy; approved P1/P3/P4 artifacts.

| Document/group | Classification | Reason | Replacement/source of truth | Treatment point and archive/delete condition |
|---|---|---|---|---|
| `CLAUDE.md` | REPLACE | Tool-specific workflow and expected documentation tree diverge from router/current artifacts | `AGENTS.md`, `docs/codex/*`, tracker | P8 documentation cleanup; replace only after the target operating model is approved and linked. |
| `CONTRIBUTING.md` | UPDATE | Generic process document; not a product/architecture authority | `AGENTS.md`, implementation/review guides | P8; update contribution routing after P5/P9 commands are validated. |
| `apps/*/README.md` | REPLACE | Generic per-service starter guides conflict with target modular-monolith deployment | P3 target, P4 plan, future deployment runbook | P8; retain while legacy services exist; archive/delete only after service retirement and replacement runbook validation. |
| `docs/conventions.md` | REPLACE | API/testing/workflow conventions drift from current source and P3 API contract | P3 target architecture; P2 guides | P8; replace after target API/testing conventions are implemented and reviewed. |
| `docs/design/wireframes.md` | ARCHIVE | Legacy UI notes have no approved product/UI ownership in current phase | Approved P1 product documents; future UI decision | P8; archive after product owner confirms it is not an active requirement. |
| Root `README.md` | REPLACE | Advertises AI and unavailable services | P1 Product Context, P3 target | P8; only after replacement repository overview is reviewed. |
| `docs/architecture/{overview,services,api-contracts,data-model,data-pipeline,ai-integration}.md` | ARCHIVE | Mixed/stale microservice, AI, TCP and data claims conflict with approved P1/P3 | P3 target, P3 ADR records | P8; archive after links are redirected and no active guide cites them. |
| `docs/service-communication.md` | ARCHIVE | TCP/AI transport differs from current gRPC and target in-process ports | P3 target and ADR-P3-001/002/007 | P8 after current gRPC retirement evidence exists. |
| `docs/architecture/adr/adr-001..006` | ARCHIVE | Accepted legacy decisions conflict with approved P1/P3 or describe absent components | P3 decision records | P8; preserve history, mark superseded/archived only after ADR cross-link review. |
| `docs/{sprint-plan,sprint-0-kickoff}.md` | ARCHIVE | AI/RAG workstream plans are out of scope | P1 Product Context | P8; archive after planning owner confirms no active delivery use. |
| `docs/images/architecture.png` | ARCHIVE | Likely depicts legacy architecture; cannot be authoritative without a source/status | P3 target diagram | P8 after replacement visual is accepted. |
| `CODE_OF_CONDUCT.md`, `LICENSE` | KEEP | Repository governance/legal documents; no architecture claim | Their own content | Retain. |

`P4-MIG-027` remains the controlled retirement map item. This inventory expands its
scope; none of these classifications authorizes a delete or archive during P4.
