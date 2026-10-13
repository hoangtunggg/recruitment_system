# Codex Traceability Guide

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Document class:** operational guidance and P2 validation evidence

## 1. Purpose

This guide defines how Codex identifies authoritative sources, records traceability,
handles conflicts, and proves that it understood the P1 context before later phases.
It does not itself promote product documents; the explicit P1-finalization authority
has approved the P1 package recorded below.

## 2. Source hierarchy and document roles

The source hierarchy is routed by [`AGENTS.md`](../../AGENTS.md). Within the current
P1 package, each document has one primary role:

| Source | Primary responsibility | Must not be used as |
|---|---|---|
| [`PRODUCT_CONTEXT.md`](../product/PRODUCT_CONTEXT.md) | Product purpose, scope, outcomes, exclusions, top-level open decisions | Detailed lifecycle or permission policy |
| [`ACTORS.md`](../product/ACTORS.md) | Identity-versus-role model and actor capabilities/boundaries | Permission bypass or complete role-composition policy |
| [`PERMISSIONS.md`](../product/PERMISSIONS.md) | Permission IDs, scopes, capability matrix, mandatory checks | Complete use-case or lifecycle specification |
| [`DOMAIN_GLOSSARY.md`](../product/DOMAIN_GLOSSARY.md) | Canonical terminology | Approval of open behavior |
| [`DOMAIN_MAP.md`](../product/DOMAIN_MAP.md) | Domain ownership and collaboration boundaries | Technical integration/protocol decision |
| [`BUSINESS_RULES.md`](../product/BUSINESS_RULES.md) | Stable `BR-*` rules explicitly supported by sources | A home for unanswered policy questions |
| Lifecycle documents | Status vocabulary, approved/known transitions, invariants, lifecycle decisions | Permission catalog or inferred transition policy |
| [`USE_CASE_CATALOG.md`](../product/USE_CASE_CATALOG.md) | Stable `UC-*` action index and clarity classification | Detailed use-case specification or implementation approval |
| [`TRACEABILITY_MATRIX.md`](../product/TRACEABILITY_MATRIX.md) | P1 requirement → rule → use-case/concept coverage | Code/test traceability evidence |
| [`P1_APPROVAL_DECISIONS.md`](../product/P1_APPROVAL_DECISIONS.md) | Options, recommendations, impact, affected IDs, and closure status for every P1 decision | Approved policy until an authorized selection is recorded |
| `P1-OD-*` records | Explicitly unresolved decisions | Permission to choose a default |
| Current code/tests | Evidence of current behavior and regression surface | Automatic authority for intended business behavior |

The 14 core P1 documents are `APPROVED`. Exact retention jurisdiction/duration remains
`EXTERNAL_POLICY_PENDING`; local task authority must not be expanded beyond that stated
external parameter.

## 3. Stable identifiers

| Identifier | Meaning | Stability rule |
|---|---|---|
| `BR-{DOMAIN}-{NNN}` | Business rule | Never reuse for a different rule; deprecate/archive rather than renumber |
| `UC-{DOMAIN}-{NNN}` | Business use case | Never reuse for another action |
| `PERM-{DOMAIN}-{ACTION}` | Draft permission capability | Keep meaning and scope stable after approval; changes require review |
| `P1-OD-{NNN}` | Open P1 decision | Retain as decision history after resolution and link the approved outcome |
| ADR ID | Technical architecture decision | Supersede through ADR governance rather than silent replacement |

Current P1 baseline:

- 100 unique business rules: all individually `APPROVED`;
- 69 unique use cases: all `DEFINED_ACTION`, with P1 detailed specification profiles;
- 47 unique permission IDs in an `APPROVED` permission model;
- 70 sequential decisions (`P1-OD-001`–`P1-OD-070`): all `APPROVED`; `067`–`070` were added
  during P1 Approval Closure to cover previously unmapped identity/account and
  notification-history policy gaps;
- 100/100 P1 rules mapped to a requirement source and a use case/concept boundary;
- code and test traceability remain `NOT_STARTED` for later implementation phases.

## 4. Traceability chain

For business behavior, maintain:

```text
Approved requirement
  -> BR-* rule
  -> UC-* use case
  -> actor + PERM-* + resource scope
  -> lifecycle operation / domain collaboration
  -> implementation location
  -> tests and validation evidence
```

Use this task record:

| Field | Required content |
|---|---|
| Requirement | Exact approved source and status |
| Rule | Applicable `BR-*` IDs |
| Use case | `UC-*` ID and clarity/status |
| Actor/scope | Actor, membership, organization, ownership/assignment, resource state |
| Domain | Owning domain and approved collaborators |
| Lifecycle | Named operation, from/to state, preconditions |
| Implementation | File/module/interface and migration when applicable |
| Tests | Test location and success/failure scenarios |
| Validation | Commands actually run and outcome |
| Gaps | `P1-OD-*`, architecture conflict, or unverified behavior |

