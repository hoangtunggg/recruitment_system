# Recruitment Management Platform — Agent Router

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Purpose:** route an agent to the minimum authoritative context required for a task

This file is an index and operating router. It does not duplicate product rules,
lifecycle definitions, permissions, architecture decisions, or implementation
standards. Follow the linked source rather than treating this file as a substitute
for it.

## 1. Start here

1. Classify the task by mode and business domain.
2. Check document status before relying on a requirement.
3. Read the minimum required sources in the routing tables below.
4. If sources conflict, apply the hierarchy in §2 and record the conflict.
5. If a required business decision is unresolved, do not invent it.
6. For restructure work, obey the current phase in
   [`RESTRUCTURE_TRACKER.md`](docs/restructure/RESTRUCTURE_TRACKER.md).

The repository remains in a legacy/pre-restructure state. P0 and P1 artifacts describe
current state and draft business intent; they do not prove that the current source
implements the target. No application source restructure is authorized before the
approved migration phase.

## 2. Source of truth

### 2.1 Business behavior

Apply the first applicable source, in this order:

1. explicit task requirement approved by the user;
2. an `APPROVED` use-case specification;
3. [`BUSINESS_RULES.md`](docs/product/BUSINESS_RULES.md);
4. [`PERMISSIONS.md`](docs/product/PERMISSIONS.md);
5. [`PRODUCT_CONTEXT.md`](docs/product/PRODUCT_CONTEXT.md);
6. the relevant lifecycle document;
7. [`DOMAIN_MAP.md`](docs/product/DOMAIN_MAP.md) and
   [`DOMAIN_GLOSSARY.md`](docs/product/DOMAIN_GLOSSARY.md);
8. current implementation, as evidence of current behavior only.

The 14 core P1 product documents are `APPROVED`. `P1-OD-005` retains only its exact
legal retention/jurisdiction parameters as `EXTERNAL_POLICY_PENDING`; do not invent a
period or legal-hold procedure. See the status and conflict rules in
[`TRACEABILITY.md`](docs/codex/TRACEABILITY.md).

### 2.2 Technical behavior

Apply the first applicable source, in this order:

1. explicit task requirement approved by the user;
2. accepted ADR;
3. approved architecture document;
4. approved engineering standard;
5. current implementation and tests.

The approved P3 target architecture is in
[`TARGET_ARCHITECTURE.md`](docs/architecture/TARGET_ARCHITECTURE.md) and its decision
records are in [`P3_DECISION_RECORDS.md`](docs/architecture/P3_DECISION_RECORDS.md).
Do not infer target behavior from directory examples, the README, or legacy
implementation. Current-state evidence is indexed under [`docs/restructure/`](docs/restructure/).

## 3. Mode routing

| Task mode | Required guide | Additional context |
|---|---|---|
| Implement or modify behavior | [`IMPLEMENTATION_GUIDE.md`](docs/codex/IMPLEMENTATION_GUIDE.md) | Domain row in §4, current code, tests, and approved architecture when available |
| Review or audit code | [`REVIEW_GUIDE.md`](docs/codex/REVIEW_GUIDE.md) | Domain row in §4 and current implementation evidence |
| Trace requirements, resolve document conflicts, or close P1 decisions | [`TRACEABILITY.md`](docs/codex/TRACEABILITY.md) | P1 traceability matrix, [`P1_APPROVAL_DECISIONS.md`](docs/product/P1_APPROVAL_DECISIONS.md), and relevant owning sources |
| Prepare or assess a task prompt | [`PROMPT_GUIDE.md`](docs/codex/PROMPT_GUIDE.md) | Domain row in §4 |
| Restructure phase work | [`RESTRUCTURE_TRACKER.md`](docs/restructure/RESTRUCTURE_TRACKER.md) | Only the artifacts required by the active phase |
| Current-state architecture investigation | [`CURRENT_STATE_AUDIT.md`](docs/restructure/CURRENT_STATE_AUDIT.md) | Documentation inventory and conflict register as needed |
| Target architecture or ADR work | Approved files under [`docs/architecture/`](docs/architecture/) and `docs/adr/` when they exist | Product context, domain map, P0 conflicts, and tracker |

