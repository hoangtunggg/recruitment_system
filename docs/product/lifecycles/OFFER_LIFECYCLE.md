# Offer Lifecycle

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Owning domain:** Offer  
**Source:** `AGENTS.md` §§14-15, 18, 33, 36, 41

## 1. Statuses

- `DRAFT`
- `PENDING_APPROVAL`
- `APPROVED`
- `REJECTED`
- `SENT`
- `ACCEPTED`
- `DECLINED`
- `EXPIRED`
- `WITHDRAWN`

## 2. Transition status

The current source defines status names and action-oriented examples but does not
define a complete transition matrix. P1 does not infer one. Candidate business actions
requiring approval include:

- create offer draft;
- submit offer for approval;
- approve offer;
- reject offer;
- send offer;
- accept offer;
- decline offer;
- expire offer;
- withdraw offer.

### Proposed matrix for manual approval

The following is a complete proposal only. It becomes authoritative only after
`P1-OD-057`–`066` and the linked approval/hiring/headcount decisions are approved.

| From | Named operation | To | Decision dependencies |
|---|---|---|---|
| New | Create offer draft | `DRAFT` | `P1-OD-057`, `060` |
| `DRAFT` | Submit for required approval | `PENDING_APPROVAL` | `P1-OD-057`, `058`; approval baseline `001`, `022` approved |
| `DRAFT` | Submit where a configurable approval step is validly disabled | `APPROVED` | `P1-OD-057`, `058`; separately documented path, not a generic bypass |
| `PENDING_APPROVAL` | Approve offer | `APPROVED` | `P1-OD-057`, `058`; configured non-creator approver baseline approved |
| `PENDING_APPROVAL` | Reject approval | `REJECTED` | `P1-OD-057`–`059`; configured non-creator approver baseline approved |
| `REJECTED` | Revise as a new version | `DRAFT` | `P1-OD-059`, `060` |
| `APPROVED` | Send offer and reserve headcount | `SENT` | `P1-OD-057`, `060`, `061`, `065`, `066` |
| `SENT` | Candidate accepts | `ACCEPTED` | `P1-OD-002`, `057`, `063`–`065` |
| `SENT` | Candidate declines | `DECLINED` | `P1-OD-057`, `063`, `065`, `066` |
| `SENT` | Expire at approved deadline | `EXPIRED` | `P1-OD-057`, `061`, `065`, `066` |
| `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `SENT` | Withdraw with required authority/reason | `WITHDRAWN` | `P1-OD-057`, `062`, `065`, `066` |

No reversal from `ACCEPTED`, `DECLINED`, `EXPIRED`, or `WITHDRAWN` is proposed.
Confirmed hiring is a separate cross-domain operation after `ACCEPTED`; it does not
add another Offer status. `P1-OD-024` prohibits generic reopen, force-status,
reversal, and Platform Admin lifecycle bypass.

## 3. Known invariants

| Rule ID | Invariant |
|---|---|
| `BR-OFF-002` | A `SENT` offer is not an `ACCEPTED` offer. |
| `BR-OFF-003` | Hiring completion follows separately approved rules. |
| `BR-AUTH-005` | Candidate response requires ownership, scope, permission, and valid resource state. |
| `BR-OFF-004` | Every transition validates state, operation, actor, permissions, and applicable rules. |
| `BR-OFF-005` | Retryable Offer operations must not silently create duplicate outcomes. |
| `BR-AUD-002` | Sensitive Offer actions are evaluated for audit requirements. |

### Approved Role/Tenant authorization baseline

Each Offer belongs to one Organization and assigned recruitment flow. Recruiter and
Hiring Manager access follows assignment unless an explicit role-derived
organization-wide permission applies. Organization Admin requires an additional
recruitment role, and Platform Admin cannot view Offer content. See `BR-AUTH-012` and
`BR-ORG-005`, `BR-ORG-007`, `BR-ORG-008`.

## 4. Approved transition matrix

| From | Action → To | Actor / authority | Preconditions | Audit / invalid behavior |
|---|---|---|---|---|
| New | Create → `DRAFT` | Assigned Recruiter, `PERM-OFF-CREATE` | Application `OFFER_PENDING` | Audit creation |
| `DRAFT` | Submit → `PENDING_APPROVAL` | Assigned Recruiter | Default approval requirement | Audit |
| `PENDING_APPROVAL` | Approve → `APPROVED` | Configured non-creator approver | Supported configured approval path satisfied | Audit; reject self-approval |
| `PENDING_APPROVAL` | Reject → `REJECTED` | Configured non-creator approver | Approval pending | Audit; revise only as new version |
| `REJECTED` | Revise new version → `DRAFT` | Assigned Recruiter | Preserve rejected version/history | Audit |
| `APPROVED` | Send → `SENT` | Assigned Recruiter | Immutable approved version; 14-day expiry instant/time zone | Audit; no headcount reservation |
| `SENT` | Accept → `ACCEPTED` | Own Candidate | Unexpired own Offer; idempotency | Audit; initiate confirm-hire only |
| `SENT` | Decline → `DECLINED` | Own Candidate | Own unexpired Offer | Audit; terminal |
| `SENT` | Expire → `EXPIRED` | System | 14-day expiry reached | Idempotent audit; terminal |
| `DRAFT/PENDING_APPROVAL/APPROVED/SENT` before acceptance | Withdraw → `WITHDRAWN` | Assigned authorized Recruiter | Required reason; post-acceptance rescission excluded | Audit; terminal |

Material edits create a new version and reset approval; sent Offers require
withdrawal/replacement. An authorized extension before expiry is audited; it creates a
new version/reapproval. `ACCEPTED` remains terminal in Offer and permits one idempotent
confirm-hire operation. That operation atomically verifies `filled < requested`, sets
Application `HIRED`, and increments filled count; no reservation exists at `OFFERED`.
Invalid transition, self-approval, duplicate hire, over-hire, generic reversal, and
Platform Admin bypass are rejected.

## 5. Resolved lifecycle decisions

| ID | Decision needed |
|---|---|
| P1-OD-057 | Exact allowed transitions between Offer statuses |
| P1-OD-058 | When offer approval is required and who may approve/reject |
| P1-OD-059 | Whether rejected offers can be revised and resubmitted |
| P1-OD-060 | Offer versioning after approval or sending |
| P1-OD-061 | Expiration calculation, extensions, reminders, and time-zone behavior |
| P1-OD-062 | Who may withdraw an offer and in which states |
| P1-OD-063 | Whether a candidate can reverse acceptance/decline |
| P1-OD-064 | Exact hiring-completion operation following acceptance |
| P1-OD-065 | Headcount reservation and concurrent acceptance behavior |
| P1-OD-066 | Required notifications and failure/retry expectations |

Resolved by `P1-OD-002`, `020`, `021`, `057`–`065`; see
[`P1_APPROVAL_DECISIONS.md`](../P1_APPROVAL_DECISIONS.md).

