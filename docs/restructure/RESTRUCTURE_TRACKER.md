# Recruitment Platform Restructure Tracker

**Last updated:** 2026-10-06  
**Current phase:** P7 Identity Domain Migration  
**Phase status:** IN_PROGRESS — Identity security decisions and boundary contract are approved; data migration/cutover remains blocked by environment/data readiness

## 1. Status rules

Allowed statuses are `TODO`, `IN_PROGRESS`, `DONE`, and `BLOCKED`.

An item is marked `DONE` only when its evidence exists and has been reviewed during
the applicable task. A blocker carried into a later phase does not make a completed
P0 observation incomplete when the blocker itself has been explicitly recorded.

## 2. Phase overview

| Phase | Name | Status | Evidence/notes |
|---|---|---|---|
| P0 | Current State Audit | DONE | Current-state audit, documentation inventory, and conflict register completed |
| P1 | Business Analysis | DONE | Draft product package completed; approval and open decisions remain blockers |
| P1-AC | P1 Approval Closure | DONE | All 70 decisions approved; exact legal retention parameters are external-policy pending but non-blocking for P3 architecture |
| P2 | Codex Context | DONE | Refreshed against finalized P1 sources; comprehension 15/15 with zero critical failures |
| P3 | Target Architecture | DONE | Modular Monolith target, module/data ownership, ADR records, deployment/observability, and migration constraints approved |
| P4 | Gap Analysis | DONE | Current responsibilities mapped to target owners/conditional retirement; P4 gate PASS |
| P5 | Repository Skeleton | DONE | `apps/api` is an inactive Modular Monolith skeleton; all target module boundaries and technical paths exist without business migration or traffic transfer. |
| P6 | Technical Foundation | DONE | Target-only foundation is wired, tested, and inactive; P7 preflight is separately blocked. |
| P7 | Identity Domain Migration | IN_PROGRESS | Identity security approval closure is complete; non-destructive target implementation may resume. Data migration/cutover remains blocked and Organization has not started. |
| P8 | Legacy Cleanup | TODO | Not started |
| P9 | Quality Gate | TODO | Not started |
| P10 | Codex Operating Model | TODO | Not started |

## 3. P0 checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P0-01 | Inventory repository/workspace structure | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2-3 |
| P0-02 | Inventory applications, libraries, and active runtime boundaries | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§3-4 |
| P0-03 | Inventory persistence, schema, and infrastructure | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§4.3,8 |
| P0-04 | Inventory API, DTO, transport, and error handling | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§4,7 |
| P0-05 | Audit authentication, authorization, security, and audit baseline | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§6 |
| P0-06 | Audit tests and quality baseline | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§9 |
| P0-07 | Inventory documentation and requirement status | DONE | `DOCUMENTATION_INVENTORY.md` |
| P0-08 | Map current capabilities to target business domains | DONE | `CURRENT_STATE_AUDIT.md` Ãƒâ€šÃ‚Â§5 |
| P0-09 | Record architectural conflicts and unresolved decisions | DONE | `ARCHITECTURE_CONFLICTS.md` |
| P0-10 | Review P0 artifacts, links, scope, and tracker consistency | DONE | P0 validation record below |

**P0 progress: 10 / 10 tasks complete.**

## 4. P0 artifacts

- [Current State Audit](./CURRENT_STATE_AUDIT.md)
- [Documentation Inventory](./DOCUMENTATION_INVENTORY.md)
- [Architecture Conflict Register](./ARCHITECTURE_CONFLICTS.md)
- This tracker

## 5. Active blockers

| ID | Blocker | Status | Owner/phase |
|---|---|---|---|
| BLK-001 | Exact jurisdiction, retention duration, legal hold, and deletion procedure remain external-policy parameters | BLOCKED | Privacy/Legal owner; `P1-OD-005`; non-blocking for P3 architecture |
| BLK-005 | Target deployment, transport, database, and API architecture is resolved in P3 | DONE | `docs/architecture/TARGET_ARCHITECTURE.md`; P4 will assess current-state gaps |
| BLK-006 | Existing tests do not provide a passing regression baseline | DONE | Baseline executed/classified in `REGRESSION_BASELINE.md`; missing unit/characterization suites block cutover, not P5 skeleton creation |
| BLK-007 | No reviewed migration map exists | DONE | `MIGRATION_MAP.md` and `MIGRATION_PLAN.md` completed in P4 |
| BLK-008 | Most legacy documents have no declared lifecycle status | BLOCKED | P1 documentation governance |
| BLK-009 | `AGENTS.md` was untracked at the start of P0 | BLOCKED | Repository owner decision |

These blockers constrain later phases. They did not require application changes and
do not invalidate the completed P0 inventory.

## 6. P0 validation record

Completed on 2026-10-05:

- confirmed only documentation under `docs/restructure/` was added by P0;
- inspected repository files, manifests, active modules, entities, migrations,
  gateway/Compose configuration, and test layout;