Documentation-only work stops at the highest link it actually establishes. Never mark
code/test traceability complete merely because a document predicts where code might
live.

## 5. Conflict and ambiguity protocol

When sources disagree or omit required policy:

1. identify every relevant source and its status;
2. apply the hierarchy in `AGENTS.md`;
3. distinguish current behavior from intended behavior;
4. identify the exact decision needed;
5. reuse the applicable `P1-OD-*` ID, or create a new governed decision record only
   when the documentation task authorizes it;
6. avoid silently merging incompatible rules;
7. record the result as resolved by an approved source or as a blocker.

The only remaining product parameter is the jurisdiction-specific retention/legal-hold
policy under `P1-OD-005`; it is `EXTERNAL_POLICY_PENDING`, has a Privacy/Legal owner,
and does not block P3 architecture.

## 6. Legacy citation continuity

P1 documents cite numbered sections from the pre-P2 monolithic `AGENTS.md`. The
legacy citation table in the current [`AGENTS.md`](../../AGENTS.md) routes each section
range to its replacement source. Those citations are provenance markers; the stable
rule text now lives in `BUSINESS_RULES.md` and the related P1 document.

Future approval work may normalize provenance to direct document links, but must not
renumber stable rule, use-case, permission, or open-decision IDs.

## 7. P2 context-comprehension test

### 7.1 Scoring

- One point per question; 20 points available.
- Passing score: at least 17/20 (85%).
- A critical guardrail question must not be answered incorrectly: Q1, Q6–Q8, Q11,
  Q13, Q17, Q19, or Q20.
- Recognizing an intentionally unresolved decision is a correct answer; inventing a
  policy is incorrect.

### 7.2 Questions, answers, and evidence

| # | Category | Question | Answer | Evidence | Score |
|---:|---|---|---|---|---:|
| 1 | Actor | Is `User` a business role? | No. It is authenticated identity; organization roles are attached through membership and platform roles remain separate. | Actors §1; `BR-AUTH-001`–`003` | 1 |
| 2 | Actor | What private data may a Candidate manage? | Their own profile, resume versions, applications, assigned interview participation, and own offers within permission/state limits; never another candidate's private application. | Actors Candidate; Permissions Candidate | 1 |
| 3 | Actor | Does `RECRUITER` grant access to every organization or every resource in one organization? | No. Access is organization-scoped and can also require ownership/assignment and state. | Actors Recruiter; `BR-ORG-001`, `BR-ORG-002` | 1 |
| 4 | Actor | What limits an Interviewer? | Assignment to the interview and minimum necessary candidate/job context unless broader authority is explicitly granted. | Actors Interviewer; `BR-INT-002`, `003` | 1 |
| 5 | Actor | Are Organization Admin and Platform Admin interchangeable? | No. One is organization-scoped; the other is separately platform-scoped. Neither receives tenant recruitment-content access from its admin role. | Actors; `BR-ORG-003`, `BR-AUTH-012`, `BR-ORG-008` | 1 |
| 6 | Permission | Which dimensions form a protected authorization decision? | Authenticated user, membership, role, permission, resource organization/ownership/assignment, resource state, and business preconditions as applicable. | Permissions §§1,5; `BR-AUTH-005` | 1 |
| 7 | Permission | Is hiding a frontend control sufficient authorization? | No. Every protected operation requires backend enforcement. | `BR-AUTH-004` | 1 |
| 8 | Permission | May a Recruiter in Organization A read Organization B private recruitment data by knowing its ID? | No. ID knowledge is insufficient and organization scope must match. | `BR-AUTH-006`; `BR-ORG-002` | 1 |
| 9 | Permission | May Platform Admin view tenant recruitment content during support? | No in initial scope. Platform Admin is limited to permitted platform/control metadata and cannot bypass tenant authorization; break-glass is not implemented. | Permissions §§6,8; `BR-AUTH-012`; `P1-OD-014` | 1 |
| 10 | Permission | Can a Hiring Manager approve every offer? | No. A Hiring Manager may approve only a configured Offer within tenant/assignment/state scope and cannot approve an Offer they created; lifecycle details remain open in `P1-OD-057`–`058`. | Permissions Hiring Manager; `BR-OFF-006` | 1 |
| 11 | Lifecycle | Which of the five P1 lifecycles has a complete explicitly defined transition matrix? | Job only. | Job lifecycle §2; other lifecycle §2 sections | 1 |
| 12 | Lifecycle | What Job transitions are explicitly defined? | `DRAFT→OPEN`, `OPEN→PAUSED`, `PAUSED→OPEN`, `OPEN→CLOSED`, `PAUSED→CLOSED`, `CLOSED→ARCHIVED`. | Job lifecycle §2; `BR-JOB-002` | 1 |
| 13 | Lifecycle | May CLOSED or ARCHIVED Jobs accept new applications? | No, unless a future approved requirement defines an exception. | `BR-JOB-003` | 1 |
| 14 | Lifecycle | Is `DRAFT→PENDING_APPROVAL` an approved Recruitment Request transition? | No complete matrix is approved; plausible sequencing must not be inferred. | Recruitment Request lifecycle §2; `P1-OD-025` | 1 |
| 15 | Lifecycle | Does Interview completion prove feedback completion? | No. They are separate concepts, and completion with pending feedback requires approved policy. | `BR-INT-004`, `BR-INT-005` | 1 |
| 16 | Lifecycle | Does sending an Offer complete hiring? | No. `SENT` is not `ACCEPTED`, and the hiring-completion operation remains unresolved. | `BR-OFF-002`, `BR-OFF-003`; `P1-OD-064` | 1 |
| 17 | Ownership | Which domain owns screening, pipeline, rejection information, and application history? | Application; it is first-class and must not be hidden inside Job or Candidate. | Domain Map; `BR-APP-001`, `002` | 1 |
| 18 | Ownership | Can a Candidate profile or new resume version rewrite an old Application? | No. Historical submission context and the associated resume version must remain stable. | `BR-CAN-003`–`005`; `BR-APP-006` | 1 |
| 19 | Ownership | May Application directly update private Interview persistence when starting interviews? | No. Collaboration must use an approved operation/interface/event while each domain owns its data. | Domain Map §3; `BR-DOM-002`, `BR-APP-008` | 1 |
| 20 | Ownership | May Communication reject, shortlist, approve, or hire? | No. It owns delivery/history and communicates committed decisions; it does not make recruitment decisions. | Domain Map; `BR-NOT-001`–`003` | 1 |

