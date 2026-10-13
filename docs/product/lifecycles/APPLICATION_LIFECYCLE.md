# Application Lifecycle

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Owning domain:** Application  
**Source:** `AGENTS.md` §§12, 15-18, 41

## 1. Statuses

- `APPLIED`
- `SCREENING`
- `SHORTLISTED`
- `INTERVIEWING`
- `OFFER_PENDING`
- `OFFERED`
- `HIRED`
- `REJECTED`
- `WITHDRAWN`

## 2. Defined business operations

The source defines the following operation names and resulting business intent, but it
does not fully define the allowed source statuses. Those source-state decisions remain
open and must not be inferred during implementation.

| Operation | Intended result/status | Allowed source statuses |
|---|---|---|
| Submit application | Create application in `APPLIED` | New application only; duplicate policy unresolved |
| Start screening | Move toward `SCREENING` | Not yet defined |
| Shortlist | Move toward `SHORTLISTED` | Not yet defined |
| Start interview | Move toward `INTERVIEWING` | Not yet defined |
| Move to offer | Move toward `OFFER_PENDING` or `OFFERED` depending on approved offer coordination | Not yet defined |
| Reject | Move to `REJECTED` | Not yet defined |
| Withdraw | Move to `WITHDRAWN` | Not yet defined |
| Mark hired | Move to `HIRED` | Not yet defined; depends on Offer rules |

### Proposed matrix for manual approval

The matrix below is complete as a proposal only. It becomes authoritative only when
`P1-OD-038`–`047` and the linked Offer/hiring decisions are approved.

| From | Named operation/event coordination | To | Decision dependencies |
|---|---|---|---|
| New | Submit application | `APPLIED` | `P1-OD-017`, `039`, `046`, `047` |
| `APPLIED` | Start screening | `SCREENING` | `P1-OD-038`, `042` |
| `SCREENING` | Shortlist | `SHORTLISTED` | `P1-OD-038`, `042` |
| `SHORTLISTED` | Start interview stage | `INTERVIEWING` | `P1-OD-038`, `043` |
| `INTERVIEWING` | Move to offer preparation | `OFFER_PENDING` | `P1-OD-038`, `043`, `044` |
| `OFFER_PENDING` | Record that approved Offer was sent | `OFFERED` | `P1-OD-020`, `021`, `044`, `057` |
| `OFFERED` | Confirm hire after accepted Offer | `HIRED` | `P1-OD-002`, `018`, `045`, `064`, `065` |
| `APPLIED`, `SCREENING`, `SHORTLISTED`, `INTERVIEWING`, `OFFER_PENDING` | Reject application | `REJECTED` | `P1-OD-038`, `041`, `042` |
| `OFFERED` | Close after Offer declined, expired, or withdrawn | `REJECTED` with preserved Offer-outcome reason | `P1-OD-020`, `038`, `041`, `057`, `062`–`063` |
| `APPLIED`, `SCREENING`, `SHORTLISTED`, `INTERVIEWING`, `OFFER_PENDING`, `OFFERED` | Candidate withdraws before Offer acceptance | `WITHDRAWN` | `P1-OD-038`, `040`, `063` |

No transition out of `HIRED`, `REJECTED`, or `WITHDRAWN` is permitted. Initial scope
does not allow reapplication to the same Job; terminal history is not rewritten.

`P1-OD-024` prohibits generic reopen, force-status, terminal-state reversal, and
Platform Admin lifecycle bypass. A correction requires a separately approved audited
use case with an explicit transition.

## 3. Known invariants

| Rule ID | Invariant |
|---|---|
| `BR-APP-001`, `BR-APP-002` | Application is a first-class domain and owns its lifecycle/history. |
| `BR-APP-003`, `BR-APP-005`, `BR-APP-009` | State changes use authorized named operations and are not controlled directly by the frontend. |
| `BR-APP-004` | Concurrent duplicate active applications are prevented; duplicate scope remains `P1-OD-039`. |
| `BR-APP-007` | A Candidate cannot access another candidate's private application data. |
| `BR-CAN-003` through `BR-CAN-005`, `BR-APP-006` | Submitted resume/profile history remains stable after later Candidate changes. |
| `BR-JOB-003` | Job state must permit submission; `CLOSED` and `ARCHIVED` reject new applications. |
| `BR-APP-008` | Application must not directly manipulate private Interview persistence. |