- distinguished current runtime behavior from legacy documentation and target concepts;
- documented rather than resolved every material architecture conflict found;
- confirmed no application source was moved, renamed, deleted, or edited;
- checked P0 artifacts for relative-link targets and tracker consistency;
- did not claim application tests as passing.

## 7. P1 checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P1-01 | Define product scope and explicit out-of-scope boundary | DONE | `docs/product/PRODUCT_CONTEXT.md` |
| P1-02 | Define actors and role scopes | DONE | `docs/product/ACTORS.md` |
| P1-03 | Define draft permission model and stable permission identifiers | DONE | `docs/product/PERMISSIONS.md` |
| P1-04 | Define canonical domain glossary | DONE | `docs/product/DOMAIN_GLOSSARY.md` |
| P1-05 | Define domain ownership and collaboration map | DONE | `docs/product/DOMAIN_MAP.md` |
| P1-06 | Document Recruitment Request lifecycle and unresolved transitions | DONE | `docs/product/lifecycles/RECRUITMENT_REQUEST_LIFECYCLE.md` |
| P1-07 | Document Job lifecycle and explicit transition matrix | DONE | `docs/product/lifecycles/JOB_LIFECYCLE.md` |
| P1-08 | Document Application lifecycle and unresolved transitions | DONE | `docs/product/lifecycles/APPLICATION_LIFECYCLE.md` |
| P1-09 | Document Interview lifecycle and unresolved transitions | DONE | `docs/product/lifecycles/INTERVIEW_LIFECYCLE.md` |
| P1-10 | Document Offer lifecycle and unresolved transitions | DONE | `docs/product/lifecycles/OFFER_LIFECYCLE.md` |
| P1-11 | Create stable-ID business-rule catalog from defined sources | DONE | `docs/product/BUSINESS_RULES.md` |
| P1-12 | Create stable-ID use-case catalog and clarity classification | DONE | `docs/product/USE_CASE_CATALOG.md` |
| P1-13 | Create P1 requirement-to-rule-to-use-case traceability matrix | DONE | `docs/product/TRACEABILITY_MATRIX.md` |
| P1-14 | Validate links, IDs, counts, scope, and unresolved-decision visibility | DONE | P1 validation record below |

**P1 progress: 14 / 14 documentation tasks complete.**

All P1 product documents remain `DRAFT`. `DONE` means the requested draft artifact and
its unresolved-decision record exist; it does not mean the business requirement is
approved for implementation.

## 8. P1 artifacts

- `docs/product/PRODUCT_CONTEXT.md`
- `docs/product/ACTORS.md`
- `docs/product/PERMISSIONS.md`
- `docs/product/DOMAIN_GLOSSARY.md`
- `docs/product/DOMAIN_MAP.md`
- `docs/product/lifecycles/RECRUITMENT_REQUEST_LIFECYCLE.md`
- `docs/product/lifecycles/JOB_LIFECYCLE.md`
- `docs/product/lifecycles/APPLICATION_LIFECYCLE.md`
- `docs/product/lifecycles/INTERVIEW_LIFECYCLE.md`
- `docs/product/lifecycles/OFFER_LIFECYCLE.md`
- `docs/product/BUSINESS_RULES.md`
- `docs/product/USE_CASE_CATALOG.md`
- `docs/product/TRACEABILITY_MATRIX.md`

## 9. P1 validation record

Completed on 2026-10-05:

- kept every new business document at `DRAFT` status;
- derived rules only from explicit `AGENTS.md` statements;
- assigned stable `BR-*`, `UC-*`, and draft `PERM-*` identifiers;
- validated 60 unique business-rule IDs, 67 unique use-case IDs, 40 unique
  permission IDs, and 66 sequential open-decision IDs;
- mapped all 60 business rules to their explicit requirement source and to a
  cataloged use case or declared cross-cutting/domain boundary;
- classified 26 use cases as `DEFINED_ACTION` and 41 as `NEEDS_POLICY`;
- recorded unknown policy as `P1-OD-*` decisions instead of inventing rules;
- distinguished defined Job transitions from unresolved transitions in the other four
  lifecycles;
- checked cross-document links, duplicate identifiers, use-case summary counts, and
  tracker counts;
- confirmed no application source or runtime configuration was changed;
- did not claim application tests as passing.

## 10. P2 checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P2-01 | Convert `AGENTS.md` into a routing-only entry point | DONE | `AGENTS.md` contains source hierarchy, phase/status gates, and routing tables without duplicating the business-rule catalog |
| P2-02 | Define source-of-truth and requirement-status handling | DONE | `AGENTS.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2,5; `docs/codex/TRACEABILITY.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2,5 |
| P2-03 | Define Codex implementation workflow and safeguards | DONE | `docs/codex/IMPLEMENTATION_GUIDE.md` |
| P2-04 | Define evidence-based review workflow | DONE | `docs/codex/REVIEW_GUIDE.md` |
| P2-05 | Define stable-ID and end-to-end traceability practice | DONE | `docs/codex/TRACEABILITY.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§3-6 |
| P2-06 | Define bounded task-prompt patterns | DONE | `docs/codex/PROMPT_GUIDE.md` |
| P2-07 | Route every domain/task to its minimum required documents and preserve legacy `AGENTS.md` citation provenance | DONE | `AGENTS.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§3-6 |
| P2-08 | Validate links, routing scope, prohibited duplication, document status, and context comprehension | DONE | P2 validation record below; `docs/codex/TRACEABILITY.md` Ãƒâ€šÃ‚Â§7 |

