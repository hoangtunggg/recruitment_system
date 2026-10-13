# Codex Implementation Guide

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Document class:** operational guidance; does not approve DRAFT business policy

## 1. Purpose

This guide defines how an agent prepares, implements, validates, and reports a code
change in this repository. It is subordinate to the source hierarchy in
[`AGENTS.md`](../../AGENTS.md) and must be combined with the domain-specific sources
routed there.

The repository is still in the controlled restructure program. Consult
[`RESTRUCTURE_TRACKER.md`](../restructure/RESTRUCTURE_TRACKER.md) before any structural
change. P2 authorizes Codex context documentation only; it does not authorize source
reorganization, target-architecture implementation, or runtime behavior changes.

## 2. Entry gate

Before changing code, establish all of the following:

1. Task scope and explicitly permitted files or systems.
2. Applicable requirement status (`APPROVED`, `DRAFT`, `DEPRECATED`, `ARCHIVED`).
3. Use-case ID and business-rule IDs, when the task changes business behavior.
4. Actor and authenticated identity context.
5. Organization, ownership, assignment, and platform scope.
6. Owning domain and every collaborating domain.
7. Current lifecycle state and permitted named operation.
8. Historical data that must remain stable.
9. Audit and external side effects.
10. Concurrency and idempotency risks.
11. Current execution, persistence, API, and test behavior.
12. Approved architecture/ADR constraints, if any.

If a critical answer is unknown, record the ambiguity or blocker. Do not fill a gap
with a plausible but unapproved platform policy.

## 3. Requirement readiness

| Situation | Permitted action |
|---|---|
| Approved requirement and approved technical direction exist | Implement within task scope |
| Business source is `DRAFT` | Analyze, plan, prototype only when explicitly requested; do not make permanent behavior implicit |
| Use case is `NEEDS_POLICY` | Resolve or obtain explicit task authority for the relevant `P1-OD-*` decisions before implementation |
| Sources conflict | Apply source hierarchy, document both sources and the resolution or blocker |
| Current code differs from approved behavior | Preserve compatibility only where required; plan an explicit migration |
| Target architecture is absent or unapproved | Do not infer or implement a repository-wide target structure |

The approved catalog contains no `NEEDS_POLICY` use cases. Detailed P1 specification
profiles remain behavioral authority; implementation still also requires approved
technical architecture from P3 and must preserve the `EXTERNAL_POLICY_PENDING` legal
retention parameter.

## 4. Change workflow

### 4.1 Discover

- Use the domain/task row in [`AGENTS.md`](../../AGENTS.md).
- Read only the required product and technical sources.
- Trace callers, entry points, persistence, side effects, contracts, and tests.
- Distinguish current implementation evidence from intended business behavior.
- Inspect the worktree and preserve unrelated user changes.

### 4.2 Plan

For non-trivial work, write a concise plan covering:

- objective and non-goals;
- affected use cases and rules;
- owning/collaborating domains;
- files/modules and interfaces;
- authorization and lifecycle checks;
- data migration or compatibility impact;
- concurrency, transactions, idempotency, and side effects;
- validation and rollback/recovery considerations.

Planning is required for multi-domain behavior, lifecycle changes, authorization,
schema changes, transactions, concurrency, external events, migrations, or major
refactoring.

### 4.3 Implement

- Keep the change small and reviewable.
- Use canonical terms from
  [`DOMAIN_GLOSSARY.md`](../product/DOMAIN_GLOSSARY.md).
- Keep business behavior near its owning domain.
- Represent lifecycle changes as named business operations.
- Enforce protected actions at the backend.
- Reuse the repository's approved API, error, persistence, and migration conventions.
- Do not add an abstraction, shared utility, dependency, or service boundary without a
  concrete task need.
- Do not perform unrelated cleanup.

### 4.4 Validate

Validate in proportion to the change and report only commands actually run:

1. inspect the final diff and changed-file scope;
2. run relevant formatting/lint/static checks;
3. run focused unit tests;
4. run relevant integration and E2E tests when available;
5. validate migrations and compatibility when applicable;
6. exercise negative, authorization, lifecycle, rollback, concurrency, and retry
   scenarios relevant to the change;
7. confirm documentation and traceability are synchronized.

Separate failures introduced by the task from pre-existing failures. Never claim the
repository test baseline is passing without evidence.

### 4.5 Report

The completion report must state:

- requirements/use cases/rules addressed;
- significant files changed;
- behavior changed or explicitly unchanged;
- validation commands and outcomes;
- requirement → rule → use case → code → test traceability;
- unresolved ambiguity, blockers, and unverified behavior;
- tracker changes and next recommended task when working in the restructure program.

## 5. Domain and authorization guardrails

The exact rules live in the product documents. During implementation, verify these
cross-cutting concerns rather than copying their definitions into code comments:

- `User` is identity; organization roles are evaluated through membership.
- Platform authority and organization authority are separate.
- A role or resource identifier alone is insufficient authorization.
- Protected operations evaluate authenticated identity, membership, permission,
  organization, ownership/assignment, resource state, and business preconditions.
