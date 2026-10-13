# Recruitment Management Platform — Product Context

**Status:** APPROVED — retention duration remains EXTERNAL_POLICY_PENDING  
**Last updated:** 2026-10-05  
**Source:** `AGENTS.md` §§0, 4-19, 35-37, 56

## 1. Product purpose

The Recruitment Management Platform supports the business process from an identified
hiring need through recruitment request, approval, job publication, candidate
application, evaluation, offer, and hiring outcome.

The product is intended to provide controlled workflows, clear domain ownership,
organization-scoped authorization, historical traceability, and auditable handling of
sensitive recruitment actions.

## 2. Product outcomes

The platform is expected to let authorized actors:

- establish and approve recruitment demand;
- create, publish, pause, close, and archive jobs through controlled lifecycle actions;
- let candidates maintain profiles and versioned resumes;
- accept and track candidate applications without losing the submitted historical
  context;
- screen, shortlist, reject, and move applications through an explicit recruitment
  pipeline;
- schedule interviews, assign interviewers, and collect feedback/scorecards;
- create, approve when configured, send, and record candidate responses to offers;
- preserve business and security history through governance/audit capabilities;
- deliver notifications without giving the Communication domain authority over
  recruitment decisions.

## 3. In-scope business domains

1. Identity
2. Organization
3. Recruitment Planning
4. Candidate
5. Job
6. Application
7. Interview
8. Offer
9. Communication
10. Governance

Detailed ownership and dependencies are defined in [DOMAIN_MAP.md](./DOMAIN_MAP.md).

## 4. In-scope lifecycle

```text
Recruitment Need
  -> Recruitment Request
  -> Approval
  -> Job Opening
  -> Job Publication
  -> Candidate Application
  -> Screening
  -> Shortlisting
  -> Interview
  -> Evaluation / Decision
  -> Offer
  -> Accepted Offer
  -> Hire
```

Not every organization is required to use every optional approval step. Which steps
are configurable, who configures them, and their defaults remain open decisions.

## 5. Explicitly out of scope

The platform currently has no approved AI capability. The following are out of scope
unless introduced later by an explicit approved requirement and architecture decision:

- AI/ML services;
- candidate scoring or ranking by AI;
- automated candidate recommendations or matching;
- AI interview analysis;
- AI-generated interview questions;
- AI-assisted screening or rejection;
- RAG, embeddings, LLM integrations, or AI knowledge bases.

This boundary is governed by `BR-SCP-001`.

## 6. Not currently defined

The governing sources do not establish requirements for the following areas. They are
not silently included or permanently excluded by this draft:

- payroll, benefits, attendance, and employee performance management;
- employee onboarding after the recruitment hiring outcome;
- background-check providers;
- assessment/testing vendors;
- staffing-agency or external recruiter workflows;
- public job-board integrations;
- calendar-provider integrations;
- e-signature providers;
- data-retention durations and regulatory jurisdiction;
- localization, currencies, time zones, and accessibility targets;
- pricing, billing, subscription, or tenant limits.

Any of these requires a separately approved requirement before implementation.

## 7. Product principles

The normative product principles are cataloged under stable rule IDs:

- identity and scoped authorization: `BR-AUTH-001` through `BR-AUTH-007`;
- domain data ownership: `BR-DOM-001` and `BR-DOM-002`;
- Application as a first-class domain: `BR-APP-001` and `BR-APP-002`;
- explicit lifecycle operations: `BR-REQ-002`, `BR-JOB-004`, `BR-APP-003`,
  `BR-INT-007`, and `BR-OFF-004`;
- historical Candidate/Application context: `BR-CAN-003` through `BR-CAN-005`
  and `BR-APP-006`;
- notification boundaries: `BR-NOT-001` through `BR-NOT-005`;
- governance and history: `BR-AUD-001` through `BR-AUD-006`.

Business correctness taking precedence over implementation convenience is an operating
principle from `AGENTS.md`, not a separate product rule.

## 8. Product success boundary for later phases

Before implementation of a business use case, the relevant documents must be
`APPROVED`, and the use case must identify:

- actor and organization context;
- resource and owning domain;
- permission and ownership/scope checks;
- allowed current states and transition;
- preconditions and preserved history;
- audit and notification effects;
- concurrency and idempotency expectations;
- success and failure acceptance scenarios.

## 9. Product decision status

| ID | Decision | Status |
|---|---|---|
| P1-OD-001 | Per-Organization approval is default-enabled; only platform-marked steps are configurable and no direct-user bypass is supported. | APPROVED — A |
| P1-OD-002 | Confirm-hire after accepted Offer atomically creates the Application `HIRED` outcome. | APPROVED — B |
| P1-OD-003 | Candidate is independent of Organization Membership; one User may also hold staff memberships, evaluated separately. | APPROVED |
| P1-OD-004 | Strict logical tenant isolation; each private recruitment resource belongs to exactly one Organization, with no hierarchy/inherited/shared tenant access in initial scope. | APPROVED |
| P1-OD-005 | Preservation/soft-delete/anonymization principle is approved; jurisdiction, period, hold, and procedure are `EXTERNAL_POLICY_PENDING`. | APPROVED — B principle |
| P1-OD-006 | No external job-board/calendar/e-signature/background-check provider is in initial scope. | APPROVED — A |
| P1-OD-007 | Email plus in-app when available; idempotent delivery attempts never roll back committed state. | APPROVED — B |
| P1-OD-008 | The mandatory business/security audit action set is approved. | APPROVED — B |