**P2 progress: 8 / 8 tasks complete.**

P2 completion approves the Codex routing/operating documents only. It does not approve
the DRAFT P1 business rules, permissions, use cases, lifecycles, or open decisions.

## 11. P2 artifacts

- `AGENTS.md`
- `docs/codex/IMPLEMENTATION_GUIDE.md`
- `docs/codex/REVIEW_GUIDE.md`
- `docs/codex/TRACEABILITY.md`
- `docs/codex/PROMPT_GUIDE.md`

## 12. P2 validation record

Completed on 2026-10-05:

- read the complete P1 product package before defining routing;
- reduced `AGENTS.md` from a monolithic instruction/business reference to a routing
  entry point without copying the 60-rule catalog into it;
- identified the business and technical source-of-truth hierarchies and status rules;
- added mode, domain, and task routing to the minimum required documents;
- preserved resolution of legacy `AGENTS.md Ãƒâ€šÃ‚Â§...` provenance citations through a
  compatibility routing table;
- recorded that all 13 P1 documents remain DRAFT and that 66 decisions remain open;
- ran a 20-question actor/permission/lifecycle/domain-ownership comprehension test;
- achieved **20 / 20 (100%)**, above the **17 / 20 (85%)** gate, with zero critical
  guardrail failures;
- checked relative documentation links, P2 artifact presence/status, source scope,
  tracker counts, and application-source non-modification;
- did not run or claim application tests because P2 changed documentation only.

The prior tracker note deferred P2 until P1 approval. The user's explicit P2 task
authorized creation of the context package against DRAFT inputs. Source priority makes
that task authoritative for P2 only; the new guides preserve every P1 ambiguity and do
not authorize P3 design or implementation from unapproved business policy.

## 13. P1 Approval Closure checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P1-AC-01 | Re-read P1 sources and inventory every open decision | DONE | 66 existing IDs validated; uncovered use-case gaps identified |
| P1-AC-02 | Create a consolidated option/recommendation/impact/traceability register | DONE | `docs/product/P1_APPROVAL_DECISIONS.md` |
| P1-AC-03 | Prepare role-composition and tenant-scope proposals | DONE | Decision register Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2-3 |
| P1-AC-04 | Prepare permission and approval-authority proposals | DONE | Decision register Ãƒâ€šÃ‚Â§3; `docs/product/PERMISSIONS.md` Ãƒâ€šÃ‚Â§8 |
| P1-AC-05 | Prepare complete Recruitment Request transition proposal | DONE | `RECRUITMENT_REQUEST_LIFECYCLE.md` Ãƒâ€šÃ‚Â§2 |
| P1-AC-06 | Prepare complete Application transition proposal | DONE | `APPLICATION_LIFECYCLE.md` Ãƒâ€šÃ‚Â§2 |
| P1-AC-07 | Prepare complete Interview transition proposal | DONE | `INTERVIEW_LIFECYCLE.md` Ãƒâ€šÃ‚Â§2 |
| P1-AC-08 | Prepare complete Offer transition proposal | DONE | `OFFER_LIFECYCLE.md` Ãƒâ€šÃ‚Â§2 |
| P1-AC-09 | Prepare duplicate, snapshot, feedback, hiring, and headcount proposals | DONE | Decision register Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§6-8 |
| P1-AC-10 | Prepare notification, audit, retention, and integration proposals | DONE | Decision register Ãƒâ€šÃ‚Â§9 |
| P1-AC-11 | Map all `NEEDS_POLICY` use cases and affected rules/permissions to decisions | DONE | `USE_CASE_CATALOG.md` Ãƒâ€šÃ‚Â§14; `BUSINESS_RULES.md` Ãƒâ€šÃ‚Â§15; `PERMISSIONS.md` Ãƒâ€šÃ‚Â§8 |
| P1-AC-12 | Obtain authorized decisions and record approval evidence | DONE | `P1-OD-001`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`070` approved; `P1-OD-005` legal parameters explicitly external-policy pending |
| P1-AC-13 | Propagate approved outcomes, create detailed use-case specifications, and promote only eligible documents/rules | DONE | Outcomes propagated; five lifecycle matrices and detailed use-case specification profiles completed |

**P1 Approval Closure progress: 13 / 13 tasks complete.**

## 14. P1 Approval Closure artifacts and validation

- Added `docs/product/P1_APPROVAL_DECISIONS.md` with individual proposals for
  `P1-OD-001`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`070`.
- Added four complete proposed transition matrices without representing them as
  approved behavior.
- Added `P1-OD-067`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`070` to cover identity provisioning/recovery/account lifecycle
  and notification-history access gaps found in the 41 `NEEDS_POLICY` use cases.