### 7.3 Result

- Score: **20/20 (100%)**.
- Threshold: **17/20 (85%)** with zero critical failures.
- Critical failures: **0**.
- Result: **PASS**.
- Coverage: actors, permissions, five lifecycle boundaries, and domain ownership.
- Limitation: this validates documentation comprehension only; it does not validate
  application code, runtime behavior, architecture, or unresolved business policy.

P2 may be marked complete because the routing package passes its stated comprehension
gate. P1 ambiguities remain blockers for approving affected implementations and for
starting target-architecture decisions that depend on them.

### 7.4 P7 Identity security-approval trace

The explicit user approval dated 2026-10-06 resolves implementation decisions
`P7-ID-BLK-001` through `P7-ID-BLK-004`; it does not alter P1 business authority.
The requirement-to-decision mapping and planned target concerns are in
[`P7_IDENTITY_SECURITY_DECISIONS.md`](../architecture/P7_IDENTITY_SECURITY_DECISIONS.md)
§6. No code/test traceability is claimed: Identity implementation has not started.

`P7-ID-BLK-005` is resolved for Identity boundary design only. `P7-ID-BLK-006`
remains cutover-only: it blocks data migration, destructive work, legacy removal, and
production cutover, but not a future non-destructive target Identity implementation.
The P7 readiness state is tracked in
[`IDENTITY_MIGRATION_READINESS.md`](../restructure/IDENTITY_MIGRATION_READINESS.md).

## 8. P2 refresh after P1 finalization

Completed on 2026-10-05 against the approved P1 baseline.

| # | Check | Expected context answer | Result |
|---:|---|---|---|
| 1 | Candidate tenancy | Candidate is independent of Membership; no staff grant from signup | PASS |
| 2 | Platform support | No impersonation or tenant recruitment-content access | PASS |
| 3 | Request approval | Configured non-creator approver; Recruiter alone cannot approve | PASS |
| 4 | Request state | `APPROVED` is not `IN_RECRUITMENT` | PASS |
| 5 | Headcount | `filled <= requested`, atomically checked at confirm-hire | PASS |
| 6 | Job admission | Only `OPEN` accepts a new Application | PASS |
| 7 | Application duplicate | One Candidate+Job in initial scope; submission is concurrency-safe | PASS |
| 8 | Snapshot | Resume version and approved minimal submission context are historical | PASS |
| 9 | Interview ownership | Outcome does not directly mutate Application persistence | PASS |
| 10 | Feedback | Assigned scope only; locks at submission/no edit initial scope | PASS |
| 11 | Offer approval | Default enabled; creator cannot approve | PASS |
| 12 | Offer capacity | No reservation at `OFFERED`; consume only at confirm-hire | PASS |
| 13 | Notification | Email/in-app, idempotent retry, no rollback of committed state | PASS |
| 14 | Audit | Required governed actions are recorded without secrets | PASS |
| 15 | Retention | Principle approved; exact jurisdiction/duration remains external | PASS |

Score: **15 / 15 (100%)**; threshold: **>= 90%**; critical failures: **0**;
P2 refresh result: **PASS**. The sentence above this section reflects the earlier
draft-P1 checkpoint and is superseded by this refresh record.