## 4. Domain and task routing

`Relevant sections` means the rows carrying that domain's `BR-*`, `UC-*`, or
`PERM-*` IDs; it does not require loading unrelated rows.

| Domain/task | Read first | Read when applicable |
|---|---|---|
| Product scope or product-wide terminology | [`PRODUCT_CONTEXT.md`](docs/product/PRODUCT_CONTEXT.md), [`DOMAIN_GLOSSARY.md`](docs/product/DOMAIN_GLOSSARY.md) | Business rules, use-case catalog, open decisions |
| Identity/authentication | Actors, relevant `BR-AUTH-*`, relevant `UC-AUTH-*` | Permissions, Governance rules, current identity implementation |
| Organization/membership | Actors, Permissions, relevant `BR-ORG-*` and `UC-ORG-*` | Domain map, Governance rules, organization code |
| Recruitment Request | Relevant `BR-REQ-*`, `UC-REQ-*`, [`RECRUITMENT_REQUEST_LIFECYCLE.md`](docs/product/lifecycles/RECRUITMENT_REQUEST_LIFECYCLE.md) | Permissions, Domain Map, approved headcount/approval matrix |
| Candidate/profile/resume | Relevant `BR-CAN-*`, `UC-CAN-*`, Permissions | Domain Map; Application lifecycle and snapshot rules when historical submissions are affected |
| Job | Relevant `BR-JOB-*`, `UC-JOB-*`, [`JOB_LIFECYCLE.md`](docs/product/lifecycles/JOB_LIFECYCLE.md) | Permissions, Recruitment Request relationship, Application admission rules |
| Application | Relevant `BR-APP-*`, `UC-APP-*`, [`APPLICATION_LIFECYCLE.md`](docs/product/lifecycles/APPLICATION_LIFECYCLE.md) | Permissions, Candidate snapshot/resume rules, Job state, Interview/Offer collaboration |
| Interview | Relevant `BR-INT-*`, `UC-INT-*`, [`INTERVIEW_LIFECYCLE.md`](docs/product/lifecycles/INTERVIEW_LIFECYCLE.md) | Permissions, Domain Map, Application collaboration, notification/audit rules |
| Offer | Relevant `BR-OFF-*`, `UC-OFF-*`, [`OFFER_LIFECYCLE.md`](docs/product/lifecycles/OFFER_LIFECYCLE.md) | Permissions, Application/hiring coordination, headcount, notification/audit rules |
| Communication/notification | Relevant `BR-NOT-*`, `UC-NOT-*`, Domain Map | Triggering domain's committed operation, delivery/idempotency requirements |
| Governance/audit/history | Relevant `BR-AUD-*`, `UC-AUD-*`, Permissions | Triggering domain's use case and lifecycle; privacy/retention decisions |
| Permission/security | [`ACTORS.md`](docs/product/ACTORS.md), [`PERMISSIONS.md`](docs/product/PERMISSIONS.md), relevant authorization and domain rules | Resource ownership, lifecycle state, current backend enforcement |
| Cross-domain workflow | [`DOMAIN_MAP.md`](docs/product/DOMAIN_MAP.md), relevant domain/lifecycle documents | [`TRACEABILITY_MATRIX.md`](docs/product/TRACEABILITY_MATRIX.md), permissions, approved architecture/ADR |
| Database/concurrency/idempotency | Relevant use case, business rules, lifecycle, and ownership map | Approved data architecture/ADR and current persistence evidence |
| API/error contract | Relevant use case and permission/lifecycle rules | Approved API standard and current contract/error behavior |
| Tests | Relevant rule/use-case IDs and lifecycle | Implementation guide, current test structure, approved acceptance criteria |

Indexes used by the table:

- actors and role boundaries: [`ACTORS.md`](docs/product/ACTORS.md);
- permission IDs and resource checks: [`PERMISSIONS.md`](docs/product/PERMISSIONS.md);
- all stable business-rule IDs: [`BUSINESS_RULES.md`](docs/product/BUSINESS_RULES.md);
- all stable use-case IDs: [`USE_CASE_CATALOG.md`](docs/product/USE_CASE_CATALOG.md);
- domain ownership/collaboration: [`DOMAIN_MAP.md`](docs/product/DOMAIN_MAP.md);
- P1 rule-to-use-case coverage: [`TRACEABILITY_MATRIX.md`](docs/product/TRACEABILITY_MATRIX.md).
- P1 approval options/status: [`P1_APPROVAL_DECISIONS.md`](docs/product/P1_APPROVAL_DECISIONS.md).

## 5. Requirement-state routing

Allowed requirement states are `DRAFT`, `APPROVED`, `DEPRECATED`, and `ARCHIVED`.

| State | Agent behavior |
|---|---|
| `APPROVED` | May be used as authoritative behavior within its stated scope |
| `DRAFT` | Use for analysis/planning; surface ambiguity before implementation |
| `DEPRECATED` | Do not use for new behavior; preserve only where compatibility requires it |
| `ARCHIVED` | Historical context only |

If the task needs an answer that a `DRAFT` document intentionally leaves open, cite
the relevant `P1-OD-*` decision and stop short of creating a platform-wide rule.

## 6. Legacy `AGENTS.md` citation routing

P1 documents contain provenance references to the pre-P2, monolithic `AGENTS.md`.
Use this table to resolve those references after this file became a router. The P1
rule text remains in the linked product source; this table does not recreate it.

| Legacy section | Current routed source |
|---|---|
| §0, §56 | Product Context and `BR-SCP-001` in Business Rules |
| §§4–5 | Actors, Permissions, and `BR-AUTH-*`/`BR-ORG-*` |
| §§6–8 | Domain Map and domain-ownership rules |
| §9 | Product Context and Domain Map |
| §10 | Recruitment Request lifecycle and `BR-REQ-*` |
| §11 | Job lifecycle and `BR-JOB-*` |
| §12 | Application lifecycle and `BR-APP-*` |
| §13 | Interview lifecycle and `BR-INT-*` |
| §14 | Offer lifecycle and `BR-OFF-*` |
| §15 | All relevant lifecycle documents and transition-guard rules |
| §§16–17 | Candidate/Application history rules and Application lifecycle |
| §§18–19, §45 | Actors, Permissions, and authorization rules |
| §§20–23 | Business Rules, Use Case Catalog, and Implementation Guide |
| §§29–34 | Implementation Guide; approved data architecture/ADR when available |
| §§35–37 | Communication/Governance business rules and Implementation Guide |
| §§41–46 | Implementation Guide plus relevant lifecycle/permission sources |
| §47 | Codex Traceability Guide and P1 Traceability Matrix |
| §§48–55, §§57–60, §§64–65 | This router, tracker, P0 artifacts, and Implementation Guide |
| §§61–63 | Implementation Guide and canonical Domain Glossary |
| §66 | Review Guide |
| §67 | Implementation Guide |

## 7. Stop and route conditions

Stop the current course and route to the indicated source when:

| Condition | Route/action |
|---|---|
| Required business behavior is DRAFT, missing, or conflicts | Traceability Guide plus the owning product source; record the applicable open decision/blocker |
| Required technical direction has no approved ADR/architecture | Current-state audit and tracker; defer the target decision to its authorized phase |
| Requested work exceeds the active restructure phase | Tracker; obtain explicit phase authority before changing scope |
| Validation cannot be run or fails | Implementation Guide; report the exact unverified or failing check |
| Task is review-only | Review Guide; report findings without modifying code |
| Tracker evidence does not exist | Leave the item incomplete |

The linked sources define the actual rules; this router only selects them.