- Initially mapped 41/41 `NEEDS_POLICY` use cases to explicit decision dependencies.
- Approved and propagated `P1-OD-003`, `004`, `009`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`014`, and `023` from explicit
  user authority; 9/70 decisions are approved and 61 remain.
- Approved and propagated `P1-OD-001`, `022`, `024`, and `067`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`069` from explicit
  user authority; 15/70 decisions are approved and 55 remain.
- Added approved Role/Tenant and Permission/Approval Authority rules; 34/78 rules
  are individually APPROVED and 44 remain DRAFT.
- Added five permission identifiers for approval configuration/decisions and limited
  Platform account lifecycle; current permission catalog contains 47 IDs and remains
  a mixed-status DRAFT document.
- Reclassified `UC-AUTH-003` and `UC-AUTH-004` to `DEFINED_ACTION` and added
  `UC-AUTH-005`ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“`006`; catalog totals are now 32 defined actions and 37
  needs-policy actions. Detailed use-case specifications are still required.
- Kept all 14 P1 product documents DRAFT because each still contains unresolved or
  incompletely specified content.
- Confirmed no P3 work and no application-source/runtime change was performed.

## 15. Final P1 gate and next task

- Decisions: **70 / 70 APPROVED**. `P1-OD-005` retains only legal jurisdiction,
  retention-duration, legal-hold, and deletion-procedure parameters as
  `EXTERNAL_POLICY_PENDING`.
- Business Rules: **100 / 100 APPROVED**.
- Use Cases: **69 `DEFINED_ACTION`, 0 `NEEDS_POLICY`**; detailed specification
  profiles are in `USE_CASE_CATALOG.md` Ãƒâ€šÃ‚Â§15.
- Lifecycles: **5 / 5 APPROVED**.
- Core P1 product documents: **14 / 14 APPROVED**.
- P1 gate: **PASS**. No critical/high P1 decision, lifecycle, ownership, permission,
  or use-case blocker remains.

The P1 next-task recommendation above has been completed by P3. The next phase is P4
Gap Analysis; exact legal retention remains an external Privacy/Legal parameter.

P2 refresh: **PASS** ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â `AGENTS.md`, Implementation Guide, and Traceability Guide were
updated; finalized-P1 comprehension is **15 / 15 (100%)** with zero critical failures.

## 16. P3 checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P3-01 | Separate current-state evidence from target architecture | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§1; P0 audit/conflict register retained as current evidence |
| P3-02 | Select architecture style and module boundaries | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“3; `ADR-P3-001`, `002` |
| P3-03 | Define dependency direction and domain data ownership | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§3ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“4; `ADR-P3-002`, `003` |
| P3-04 | Define database, tenant isolation, authentication, and authorization architecture | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§4ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“5; `ADR-P3-003`, `004` |
| P3-05 | Define transaction boundaries, domain events, notification, and audit architecture | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§6ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“7; `ADR-P3-005`, `006` |
| P3-06 | Define API conventions and target package structure | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§3,8; `ADR-P3-007` |
| P3-07 | Define deployment boundaries and observability | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§9; `ADR-P3-008` |
| P3-08 | Define migration-relevant constraints without migrating | DONE | `TARGET_ARCHITECTURE.md` Ãƒâ€šÃ‚Â§10; `ADR-P3-009` |
| P3-09 | Record all major architecture decisions and check P1 consistency | DONE | `P3_DECISION_RECORDS.md`; target architecture Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â§2ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“11 |
| P3-10 | Validate architecture docs, decision completeness, links, and phase scope | DONE | P3 validation record below |

**P3 progress: 10 / 10 tasks complete.**

## 17. P3 validation record

- selected Modular Monolith before any service/process split;
- recorded no target AI/ML capability and no generic business `common/core` module;
- assigned every P1 domain a data owner and prohibited direct private-data writes;
- preserved P1 fixed roles, assignment scope, tenant isolation, Platform Admin denial,
  Application-first ownership, lifecycle, headcount, audit, and notification rules;
- created nine approved P3 ADR decision records with no pending CRITICAL/HIGH decision;
- distinguished current gRPC/service/gateway implementation evidence from target REST/
  in-process module architecture;
- documented only future migration constraints; no application source, migration, or
  deployment runtime configuration was modified;
- checked target-document links and P3 decision references.

**P3 gate: PASS.** P4 Gap Analysis is the recommended next phase and has not started.

