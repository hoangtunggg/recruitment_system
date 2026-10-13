# Interview Lifecycle

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Owning domain:** Interview  
**Source:** `AGENTS.md` §§13, 15, 18

## 1. Statuses

- `DRAFT`
- `SCHEDULED`
- `CONFIRMED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `NO_SHOW`

## 2. Transition status

The current source defines status names but not an allowed transition matrix. P1 does
not infer one. The following business actions are implied by the actor capabilities and
status vocabulary, but their source states and permissions require approval:

- create interview draft;
- schedule interview;
- confirm interview;
- start interview;
- complete interview;
- cancel interview;
- mark no-show;
- assign or replace interviewers;
- submit feedback;
- submit scorecard.

### Proposed matrix for manual approval

The following is a complete proposal only. It becomes authoritative only after
`P1-OD-048`–`056` and relevant permission decisions are approved.

| From | Named operation | To | Decision dependencies |
|---|---|---|---|
| New | Create interview draft | `DRAFT` | `P1-OD-048`, `049`, `051` |
| `DRAFT` | Schedule interview | `SCHEDULED` | `P1-OD-048`–`051`, `056` |
| `SCHEDULED` | Satisfy required participant confirmation | `CONFIRMED` | `P1-OD-048`–`050` |
| `SCHEDULED` | Start when confirmation is not required or is validly waived | `IN_PROGRESS` | `P1-OD-048`–`050` |
| `CONFIRMED` | Start interview | `IN_PROGRESS` | `P1-OD-048`, `049` |
| `IN_PROGRESS` | Complete interview session | `COMPLETED` | `P1-OD-048`, `049`, `052`–`055` |
| `DRAFT`, `SCHEDULED`, `CONFIRMED` | Cancel interview | `CANCELLED` | `P1-OD-048`–`050`, `056` |
| `SCHEDULED`, `CONFIRMED` | Mark required participant no-show | `NO_SHOW` | `P1-OD-048`, `049` |
| `SCHEDULED`, `CONFIRMED` | Reschedule with retained history | `SCHEDULED` | `P1-OD-050`, `056` |

Feedback and scorecard submission do not change Interview lifecycle status. Their
readiness/lock state follows `P1-OD-052`–`054`. No transition out of `COMPLETED`,
`CANCELLED`, or `NO_SHOW` is proposed.

## 3. Known invariants

`P1-OD-024` prohibits generic reopen, force-status, terminal-state reversal, and
Platform Admin lifecycle bypass. A correction requires a separately approved audited
use case with an explicit transition.

| Rule ID | Invariant |
|---|---|
| `BR-INT-001` | Interview owns scheduling, rounds, assignments, feedback, scorecards, and lifecycle. |
| `BR-INT-002`, `BR-INT-003` | Interviewer access is assignment-limited and exposes only minimum required context. |
| `BR-INT-004`, `BR-INT-005` | Interview completion and feedback completion are separate; pending feedback requires an approved rule. |
| `BR-INT-006` | Interview does not directly modify Candidate profile records. |
| `BR-DOM-002`, `BR-APP-002` | Application progression uses an approved cross-domain operation rather than direct persistence mutation. |
| `BR-INT-007` | Every lifecycle transition validates state, operation, actor, permissions, and applicable rules. |

### Approved Role/Tenant authorization baseline

Each Interview belongs to one Organization and recruitment flow. Interviewer access
is limited to assigned Interview and minimum Candidate/Application context. Recruiter
and Hiring Manager access follows assignment unless a role-derived organization-wide
permission applies. Organization Admin needs an additional recruitment role;
Platform Admin has no Interview feedback/content access. See `BR-AUTH-012` and
`BR-ORG-005`, `BR-ORG-007`, `BR-ORG-008`.

## 4. Approved transition and feedback matrix

| From | Action → To | Actor / authority | Preconditions | Audit / invalid behavior |
|---|---|---|---|---|
| New | Create → `DRAFT` | Assigned Recruiter | Application is eligible | Audit creation |
| `DRAFT` | Schedule → `SCHEDULED` | Assigned Recruiter, `PERM-INT-SCHEDULE` | Instant + source time zone; conflict validation | Audit schedule; reject invalid time/scope |
| `SCHEDULED` | Confirm → `CONFIRMED` | Required participant | Confirmation required by configuration | Audit confirmation |
| `SCHEDULED/CONFIRMED` | Start → `IN_PROGRESS` | Assigned lead/Recruiter | Confirmation not required or satisfied | Audit |
| `IN_PROGRESS` | Complete → `COMPLETED` | Assigned lead/Recruiter | Session completed; feedback may remain pending | Audit; no Application state mutation |
| `DRAFT/SCHEDULED/CONFIRMED` | Cancel → `CANCELLED` | Assigned Recruiter | Authorized cancellation | Audit reason |
| `SCHEDULED/CONFIRMED` | Mark no-show → `NO_SHOW` | Assigned Recruiter | Required participant absent | Audit |
| `SCHEDULED/CONFIRMED` | Reschedule → `SCHEDULED` | Authorized scheduler | Candidate requests; history retained | Audit change |

Rounds are sequential by default; supported configured parallel rounds carry ordering/
group metadata. Feedback uses the initial platform-defined scorecard template, is
restricted to assigned scope, and locks at submission with no edit in initial scope.
Interview completion may precede required feedback, but Application progression waits
for required feedback/scorecards unless an authorized audited override exists. Outcome
never directly changes Application state. Invalid transitions and all generic reversal
requests are rejected.

## 5. Resolved lifecycle decisions

| ID | Decision needed |
|---|---|
| P1-OD-048 | Exact allowed transitions between Interview statuses |
| P1-OD-049 | Who may schedule, confirm, start, complete, cancel, or mark no-show |
| P1-OD-050 | Candidate confirmation/rescheduling behavior |
| P1-OD-051 | Interview round types, ordering, and parallel-round behavior |
| P1-OD-052 | Feedback due dates, edit/lock rules, and required completion threshold |
| P1-OD-053 | Scorecard criteria, scale, required fields, and visibility |
| P1-OD-054 | Whether completion is allowed with pending feedback and under which conditions |
| P1-OD-055 | How interview outcomes trigger or authorize Application transitions |
| P1-OD-056 | Time-zone, calendar, conflict, and notification requirements |

Resolved by `P1-OD-019`, `048`–`056`; see
[`P1_APPROVAL_DECISIONS.md`](../P1_APPROVAL_DECISIONS.md).