- Candidate, Recruiter, Hiring Manager, Interviewer, Organization Admin, and Platform
  Admin have distinct scopes defined in Actors and Permissions.
- Each domain owns its persistence. Cross-domain progression uses an approved
  interface or event, not direct private-table mutation.
- Communication delivers side effects and never makes recruitment decisions.
- Sensitive actions are evaluated for audit without logging secrets.

Use the stable IDs in `BUSINESS_RULES.md` and `PERMISSIONS.md` in plans, tests, and
non-obvious rationale where helpful.

## 6. Lifecycle operations

For a lifecycle-changing operation, answer:

| Question | Required evidence |
|---|---|
| Who acts? | Actor, authenticated identity, membership/scope |
| What operation? | Stable use-case ID and named business action |
| On what resource? | Resource ID, owning domain, organization/ownership |
| From which state? | Current state allowed by an approved lifecycle |
| To which state? | Result defined by the named operation |
| Which preconditions? | Applicable business rules and related-resource state |
| What history? | Snapshot, version, reason, timestamp, or terminal state retained |
| What audit? | Required/evaluated event and non-sensitive metadata |
| What side effects? | Notification/event ordering and failure handling |
| What races? | Database invariant, conditional update, lock, or transaction as justified |
| What retries? | Idempotency strategy and duplicate-outcome prevention |
| What tests? | Success plus relevant invalid/forbidden/conflict cases |

Do not expose unrestricted status assignment for lifecycle entities. The only complete
P1 transition matrix is currently the Job lifecycle. Recruitment Request,
Application, Interview, and Offer matrices remain unresolved DRAFT policy.

## 7. Data and persistence

- Validate authorization, related resources, and business rules before writes.
- Do not assume an empty database.
- Schema changes must address existing rows, defaults, nullability, migration order,
  rollback/forward compatibility, deployment sequencing, and indexes justified by
  real access patterns.
- Protect race-sensitive invariants at the database layer when practical; a separate
  check followed by insert is not sufficient under concurrency.
- Use a transaction when multiple database mutations form one logical atomic action.
- Keep transactions small and do not hold them open around remote calls.
- Preserve business-significant history through lifecycle state, archive,
  deactivation, or approved soft deletion.
- Candidate updates and new resume versions must not silently rewrite historical
  Application submission context.
- Use bounded, deterministically ordered pagination for growing collections.
- Use parameterized persistence APIs and handle wildcard/Unicode behavior explicitly
  for LIKE-style searches.
- Evaluate N+1 queries, full scans, deep offsets, over-fetching, and filtering in
  memory; do not add indexes without a demonstrated access pattern or invariant.

## 8. API, validation, and errors

- Prefer action-oriented endpoints for lifecycle operations.
- CRUD is acceptable for resources without meaningful lifecycle constraints.
- Follow the approved response, error-code, HTTP-status, validation-error, and
  pagination contracts; do not create a one-off wrapper.
- Validate external input at backend boundaries, including required values, ID and
  enum formats, lengths, ranges, dates, collection sizes, and references.
- Use centralized error handling and stable codes for known business failures.
- Do not expose stack traces, swallow failures, or return success for partial failure.
- Internal diagnostics must retain useful context without secrets or unnecessary
  sensitive data.

## 9. Transactions, concurrency, and side effects

Evaluate shared-state races for headcount, duplicate applications, offer acceptance,
lifecycle transitions, membership, and counters. Choose the least expensive correct
mechanism: constraint, atomic/conditional update, optimistic locking, row lock, or
appropriate isolation.

External email, queues, webhooks, storage, and providers are not rolled back by a
database transaction. Define ordering, retry, idempotency, and failure recovery. Do
not claim cross-system atomicity without a mechanism that provides it.

Notification normally follows a completed or committed operation. Its failure does
not invalidate recruitment state unless an approved use case explicitly makes
delivery part of that operation.

## 10. Test expectations

Changed business behavior requires tests appropriate to its risk. Consider:

- success and invalid input;
- missing resource and forbidden actor;
- wrong organization, ownership, or assignment;
- invalid and terminal states;
- duplicate/retried action;
- transaction rollback and partial-failure prevention;
- concurrency for shared invariants;
- side-effect ordering/failure;
- every allowed and rejected lifecycle transition.

Where practical, name or annotate tests with the applicable `BR-*`/`UC-*` IDs. Tests
are evidence, not the source of an undocumented business rule.

## 11. Repository discipline

- Preserve user changes in a dirty worktree.
- Do not move, rename, delete, or broadly reformat unrelated source.
- Never delete legacy code before its approved replacement exists and validation
  passes.
- Avoid generic dumping grounds; shared code needs a clear, demonstrated owner.
- Prefer business terms and focused functions over generic status/update helpers.
- Comments explain rationale or a non-obvious rule, not syntax.
- Inspect changes for generated artifacts, secrets, local-only values, and scope
  creep before completion.

## 12. Implementation Definition of Done

Implementation may be called `DONE` only when the approved requirement is satisfied,
authorization and rules are enforced, lifecycle/error/audit behavior is handled,
relevant tests and validation pass, traceability is updated, and documentation remains
consistent. Code being written is not by itself completion.