## 18. P4 checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P4-01 | Load routed P0/P3/P1 context and distinguish CURRENT from TARGET | DONE | `MIGRATION_MAP.md` Ã‚Â§Ã‚Â§1,4; `MIGRATION_PLAN.md` Ã‚Â§1 |
| P4-02 | Inventory current responsibilities rather than mechanically mapping folders | DONE | `MIGRATION_MAP.md` Ã‚Â§2 (35 items after closure) |
| P4-03 | Assign target owner/path/action for every material responsibility | DONE | `MIGRATION_MAP.md` Ã‚Â§Ã‚Â§2,4 |
| P4-04 | Record KEEP/MOVE/REFACTOR/REWRITE/DELETE conditions and legacy-removal gates | DONE | `MIGRATION_MAP.md` Ã‚Â§Ã‚Â§1Ã¢â‚¬â€œ2,5 |
| P4-05 | Establish dependency-safe domain migration order | DONE | `MIGRATION_MAP.md` Ã‚Â§5; `MIGRATION_PLAN.md` Ã‚Â§3 |
| P4-06 | Identify regression baseline and high-risk cutover controls | DONE | `MIGRATION_MAP.md` Ã‚Â§3; `MIGRATION_PLAN.md` Ã‚Â§Ã‚Â§2,4 |
| P4-07 | Record P5 entry blockers without starting P5 or restructuring source | DONE | `MIGRATION_PLAN.md` Ã‚Â§Ã‚Â§2,5 |
| P4-08 | Validate map/plan coverage, links, classification counts and phase scope | DONE | P4 validation record below |

**P4 initial progress: 8 / 8 tasks complete.**

## 19. P4 artifacts and validation record

- [Migration Map](./MIGRATION_MAP.md)
- [Migration Plan](./MIGRATION_PLAN.md)

Completed on 2026-10-05:

- initially mapped 27 material current responsibilities; P4 Closure expands this to
  35 after technical-package and outbox-foundation classification;
- assigned each approved P1 domain a target owner, preserving Application as a
  first-class module and strict tenant/authorization boundaries;
- recorded all DELETE actions as conditional retirement, never as a P4 deletion;
- preserved required migration sequence and made the Governance audit/outbox foundation
  an explicit technical prerequisite for reliable Communication;
- identified missing regression/data/compatibility evidence as P5 entry blockers;
- recorded the current source only as evidence; no application code, source path,
  runtime configuration, database migration, or deployment behavior was changed;
- checked map/plan links and required item fields.

**P4 initial planning gate: PASS.** P5 start remains subject to the closure gate below.

## 20. P4 Closure checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P4-C-01 | Separate transactional outbox/event delivery from Governance business ownership and put it before Communication | DONE | `MIGRATION_MAP.md` P4-MIG-019/028; `MIGRATION_PLAN.md` Ã‚Â§3.1 |
| P4-C-02 | Record command-level regression baseline honestly | DONE | `REGRESSION_BASELINE.md` Ã‚Â§1 |
| P4-C-03 | Classify stale current tests and required characterization/target harnesses | DONE | `REGRESSION_BASELINE.md` Ã‚Â§Ã‚Â§2Ã¢â‚¬â€œ3 |
| P4-C-04 | Record PostgreSQL/Redis backup, restore, persistence, and recovery gate | DONE | `REGRESSION_BASELINE.md` Ã‚Â§4 |
| P4-C-05 | Classify the remaining requested technical packages from static runtime references | DONE | `MIGRATION_MAP.md` P4-MIG-029Ã¢â‚¬â€œ035; `TECHNICAL_DEBT.md` |
| P4-C-06 | Create explicit stale/mixed documentation inventory and treatment conditions | DONE | `DOCUMENT_STATUS.md` |
| P4-C-07 | Re-review P4 gates without claiming unavailable checks pass | DONE | P4 Closure validation record below |

**P4 Closure progress: 7 / 7 tasks complete. P4 total: 15 / 15 tasks complete.**

## 21. P4 Closure artifacts and validation record

- [Regression Baseline](./REGRESSION_BASELINE.md)
- [Current-State Execution Addendum](./CURRENT_STATE.md)
- [Technical Debt Classification](./TECHNICAL_DEBT.md)
- [Documentation Status Inventory](./DOCUMENT_STATUS.md)

Completed on 2026-10-05:

- split outbox/event delivery (`P4-MIG-019`) from Governance audit ownership
  (`P4-MIG-028`), producing only forward edges: `019 Ã¢â€ â€™ 016/018` and `019 Ã¢â€ â€™ 028`;
- classified 35 items: 1 KEEP, 2 MOVE, 10 REFACTOR, 14 REWRITE, and 8 DELETE;
- confirmed every DELETE retains prerequisites, validation, and removal conditions;
- statically inspected all requested technical components and recorded their target
  owner or conditional retirement; no technical package in the closure scope remains
  unclassified;
- documented stale tests and all requested characterization/target-test gaps without
  fabricating current or target behavior;
- recorded Node/pnpm/Docker/database execution as `NOT_AVAILABLE`, not PASS;
- documented backup/restore commands and the destructive-migration gate as
  `NOT_EXECUTED` pending a suitable environment;
- inventoried stale/mixed documentation and recorded non-destructive treatment gates;
- did not change application source, test source, migrations, runtime configuration,
  or deployment behavior.

**P4 closure gate: PASS.** The initial environment/recovery restriction is superseded
by the enablement record below.

## 22. P4 Environment and Regression Baseline Enablement

