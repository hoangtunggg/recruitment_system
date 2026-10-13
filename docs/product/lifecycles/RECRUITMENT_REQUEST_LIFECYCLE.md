# Recruitment Request Lifecycle

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Owning domain:** Recruitment Planning  
**Source:** `AGENTS.md` §§9-10, 15

## 1. Known statuses

| Status | Minimum interpretation | Entry/exit criteria |
|---|---|---|
| `DRAFT` | Request is being prepared | Not yet defined |
| `PENDING_APPROVAL` | Request awaits an approval decision | Approval policy not yet defined |
| `APPROVED` | Required approval has been granted | Approver/quorum not yet defined |
| `REJECTED` | Approval was denied | Reason/revision rules not yet defined |
| `IN_RECRUITMENT` | Approved demand is actively being recruited | Relationship to Job not yet defined |
| `FILLED` | Requested hiring outcome has been satisfied | Headcount calculation not yet defined |
| `CLOSED` | Request is no longer active | Closure reasons/reopen rules not yet defined |
| `CANCELLED` | Request was explicitly cancelled | Allowed source states not yet defined |

The status names are defined by `AGENTS.md`. The interpretations above are descriptive,
not approval of missing transition criteria.

## 2. Transition status

The historical proposal below is retained for provenance. The authoritative matrix is
§5, approved by the P1-finalization task.

### Proposed matrix for manual approval

The following matrix is complete as an approval proposal, not as approved behavior.
It becomes authoritative only if `P1-OD-025`–`031` and the relevant approval-authority
decisions are explicitly approved.

| From | Named operation | To | Decision dependencies |
|---|---|---|---|
| New | Create request | `DRAFT` | `P1-OD-015` |
| `DRAFT` | Submit with approval required | `PENDING_APPROVAL` | `P1-OD-025`–`027`; approval baseline `001`, `022` approved |
| `DRAFT` | Submit where a configurable approval step is validly disabled | `APPROVED` | `P1-OD-025`–`027`; separately documented path, not a generic bypass |
| `PENDING_APPROVAL` | Approve | `APPROVED` | `P1-OD-025`–`027`; configured non-creator approver baseline approved |
| `PENDING_APPROVAL` | Reject | `REJECTED` | `P1-OD-025`–`027`; configured non-creator approver baseline approved |
| `REJECTED` | Revise rejected request | prohibited in final baseline | `P1-OD-028` approved A |
| `APPROVED` | Start recruitment / open first linked Job | `IN_RECRUITMENT` | `P1-OD-016`, `029` |
| `IN_RECRUITMENT` | Fulfill approved headcount | `FILLED` | `P1-OD-030`, `031`, `064`, `065` |
| `IN_RECRUITMENT` | Close before full fulfillment | `CLOSED` | `P1-OD-026`, `030`, `031` |
| `FILLED` | Close completed request | `CLOSED` | `P1-OD-026`, `031` |
| `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `IN_RECRUITMENT` | Cancel request | `CANCELLED` | `P1-OD-026`, `031` |

No transition out of `CLOSED` or `CANCELLED` is proposed. `P1-OD-024` prohibits
generic reopen, force-status, reversal, and Platform Admin lifecycle bypass; any
correction requires a separately specified audited operation.

Any later transition must be implemented as a named business operation and validate:

- current status;
- actor and organization membership;
- permission and resource scope;
- configured approval policy;
- requested headcount/business preconditions;
- audit requirement;
- notification effects;
- concurrency and idempotency.

## 3. Known invariants

| Rule ID | Invariant |
|---|---|
| `BR-REQ-001` | Recruitment Planning owns the request, approval, headcount, and lifecycle history. |
| `BR-REQ-002` | Status follows an approved state machine and is not assigned arbitrarily. |
| `BR-REQ-003` | Optional approval behavior is explicitly configured and documented. |
| `BR-REQ-004` | Every transition validates state, operation, actor, permissions, and applicable rules. |

### Approved Role/Tenant authorization baseline

Each Recruitment Request belongs to one Organization. Hiring Manager and Recruiter
access is assignment-scoped unless their fixed role carries an explicit
organization-wide recruitment permission. Organization Admin has no Request content
access without an additional business role; Platform Admin has none. See
`BR-ORG-005`, `BR-ORG-007`, and `BR-ORG-008`.

## 4. Open lifecycle decisions

| ID | Decision needed |
|---|---|
| P1-OD-025 | Exact allowed transitions between all Recruitment Request statuses |
| P1-OD-026 | Who may submit, approve, reject, cancel, close, or reopen a request |
| P1-OD-027 | Single approver versus multi-step/quorum approval behavior |
| P1-OD-028 | Whether a rejected request can return to DRAFT |
| P1-OD-029 | Relationship between approved request, job creation, and `IN_RECRUITMENT` |
| P1-OD-030 | Headcount allocation, decrement, fill, over-hire, and concurrency behavior |
| P1-OD-031 | Difference between `FILLED`, `CLOSED`, and `CANCELLED` for reporting/history |

## 5. Approved transition matrix

| From | Action → To | Actor / permission | Preconditions | Audit / invalid behavior |
|---|---|---|---|---|
| New | Create → `DRAFT` | Hiring Manager, `PERM-REQ-CREATE` | Organization scope | Record creation; reject any supplied status |
| `DRAFT` | Submit → `PENDING_APPROVAL` | Request owner; assigned Recruiter may assist but not approve | Default-enabled policy requires approval | Audit; reject invalid state/configuration |
| `PENDING_APPROVAL` | Approve → `APPROVED` | Configured non-creator approver, `PERM-REQ-APPROVE` | Supported sequential approval steps satisfied | Audit approval; reject self/invalid transition |
| `PENDING_APPROVAL` | Reject → `REJECTED` | Configured non-creator approver, `PERM-REQ-REJECT` | Approval pending | Audit reason; terminal |
| `APPROVED` | Open first valid linked Job → `IN_RECRUITMENT` | Authorized Recruiter, `PERM-JOB-MANAGE` | Linked Request, valid Job, cross-domain coordination | Audit both operations; reject direct status mutation |
| `IN_RECRUITMENT` | Confirm valid hires meet headcount → `FILLED` | Confirm-hire coordination | `filled == requested`; atomic invariant | Audit; reject `filled > requested` |
| `IN_RECRUITMENT` or `FILLED` | Close → `CLOSED` | Assigned authorized Hiring Manager/Recruiter | Business closure | Audit; terminal |
| `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `IN_RECRUITMENT` | Cancel → `CANCELLED` | Assigned authorized Hiring Manager/Recruiter | Demand withdrawn | Audit reason; terminal |

`REJECTED`, `CANCELLED`, and `CLOSED` are terminal. `APPROVED` is not itself
`IN_RECRUITMENT`; rejection, generic reopen, force-status, and reversal are rejected
by the backend.