### Approved Role/Tenant authorization baseline

Candidate authority is independent of staff Organization Membership and remains
self-scoped. Each private Application belongs to one Organization. Recruiter/Hiring
Manager review is assignment-scoped through the recruitment flow unless an explicit
role-derived organization-wide permission applies. Organization Admin requires an
additional recruitment role, Interviewer receives only assigned minimum context, and
Platform Admin has no Application/CV/internal-note access. See `BR-AUTH-008`,
`BR-AUTH-012`, and `BR-ORG-005`, `BR-ORG-007`, `BR-ORG-008`.

## 4. Approved transition matrix

| From | Action → To | Actor / authority | Preconditions | Audit / invalid behavior |
|---|---|---|---|---|
| New | Submit → `APPLIED` | Candidate, `PERM-APP-SUBMIT` | Own Candidate; Job `OPEN`; unique Candidate+Job; stable snapshot | Idempotency key; reject duplicate/race |
| `APPLIED` | Screen → `SCREENING` | Assigned Recruiter | Assignment/scope | Audit decision |
| `SCREENING` | Shortlist → `SHORTLISTED` | Assigned Recruiter; Hiring Manager participation if configured | Required collaboration complete | Audit |
| `SHORTLISTED` | Start interview → `INTERVIEWING` | Authorized Application operation | Interview created through boundary | Audit; no direct Interview persistence write |
| `INTERVIEWING` | Prepare offer → `OFFER_PENDING` | Authorized Recruiter | Explicit Application decision after Interview readiness | Audit |
| `OFFER_PENDING` | Record sent approved Offer → `OFFERED` | Offer outcome coordination | Offer `SENT` | Audit |
| `OFFERED` | Confirm hire → `HIRED` | Idempotent authorized confirm-hire | Accepted Offer; atomic capacity check | Audit; reject duplicate/over-hire |
| Active non-offer-accepted states | Reject → `REJECTED` | Authorized Recruiter | Required reason code/notes | Audit actor/time/reason; terminal |
| `APPLIED` through `OFFERED` before acceptance | Withdraw → `WITHDRAWN` | Own Candidate | Own non-accepted Application | Audit; terminal |

Submitted snapshots contain resume version, recruitment identity/contact used, submitted
answers, consent/terms version, and submission time. `HIRED`, `REJECTED`, and
`WITHDRAWN` are terminal; initial scope never re-applies Candidate+Job. All invalid
transitions and frontend-supplied status values are rejected.

## 5. Resolved lifecycle decisions

| ID | Decision needed |
|---|---|
| P1-OD-038 | Exact source states for every Application operation |
| P1-OD-039 | Exact Candidate+Job uniqueness boundary, active-status set, and reapplication policy |
| P1-OD-040 | Withdrawal-allowed states and whether withdrawal can be reversed |
| P1-OD-041 | Rejection-reason requirements, visibility, and reversibility |
| P1-OD-042 | Whether screening/shortlisting decisions require one actor or collaboration |
| P1-OD-043 | Coordination between Interview completion and Application progression |
| P1-OD-044 | Meaning and sequencing of `OFFER_PENDING` versus `OFFERED` |
| P1-OD-045 | Whether `HIRED` occurs on Offer acceptance or a separate hiring action |
| P1-OD-046 | Mandatory fields in the Application snapshot |
| P1-OD-047 | Idempotency and concurrency behavior for submission and transitions |

Resolved by `P1-OD-017`, `018`, `038`–`047`; see
[`P1_APPROVAL_DECISIONS.md`](../P1_APPROVAL_DECISIONS.md).