| ID | Task | Status | Evidence |
|---|---|---|---|
| P4-E-01 | Inspect toolchain, workspace and package-manager requirements | DONE | `REGRESSION_BASELINE.md` §§1,1.1 |
| P4-E-02 | Enable a conforming Node/pnpm toolchain without changing repository requirements | DONE | Node 24.19.0 portable toolchain; pnpm 10.17.0; `REGRESSION_BASELINE.md` §1.1 |
| P4-E-03 | Install dependencies from frozen lockfile | DONE | `pnpm install --frozen-lockfile`, exit 0; `REGRESSION_BASELINE.md` §1 |
| P4-E-04 | Execute build, typecheck, lint and unit-test baseline | DONE | `REGRESSION_BASELINE.md` §1 |
| P4-E-05 | Execute and classify all existing service E2E suites | DONE | `REGRESSION_BASELINE.md` §§1,3 |
| P4-E-06 | Execute non-destructive migration check and classify infrastructure availability | DONE | `REGRESSION_BASELINE.md` §§1,4 |
| P4-E-07 | Confirm characterization/harness readiness and cutover gates | DONE | `REGRESSION_BASELINE.md` §2 |
| P4-E-08 | Reassess P5 skeleton readiness without beginning P5 | DONE | Validation record below |

**P4 Enablement progress: 8 / 8 tasks complete. P4 total: 23 / 23 tasks complete.**

## 23. P4 Enablement validation record

- dependency installation, build and typecheck are reproducibly PASS under the
  repository-required pnpm version;
- lint and unit-test failures were reproduced without source edits and have stable
  comparison evidence; all existing E2E suites were reproduced and classified STALE;
- PostgreSQL/Redis/Docker absence, DB-configuration failure, and backup/restore
  non-execution are explicit rather than unknown;
- missing permission/lifecycle/concurrency harnesses retain named pre-cutover gates in
  the migration plan; no target behavior was implemented;
- no migration dependency conflict, circular dependency, unsafe DELETE, domain
  ownership gap, or unknown critical runtime dependency remains for **P5 skeleton**;
- no application source, test source, dependency version, lockfile, migration, or
  runtime configuration was changed.

**P5 skeleton entry: READY.** PostgreSQL/Redis availability, backup/restore rehearsal,
and characterization/target harnesses remain mandatory before any identity data,
infrastructure, or domain cutover.

## 24. P5 Target Repository Skeleton checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P5-01 | Create and wire the inactive target application package | DONE | `apps/api/package.json`, `apps/api/nest-cli.json`, root `nest-cli.json`, and workspace lockfile importer |
| P5-02 | Create the ten approved domain module boundaries | DONE | `apps/api/src/modules/*` with `api`, `application`, `domain`, and `infrastructure` paths |
| P5-03 | Create approved narrow technical boundaries only | DONE | `apps/api/src/platform/{configuration,http,persistence,outbox,security,observability,testing}` |
| P5-04 | Preserve legacy coexistence and keep target traffic inactive | DONE | `apps/api/src/main.ts`; `apps/api/README.md` declares `LEGACY_ACTIVE` and `TARGET_SKELETON_INACTIVE` |
| P5-05 | Wire the workspace without dependency upgrade or legacy-package cleanup | DONE | `pnpm-lock.yaml` adds only the `apps/api` importer; frozen install succeeds |
| P5-06 | Validate build and typecheck against the executed baseline | DONE | `pnpm build` and `pnpm check-types`, exit 0; target package included |
| P5-07 | Compare lint and unit-test results with the executed baseline | DONE | Target lint passes; root legacy lint/unit-test failures are classified as existing baseline failures |
| P5-08 | Validate target dependency direction and persistence isolation | DONE | Static import scan found no cross-module, legacy, direct-persistence, or prohibited technical imports in target modules |
| P5-09 | Record actual target paths and P5 implementation evidence | DONE | `MIGRATION_MAP.md`, `MIGRATION_PLAN.md`, `TARGET_ARCHITECTURE.md`, and this tracker |

**P5 progress: 9 / 9 tasks complete.**

## 25. P5 validation record

Completed on 2026-10-05:

- created `apps/api` as a workspace-recognized Nest application skeleton, without
  invoking its bootstrap function or transferring any runtime traffic;
- created exactly the approved Identity, Organization, Candidate, Recruitment
  Planning, Job, Application, Interview, Offer, Communication, and Governance
  module boundaries, each with the approved four internal layers;
- created only narrow technical platform paths, including a neutral outbox path;
  no business behavior, route, database schema, or legacy implementation was copied
  into the target skeleton;
- retained all legacy applications and their runtime routes, protocol, database
  ownership, authentication behavior, and APISIX behavior unchanged;
- confirmed frozen dependency installation, build, and typecheck pass; the target
  package's lint command passes with zero findings;
- reproduced root lint and unit-test failures as existing legacy baseline failures,
  with no `NEW_P5_FAILURE` in build or typecheck;
- found no target cross-module import, legacy implementation import, direct
  cross-domain persistence access, or circular dependency;
- did not begin P6.

