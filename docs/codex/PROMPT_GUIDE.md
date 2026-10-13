# Codex Prompt Guide

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Document class:** operational guidance; does not approve DRAFT business policy

## 1. Purpose

This guide helps authors give Codex a bounded, traceable task without forcing it to
load the entire repository context or guess unresolved business behavior. Domain
sources are selected through [`AGENTS.md`](../../AGENTS.md).

## 2. Minimum task brief

A strong task prompt states:

| Field | What to provide |
|---|---|
| Objective | Observable result, not only an implementation mechanism |
| Mode | Analyze, document, review, implement, migrate, or validate |
| Phase | Active restructure phase when applicable |
| Scope | Domain/use case and permitted files/systems |
| Authority | Approved requirement or explicit decision supplied by the user |
| IDs | Relevant `UC-*`, `BR-*`, `PERM-*`, `P1-OD-*`, or ADR IDs |
| Actors | Actor, organization context, ownership/assignment assumptions |
| Lifecycle | Named action and approved current/result states |
| Non-goals | Behavior, domains, or refactors not authorized |
| Compatibility | Existing API/data/deployment constraints to preserve |
| Validation | Required tests/checks and expected completion report |

If the author does not know an ID, name the business action and domain. Codex should
resolve the identifier from the catalog rather than fabricate one.

## 3. Context-loading instruction

Prefer this instruction:

> Read `AGENTS.md`, then load only the sources routed for the named task/domain. Check
> every document's status. Do not infer answers for `P1-OD-*` decisions.

Avoid telling an agent to read every repository document unless the task is explicitly
a repository-wide documentation audit. Excess context makes source priority and
unrelated legacy material harder to distinguish.

## 4. General task template

```markdown
Objective:
- <observable outcome>

Mode and phase:
- <analysis/review/implementation/...>
- <P0-P10 if applicable>

Business scope:
- Domain: <domain>
- Use case: <UC-* or action name>
- Rules/permissions: <BR-*, PERM-*>
- Actor and organization/resource scope: <details>
- Lifecycle operation: <named operation and approved states>

Authority/decisions:
- Approved source: <document/task decision>
- Resolved open decisions: <P1-OD-* and answer>

Allowed changes:
- <files/modules/systems>

Non-goals:
- <explicit exclusions>

Compatibility constraints:
- <API/data/deployment expectations>

Validation:
- <tests/checks>

Report:
- files changed, behavior, validation, traceability, blockers, next task
```

## 5. Analysis or documentation prompt

Use this when policy remains DRAFT or the task should not change runtime behavior:

```markdown
Read `AGENTS.md` and the routed <domain> sources.

Analyze <question/outcome>. Do not modify application code or runtime configuration.
Separate:
- approved/explicit facts;
- current implementation evidence;
- DRAFT proposals;
- unresolved `P1-OD-*` decisions.

Do not invent missing business rules. Update only <allowed documents> and report
traceability, conflicts, blockers, and validation performed.
```

## 6. Implementation prompt

Use only when business and technical authority is sufficient:

```markdown
Implement <UC-ID: named operation> under <approved requirement/decision>.

Actor/scope: <actor, membership, organization, ownership/assignment>.
Rules/permissions: <BR-* and PERM-*>.
Lifecycle: <approved from-state -> named action -> to-state>.
Owning domain: <domain>; collaborators: <approved interfaces/events>.

Preserve <contracts/history/compatibility>. Do not change <non-goals>.
Address authorization, validation, transaction/concurrency/idempotency, audit,
side effects, and error behavior where applicable.

Run <checks/tests>. Report requirement -> rule -> use case -> code -> test mapping and
any remaining blocker. Do not expand scope to unrelated cleanup.
```

If a lifecycle matrix, actor, permission, or outcome is still open, use the analysis
template instead or explicitly resolve the relevant `P1-OD-*` decision in the task.

## 7. Review prompt

```markdown
Review <commit/diff/files> for <domain/use case>.

Read `AGENTS.md`, `docs/codex/REVIEW_GUIDE.md`, and the routed domain sources. Do not
modify code. Prioritize business-rule, authorization, organization isolation,
lifecycle, ownership, history, transaction/concurrency, idempotency, side-effect,
error-contract, and test defects.

Report findings by severity with location, source ID, concrete scenario, impact,
recommendation, and verification. Treat unresolved policy as ambiguity rather than
inventing the expected rule.
```

## 8. Permission/security prompt

```markdown
Analyze/implement <protected action> for <actor> in <organization/platform scope>.

Read Actors, Permissions, applicable `BR-AUTH-*`/`BR-ORG-*`, the domain lifecycle,
and the use case. Specify authentication, active membership, role, `PERM-*`, resource
organization, ownership/assignment, state, and business preconditions.

Include negative cases for wrong organization, unassigned actor, guessed resource ID,
client-supplied ownership, and invalid state. Enforce the approved fixed multi-role,
role-derived permission model and the prohibition on Platform Admin tenant-content
access; do not infer policy for still-open authority decisions.
```

## 9. Lifecycle prompt

```markdown
Define/analyze <domain> operation <name>.

Use the relevant lifecycle document and `UC-*`/`BR-*` sources. Identify actor,
permission, allowed source states, target state, preconditions, history, audit,
notifications, concurrency, idempotency, and failure cases.

Do not infer missing transitions. If the matrix is unresolved, produce the exact
decision questions and map them to existing `P1-OD-*` IDs without implementing.
```

## 10. Database or migration prompt

```markdown
Plan/implement the persistence change required by <approved use case/rules>.

Read the owning-domain sources, approved architecture/ADR, current schema/migrations,
and Implementation Guide. Address existing data, nullability/defaults, constraints,
indexes justified by access patterns, concurrency, transaction scope, compatibility,
deployment order, and rollback/forward recovery.

Do not move service boundaries or delete legacy structures without an approved
migration map and phase authority.
```

## 11. Ambiguity-resolution prompt

```markdown
Resolve <P1-OD-ID> for <domain/use cases>.

Compare explicit options and their effects on actors, permissions, lifecycle,
ownership, history, audit, notifications, concurrency, API/data contracts, and tests.
Do not select an option unless the authorized decision maker supplies or approves it.
Record the chosen decision in the owning product document, update affected rules/use
cases/traceability, and preserve stable IDs.
```

## 12. Prompt anti-patterns

Avoid prompts such as:

- “Implement the whole recruitment flow” without use cases, actors, or approved
  lifecycle decisions.
- “Follow the code as the source of truth” when intended business behavior is under
  review.
- “Give admins full access” without identifying Platform Admin versus Organization
  Admin and resource scope.
- “Update status” without a named lifecycle operation and source-state policy.
- “Use best practices” as a substitute for approved architecture or a concrete
  acceptance criterion.
- “Fix anything you notice” during a scoped task.
- “Assume reasonable defaults” for an existing `P1-OD-*` decision.
- “All tests pass” unless the prompt requests commands and the agent reports actual
  results.

## 13. Prompt acceptance checklist

Before submitting a non-trivial implementation prompt, confirm:

- the task has one observable objective;
- domain and owning resource are named;
- authority/status is explicit;
- relevant IDs are supplied or discoverable;
- actor and scope are answerable;
- lifecycle behavior is approved rather than inferred;
- open decisions are resolved or excluded;
- allowed changes and non-goals are bounded;
- validation is proportionate to risk;
- the requested report includes traceability and blockers.

