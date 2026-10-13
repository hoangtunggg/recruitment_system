# Codex Review Guide

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Document class:** operational guidance; does not approve DRAFT business policy

## 1. Review contract

When asked to review or audit, inspect and report findings before changing code. A
review request does not authorize fixes unless the user also asks for implementation.

Load the minimum context through [`AGENTS.md`](../../AGENTS.md), then compare the
change/current implementation with the highest-priority applicable source. Current
code proves current behavior, not intended business behavior. A DRAFT document can
support a risk or ambiguity finding but must not be presented as approved policy.

## 2. Evidence standard

Every finding must include:

- severity;
- precise file/location;
- violated requirement, rule, permission, use case, lifecycle, or architecture source
  when known;
- concrete failure scenario and affected actor/data;
- impact;
- focused remediation direction;
- validation or test that would demonstrate the fix.

Do not report speculative findings unsupported by repository evidence. If the result
depends on an unresolved `P1-OD-*` decision, classify it as an ambiguity/blocker rather
than asserting one preferred business policy.

## 3. Severity model

| Severity | Meaning |
|---|---|
| `CRITICAL` | Exploitable authorization/privacy breach, destructive historical-data loss, secret exposure, or systemic integrity failure with immediate material impact |
| `HIGH` | Business-rule bypass, cross-organization access, invalid terminal transition, serious race/transaction defect, or major contract break likely in normal operation |
| `MEDIUM` | Incorrect edge-case behavior, incomplete validation/error/audit handling, material maintainability risk, or missing tests for a meaningful failure path |
| `LOW` | Local clarity, consistency, bounded performance, or test-quality concern with limited immediate impact |

Severity follows impact and likelihood, not code style preference.

## 4. Review sequence

1. Confirm review scope, base/target, and changed files.
2. Classify affected domain(s), actor(s), use case(s), and rule IDs.
3. Load the routed product/technical sources and check their status.
4. Trace entry point → authorization → business operation → persistence → side
   effects → response/error → tests.
5. Test the implementation mentally against success and negative scenarios.
6. Inspect migrations, compatibility, and operational failure modes when present.
7. Report findings ordered by severity, then open questions and residual risk.
8. If no findings exist, say so and identify what remained unverified.

## 5. Business and domain checklist

- Is the operation attached to the correct stable `UC-*` and `BR-*` concepts?
- Is canonical terminology used?
- Does the owning domain control its data and lifecycle?
- Does any domain modify another domain's private persistence directly?
- Is Application kept as a first-class domain rather than hidden in Job/Candidate?
- Can Candidate profile/resume changes alter historical Application context?
- Does Communication deliver a decision already made by a business domain rather
  than making the decision?
- Are business-significant history and terminal outcomes preserved?
- Has a DRAFT/open decision been silently implemented as permanent policy?
- Has any unapproved AI/ML behavior or terminology been introduced?

## 6. Actor and authorization checklist

- Is `User` treated as identity rather than one global business role?
- Is organization authority derived from the correct active membership?
- Are platform-level and organization-level roles kept separate?
- Does the backend enforce authentication, permission, organization, ownership or
  assignment, resource state, and business preconditions?
- Can knowing/guessing a resource ID bypass scope?
- Can client-supplied actor, organization, owner, or role data override authenticated
  context?
- Can a Recruiter cross organization boundaries?
- Can a Candidate access another candidate's private data?
- Can an Interviewer access unassigned interviews or excess candidate context?
- Can Platform Admin view tenant recruitment content or bypass tenant authorization,
  contrary to approved `P1-OD-014`?

## 7. Lifecycle checklist

- Is the change a named action rather than unrestricted status assignment?
- Is the source state explicitly allowed by an approved matrix?
- Are actor, permission, state, and preconditions validated atomically enough for the
  operation?
- Are terminal/invalid/repeated transitions rejected consistently?
- Are reason, snapshot, version, timestamp, and history requirements preserved?
- Are cross-domain results coordinated without direct private persistence mutation?
- Are completion concepts kept separate where required, such as Interview completion
  versus feedback completion and Offer sent versus accepted?

Only Job has a complete P1 transition matrix. Treat inferred transitions for
Recruitment Request, Application, Interview, or Offer as an ambiguity unless an
explicit higher-priority requirement supplies the missing policy.

## 8. Persistence and reliability checklist

- Can a check-then-write race violate uniqueness, headcount, state, or acceptance?
- Is the invariant protected with an appropriate database or atomic mechanism?
- Do multi-write business operations use a correctly scoped transaction?
- Can failure leave partial business state?
- Are remote calls incorrectly held inside a database transaction?
- Can a retry duplicate an application, offer outcome, notification, event, or hire?
- Are external side-effect ordering, retries, and recovery explicit?
- Are schema changes safe for existing records and deployment order?
- Do queries have bounds, deterministic order, safe parameterization, and justified
  indexes?
- Is deleted/archived visibility consistent without destroying required history?

## 9. Contract, error, and observability checklist

- Does the API represent lifecycle intent clearly?
- Are request validation and reference checks applied at the backend boundary?
- Are success/error/status/pagination shapes consistent with the approved contract?
- Do known business failures use stable, meaningful errors?
- Are stack traces, secrets, tokens, and unnecessary personal data excluded?
- Are failures logged with enough actor/resource/correlation context for diagnosis?
- Are security- and business-critical actions evaluated for audit?
- Does the implementation avoid claiming atomicity across independent systems?

## 10. Test review checklist

Check whether tests cover the applicable cases:

- success;
- malformed or invalid input;
- missing resource;
- forbidden actor;
- wrong organization/ownership/assignment;
- invalid and terminal state;
- duplicate action and retry;
- rollback/partial failure;
- concurrency;
- idempotency;
- audit and notification effects;
- allowed and rejected lifecycle transitions.

Passing tests do not excuse an undocumented rule or missing authorization boundary.
Flag brittle assertions, false-positive mocks, unexercised persistence constraints,
and tests that merely reproduce implementation details.

## 11. Review output template

```markdown
## Findings

### [HIGH] Short title
- Location: `path/file.ts:line`
- Source: `BR-*`, `UC-*`, `PERM-*`, lifecycle/ADR reference
- Scenario: concrete actor/input/state sequence
- Impact: observable failure
- Recommendation: focused remediation
- Verification: test/check that proves resolution

## Ambiguities / blockers
- `P1-OD-*` or conflicting sources that prevent a definitive finding

## Residual validation gaps
- Commands, environments, or behavior not verified
```

If there are no findings, lead with that outcome, then list residual risks and tests
not run. Do not pad the review with non-actionable style preferences.