**P5 gate: PASS.** P6 Technical Foundation may be separately authorized. PostgreSQL/
Redis availability, backup/restore rehearsal, characterization suites, and target
concurrency/tenant harnesses remain cutover gates; they are not blockers to this
completed inactive skeleton.

## 26. P6 Technical Foundation checklist

| ID | Task | Status | Evidence |
|---|---|---|---|
| P6-01 | Implement target-only typed configuration and fail-fast validation | DONE | `platform/configuration/target-config.ts`, `.env.example`, foundation test |
| P6-02 | Implement PostgreSQL/MikroORM transaction and migration foundation | DONE | `platform/persistence/database.module.ts`, `transaction-runner.ts`, migration policy and technical outbox migration |
| P6-03 | Implement target HTTP error, validation and bounded query primitives | DONE | `platform/http/{errors,problem-details.filter,validation.pipe,pagination}.ts` |
| P6-04 | Implement authenticated principal, public/protected route and session-revocation boundaries | DONE | `platform/security/{principal,public-route.decorator,authentication.guard}.ts` |
| P6-05 | Implement generic tenant-aware authorization foundation | DONE | `platform/security/authorization.ts`; role-derived permission union, assignment input and Platform Admin tenant-content denial |
| P6-06 | Implement structured redacted logging, correlation and safe audit intent foundation | DONE | `platform/observability/*` |
| P6-07 | Implement neutral transactional outbox and idempotency primitives | DONE | `platform/persistence/outbox/*`; `P4-MIG-019` technical-only additive migration |
| P6-08 | Add and run foundation tests | DONE | `apps/api/test/foundation.spec.ts`: 7 passing tests |
| P6-09 | Validate workspace and record migration/environment result | DONE | Frozen install, build/typecheck, target lint/test; migration check reaches PostgreSQL connection boundary |
| P6-10 | Update target/migration/tracker implementation evidence | DONE | Target README/platform README, P3 architecture, P4 map/plan, and this tracker |

**P6 progress: 10 / 10 tasks complete.**

## 27. P6 validation record

Completed on 2026-10-05:

- added target-only configuration that requires `TARGET_DATABASE_URL`, token issuer/
  audience, outbox attempts and query limits; it neither reads nor changes legacy
  runtime configuration;
- added a PostgreSQL/MikroORM module, a narrow local transaction runner, reviewed
  migration layout and one additive technical `outbox` migration. No domain table,
  domain entity, migration execution or destructive operation was performed;
- added target problem-details/error/validation/pagination, fail-closed bearer-token
  verification/session-revocation interfaces, and generic authorization inputs that
  preserve role-derived permissions, organization/assignment scope, Candidate
  independence, strict tenant isolation and Platform Admin tenant-content denial;
- added correlation-aware structured logging with sensitive-value redaction and a
  safe Governance audit-intent abstraction, without claiming audit persistence;
- implemented `P4-MIG-019` only as neutral outbox/idempotency persistence mechanics;
  it does not send a notification, invoke a worker, or create a business flow;
- ran target foundation tests: 7 / 7 PASS. Frozen install, workspace build and
  workspace typecheck PASS. Target lint PASS. Root lint/test retain only the known
  legacy baseline failures; no `NEW_P6_FAILURE` remains;
- ran `migration:check` with complete non-secret target configuration. It loaded the
  target config/mapping and stopped at `ECONNREFUSED 127.0.0.1:5432`, an existing
  unavailable-PostgreSQL environment gate, not a migration metadata/configuration
  failure;
- did not migrate a business domain, delete/move legacy source, alter APISIX, or begin
  P7.

**P6 gate: PASS.** P7 may be separately authorized. Identity is the first migration
candidate by the approved order, but is blocked from cutover by the existing data
inventory, PostgreSQL/Redis backup-restore, and characterization/security-contract
gates.

### P6 foundation compatibility resolution — 2026-10-06

**Classification:** `P6_FOUNDATION_FIX` (validation-command context only; no
foundation or business source changed).

The earlier failure was reproduced only when `tsx` was invoked from the repository
root. In that context it resolved the root TypeScript configuration rather than
`apps/api/tsconfig.json`, so legacy Nest/MikroORM decorators were transformed with an
incompatible configuration. Running the target package commands from `apps/api`
loads its approved `experimentalDecorators` configuration:

- `tsx --test test/foundation.spec.ts`: **PASS, 7/7**;
- `tsc --noEmit -p tsconfig.build.json`: **PASS**;
- `nest build`: **PASS** (SWC).

No package, dependency, legacy runtime, Identity policy, or technical foundation
behavior changed to obtain this result. Target-package commands must be executed from
the package directory (as package-manager workspace scripts normally do).

## 28. P7 Identity Migration preflight

| ID | Task | Status | Evidence |
|---|---|---|---|
| P7-ID-01 | Confirm approved Identity use cases, rules, permissions, ownership and P4 map items | DONE | `IDENTITY_MIGRATION_READINESS.md` §1; `UC-AUTH-001`–`006`, `BR-AUTH-*`, `P4-MIG-005`–`008` |
| P7-ID-02 | Design/implement Identity data model and identity-schema migration | IN_PROGRESS | Additive target entities and unexecuted target-only migration exist under `apps/api/src/modules/identity/`; P7-ID-BLK-006 blocks execution, data migration and cutover. |
| P7-ID-03 | Implement registration, verification, login and access/refresh lifecycle | IN_PROGRESS | Target service/controller/persistence boundaries exist for registration, verification, login, refresh and logout; adapter/runtime and database integration validation remain incomplete. |
| P7-ID-04 | Implement password change/reset, revocation and recovery rate limit | IN_PROGRESS | Target password policy, Argon2id and reset service paths exist; approved deployment adapters, rate-limit persistence and integration validation remain incomplete. |
| P7-ID-05 | Implement TOTP MFA, recovery-code and controlled recovery flows | IN_PROGRESS | SHA-256 TOTP/recovery-code primitives and executable policy tests exist; encrypted persistence, enrollment/disable/recovery APIs and KMS adapter remain incomplete. |
| P7-ID-06 | Implement candidate registration without membership/role grant | TODO | Approved P7 security decision record §§2–3; P7-ID-BLK-006 blocks cutover/data validation only. |
| P7-ID-07 | Implement staff invitation acceptance through an Organization public port | TODO | P7-ID-BLK-005 design contract is resolved; do not implement Organization-owned runtime behavior. |
| P7-ID-08 | Implement explicit Platform Admin account lifecycle actions and audit | TODO | Approved P7 security decision record §§4–5; preserve no-tenant-content/impersonation boundary. |
| P7-ID-09 | Add Identity API/DTO, audit/outbox and compatibility adapters | TODO | Depends on P7-ID-02 through 08; no legacy adapter/cutover is authorized. |
| P7-ID-10 | Add database-backed identity/concurrency/security tests and legacy characterization | TODO | Unit/target tests may proceed; P7-ID-BLK-006 blocks database-backed validation and legacy characterization. |
| P7-ID-11 | Validate migration/data compatibility and rollback | BLOCKED | P7-ID-BLK-006 |
| P7-ID-12 | Complete code/API/test traceability and cutover assessment | DONE | `IDENTITY_TRACEABILITY.md` and `IDENTITY_CHARACTERIZATION.md`; DB/KMS/Organization runtime are explicitly `PENDING_INTEGRATION_VALIDATION` and cutover remains blocked. |

**P7 Identity progress: 1 / 12 tasks complete.**

Implementation has begun, but no additional P7 item is marked `DONE`: the required
MFA, account lifecycle API, concrete KMS/audit/blocklist adapters, executable
Identity suite, database-backed concurrency evidence, and traceability evidence do
not yet exist. Target Identity remains inactive and legacy remains active.

## 29. P7 Identity block record

The P7 preflight found no unresolved ambiguity in the high-level business boundaries:
Identity owns credentials/sessions/account state; Organization owns memberships/roles;
Candidate registration grants no staff authority; and Platform Admin has no tenant
content bypass. The four security-policy blockers are now resolved by explicit user
approval and the Organization boundary contract is resolved for Identity design.
`P7-ID-BLK-006` remains the only cutover blocker: database/recovery evidence is not
available.

No Identity source, schema migration, API, legacy adapter, test, runtime route, APISIX
behavior, database data, or Organization source was modified. Legacy Identity remains
active and target Identity remains an empty P5/P6 module boundary.

## 30. P7 Identity blocker-resolution record

| ID | Status | Evidence |
|---|---|---|
| P7-ID-BLK-001 | RESOLVED | Explicit user approval 2026-10-06; password decision §2 in `P7_IDENTITY_SECURITY_DECISIONS.md` |
| P7-ID-BLK-002 | RESOLVED | Explicit user approval 2026-10-06; verification-token decision §3 in `P7_IDENTITY_SECURITY_DECISIONS.md` |
| P7-ID-BLK-003 | RESOLVED | Explicit user approval 2026-10-06; access/refresh/key decision §4 in `P7_IDENTITY_SECURITY_DECISIONS.md` |
| P7-ID-BLK-004 | RESOLVED | Explicit user approval 2026-10-06; TOTP/recovery decision §5 in `P7_IDENTITY_SECURITY_DECISIONS.md` |
| P7-ID-BLK-005 | RESOLVED_FOR_IDENTITY_DESIGN | `P7_IDENTITY_ORGANIZATION_INVITATION_CONTRACT.md`; no Organization implementation started |
| P7-ID-BLK-006 | OPEN — CUTOVER_ONLY | Data inventory/reconciliation procedure in `IDENTITY_MIGRATION_READINESS.md` §7; Docker/PostgreSQL/Redis unavailable |

The resolved decisions authorize only subsequent non-destructive target Identity
implementation. The resolved contract removes only the boundary-design ambiguity; its
future Organization implementation is not authorized by this P7 blocker-resolution
task. Environment/data readiness blocks migration validation, data cutover, destructive
migration, and legacy removal.

