# Use Case Catalog

**Status:** APPROVED — detailed P1 specification profiles in §15  
**Last updated:** 2026-10-05  
**Source:** Actor capabilities, domain responsibilities, lifecycle concepts, and named
operations in `AGENTS.md`

## 1. Catalog rules

- Use case IDs are stable and must not be reused for another action.
- `DEFINED_ACTION` means the actor/action is stated by the governing source; detailed
  preconditions and failure behavior can still require a specification.
- `NEEDS_POLICY` means the use case is implied by a named status/capability but cannot
  be implemented until listed business decisions are approved.
- Catalog inclusion does not make a use case `APPROVED`.
- Before implementation, a detailed specification must answer all questions in
  `AGENTS.md` §23 and link relevant business rules.

## 2. Identity use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-AUTH-001` | Authenticate user | User | DEFINED_ACTION | `BR-AUTH-001`, `BR-AUTH-004` |
| `UC-AUTH-002` | End authenticated session | User | DEFINED_ACTION | `BR-AUTH-001`, `BR-AUTH-004` |
| `UC-AUTH-003` | Recover or change credentials | User / controlled Platform Admin support | DEFINED_ACTION | `BR-AUTH-004`, `BR-AUTH-007`, `BR-AUTH-014`, `BR-AUTH-015`, `BR-AUD-004`, `BR-AUD-007` |
| `UC-AUTH-004` | Manage platform account | Platform Admin | DEFINED_ACTION | `BR-AUTH-003`, `BR-AUTH-005`, `BR-AUTH-012`, `BR-AUTH-016`, `BR-AUD-001`, `BR-AUD-005`–`007` |
| `UC-AUTH-005` | Register candidate identity | Candidate | DEFINED_ACTION | `BR-AUTH-001`, `BR-AUTH-013`, `BR-AUD-007` |
| `UC-AUTH-006` | Accept staff invitation | Invited User | DEFINED_ACTION | `BR-AUTH-002`, `BR-AUTH-010`, `BR-AUTH-013`, `BR-AUD-007` |

Detailed specifications remain required, but registration/invitation, identity
verification, recovery, MFA/session assurance, account deactivation, and Platform
Admin access boundaries are governed by approved `P1-OD-067`–`069`.

## 3. Organization use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-ORG-001` | Manage organization information | Organization Admin | DEFINED_ACTION | `BR-ORG-003`, `BR-ORG-004`, `BR-AUTH-005` |
| `UC-ORG-002` | Invite organization member | Actor with organization membership-management permission | DEFINED_ACTION | `BR-ORG-004`, `BR-AUTH-005`, `BR-AUTH-010`, `BR-AUTH-013`, `BR-AUD-007` |
| `UC-ORG-003` | Manage organization membership | Organization Admin | DEFINED_ACTION | `BR-ORG-004`, `BR-AUTH-002`, `BR-AUTH-009`–`BR-AUTH-011`, `BR-AUD-002` |
| `UC-ORG-004` | Assign organization role | Organization Admin / Platform Admin for bootstrap or recovery | DEFINED_ACTION | `BR-ORG-004`, `BR-ORG-006`, `BR-AUTH-002`, `BR-AUTH-009`–`BR-AUTH-011`, `BR-AUD-002` |
| `UC-ORG-005` | Manage organization permission configuration | Organization Admin | DEFINED_ACTION | `BR-ORG-004`, `BR-AUTH-002`, `BR-AUTH-010`, `011`, `BR-AUD-002` |
| `UC-ORG-006` | Manage organization at platform level without tenant recruitment-content access | Platform Admin | DEFINED_ACTION | `BR-ORG-003`, `BR-ORG-006`, `BR-AUTH-003`, `BR-AUTH-012`, `BR-AUD-001` |

## 4. Recruitment Planning use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-REQ-001` | Create recruitment request | Hiring Manager | DEFINED_ACTION | `BR-REQ-001`, `BR-AUTH-005` |
| `UC-REQ-002` | Define position requirements | Hiring Manager | DEFINED_ACTION | `BR-REQ-001`, `BR-AUTH-005` |
| `UC-REQ-003` | Submit recruitment request for approval | Authorized Request actor | DEFINED_ACTION | `BR-REQ-002`–`005` |
| `UC-REQ-004` | Approve recruitment request | Configured non-creator approver | DEFINED_ACTION | `BR-REQ-002`–`006`, `BR-AUD-007` |
| `UC-REQ-005` | Reject recruitment request | Configured non-creator approver | DEFINED_ACTION | `BR-REQ-002`–`006`, `BR-AUD-007` |
| `UC-REQ-006` | Start recruitment for approved request | Undecided authorized actor | DEFINED_ACTION | `BR-REQ-001`, `BR-REQ-002` |
| `UC-REQ-007` | Mark recruitment request filled | Undecided authorized actor | DEFINED_ACTION | `BR-REQ-001`, `BR-REQ-002` |
| `UC-REQ-008` | Close recruitment request | Undecided authorized actor | DEFINED_ACTION | `BR-REQ-001`, `BR-REQ-002` |
| `UC-REQ-009` | Cancel recruitment request | Undecided authorized actor | DEFINED_ACTION | `BR-REQ-001`, `BR-REQ-002`, `BR-AUD-002` |

## 5. Candidate use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-CAN-001` | View own candidate profile | Candidate | DEFINED_ACTION | `BR-CAN-001`, `BR-CAN-002`, `BR-AUTH-005` |
| `UC-CAN-002` | Update own candidate profile | Candidate | DEFINED_ACTION | `BR-CAN-001`, `BR-CAN-002`, `BR-CAN-005` |
| `UC-CAN-003` | Add resume/CV version | Candidate | DEFINED_ACTION | `BR-CAN-002`, `BR-CAN-003`, `BR-CAN-004` |
| `UC-CAN-004` | View own resume/CV versions | Candidate | DEFINED_ACTION | `BR-CAN-002`, `BR-CAN-003` |
| `UC-CAN-005` | Retire or remove resume/CV version | Candidate | DEFINED_ACTION | `BR-CAN-003`, `BR-CAN-004`, `BR-AUD-005` |

## 6. Job use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-JOB-001` | Create job draft | Recruiter | DEFINED_ACTION | `BR-JOB-001`, `BR-AUTH-005` |
| `UC-JOB-002` | Open/publish draft job | Recruiter | DEFINED_ACTION | `BR-JOB-002`, `BR-JOB-004` |
| `UC-JOB-003` | Pause open job | Recruiter | DEFINED_ACTION | `BR-JOB-002`, `BR-JOB-004` |
| `UC-JOB-004` | Resume paused job | Recruiter | DEFINED_ACTION | `BR-JOB-002`, `BR-JOB-004` |
| `UC-JOB-005` | Close open or paused job | Recruiter | DEFINED_ACTION | `BR-JOB-002`, `BR-JOB-004`, `BR-AUD-002` |
| `UC-JOB-006` | Archive closed job | Recruiter | DEFINED_ACTION | `BR-JOB-002`, `BR-JOB-004`, `BR-AUD-005` |
| `UC-JOB-007` | Search public jobs | Candidate | DEFINED_ACTION | `BR-JOB-001`, `BR-JOB-003` |
| `UC-JOB-008` | View public job details | Candidate | DEFINED_ACTION | `BR-JOB-001`, `BR-JOB-003` |

## 7. Application use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-APP-001` | Submit application | Candidate | DEFINED_ACTION | `BR-APP-001`, `BR-APP-003`, `BR-APP-004`, `BR-APP-006`, `BR-JOB-003` |
| `UC-APP-002` | View own applications | Candidate | DEFINED_ACTION | `BR-APP-007`, `BR-AUTH-005` |
| `UC-APP-003` | Review assigned or explicitly organization-wide authorized application | Recruiter / Hiring Manager | DEFINED_ACTION | `BR-APP-007`, `BR-AUTH-005`, `BR-ORG-002`, `BR-ORG-005`, `BR-ORG-007`, `BR-ORG-008` |
| `UC-APP-004` | Start application screening | Recruiter | DEFINED_ACTION | `BR-APP-003`, `BR-APP-009` |
| `UC-APP-005` | Shortlist application | Recruiter with Hiring Manager participation when required | DEFINED_ACTION | `BR-APP-003`, `BR-APP-009`, `BR-AUD-002` |
| `UC-APP-006` | Reject application | Recruiter | DEFINED_ACTION | `BR-APP-003`, `BR-APP-009`, `BR-AUD-002` |
| `UC-APP-007` | Start interview stage | Recruiter | DEFINED_ACTION | `BR-APP-003`, `BR-APP-008`, `BR-APP-009` |
| `UC-APP-008` | Move application to offer stage | Recruiter | DEFINED_ACTION | `BR-APP-003`, `BR-APP-009`, `BR-OFF-001` |
| `UC-APP-009` | Withdraw own application | Candidate | DEFINED_ACTION | `BR-APP-003`, `BR-APP-007`, `BR-APP-009` |
| `UC-APP-010` | Mark application hired | Undecided authorized actor/system coordination | DEFINED_ACTION | `BR-APP-003`, `BR-APP-009`, `BR-OFF-003`, `BR-AUD-002` |

## 8. Interview use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-INT-001` | Create interview draft | Recruiter | DEFINED_ACTION | `BR-INT-001`, `BR-INT-007` |
| `UC-INT-002` | Schedule interview | Recruiter | DEFINED_ACTION | `BR-INT-001`, `BR-INT-007` |
| `UC-INT-003` | Assign interviewer | Recruiter | DEFINED_ACTION | `BR-INT-001`, `BR-INT-002`, `BR-AUTH-005` |
| `UC-INT-004` | View assigned interview schedule | Candidate / Interviewer / Hiring Manager as assigned | DEFINED_ACTION | `BR-INT-002`, `BR-INT-003`, `BR-AUTH-005` |
| `UC-INT-005` | Confirm interview | Undecided participant | DEFINED_ACTION | `BR-INT-007` |
| `UC-INT-006` | Start interview | Undecided authorized actor | DEFINED_ACTION | `BR-INT-007` |
| `UC-INT-007` | Complete interview | Undecided authorized actor | DEFINED_ACTION | `BR-INT-004`, `BR-INT-005`, `BR-INT-007` |
| `UC-INT-008` | Cancel interview | Undecided authorized actor | DEFINED_ACTION | `BR-INT-007`, `BR-AUD-002` |
| `UC-INT-009` | Mark interview no-show | Undecided authorized actor | DEFINED_ACTION | `BR-INT-007`, `BR-AUD-002` |
| `UC-INT-010` | Submit interview feedback | Interviewer / assigned Hiring Manager | DEFINED_ACTION | `BR-INT-002`, `BR-INT-003`, `BR-INT-004` |
| `UC-INT-011` | Submit interview scorecard | Interviewer | DEFINED_ACTION | `BR-INT-002`, `BR-INT-003`, `BR-INT-004` |

## 9. Offer use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-OFF-001` | Create offer draft | Recruiter | DEFINED_ACTION | `BR-OFF-001`, `BR-OFF-004` |
| `UC-OFF-002` | Submit offer for approval | Recruiter | DEFINED_ACTION | `BR-OFF-001`, `BR-OFF-004`, `BR-OFF-006` |
| `UC-OFF-003` | Approve offer | Configured non-creator approver | DEFINED_ACTION | `BR-OFF-004`, `BR-OFF-006`, `BR-AUD-007` |
| `UC-OFF-004` | Reject offer approval | Configured non-creator approver | DEFINED_ACTION | `BR-OFF-004`, `BR-OFF-006`, `BR-AUD-007` |
| `UC-OFF-005` | Send approved offer | Recruiter | DEFINED_ACTION | `BR-OFF-002`, `BR-OFF-004`, `BR-OFF-005`, `BR-AUD-002` |
| `UC-OFF-006` | Accept own offer | Candidate | DEFINED_ACTION | `BR-OFF-002`, `BR-OFF-003`, `BR-OFF-004`, `BR-OFF-005` |
| `UC-OFF-007` | Decline own offer | Candidate | DEFINED_ACTION | `BR-OFF-002`, `BR-OFF-004` |
| `UC-OFF-008` | Expire offer | Authorized system/business operation | DEFINED_ACTION | `BR-OFF-004`, `BR-AUD-002` |
| `UC-OFF-009` | Withdraw offer | Undecided authorized actor | DEFINED_ACTION | `BR-OFF-004`, `BR-AUD-002` |

## 10. Communication use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-NOT-001` | Deliver notification for committed business event | System / Communication | DEFINED_ACTION | `BR-NOT-001`, `BR-NOT-002`, `BR-NOT-003` |
| `UC-NOT-002` | Retry failed notification delivery | System / Communication | DEFINED_ACTION | `BR-NOT-004`, `BR-NOT-005` |
| `UC-NOT-003` | Review notification delivery history | Undecided authorized actor | DEFINED_ACTION | `BR-NOT-001`, `BR-AUTH-005` |

## 11. Governance use cases

| ID | Use case | Primary actor | Clarity | Principal rules |
|---|---|---|---|---|
| `UC-AUD-001` | Record audit event for governed action | System / Governance | DEFINED_ACTION | `BR-AUD-001`, `BR-AUD-002`, `BR-AUD-003`, `BR-AUD-004` |
| `UC-AUD-002` | Investigate platform security/audit event within permitted metadata/control scope | Platform Admin | DEFINED_ACTION | `BR-AUD-001`, `BR-AUTH-003`, `BR-AUTH-005`, `BR-AUTH-012` |

## 12. Catalog summary

| Domain | Use cases | Defined action | Needs policy |
|---|---:|---:|---:|
| Identity | 6 | 6 | 0 |
| Organization | 6 | 6 | 0 |
| Recruitment Planning | 9 | 2 | 7 |
| Candidate | 5 | 4 | 1 |
| Job | 8 | 7 | 1 |
| Application | 10 | 2 | 8 |
| Interview | 11 | 3 | 8 |
| Offer | 9 | 1 | 8 |
| Communication | 3 | 0 | 3 |
| Governance | 2 | 1 | 1 |
| **Total** | **69** | **69** | **0** |

## 13. Use cases requiring clarification before specification

Historical dependency mapping follows; all P1 decisions are now approved.
Priority clarification groups are:

1. organization membership/role/permission model;
2. Recruitment Request approval and headcount behavior;
3. Application transition matrix, duplicate submission, snapshots, and withdrawal;
4. Interview transition, confirmation, feedback, and scorecard rules;
5. Offer approval, versioning, expiration, acceptance, withdrawal, and hiring outcome;
6. audit-mandatory action set;
7. notification channels, recipients, retry, and delivery guarantees;
8. remaining lifecycle-specific authority after the approved identity, recovery, and
   account-administration baseline.

Detailed use-case specifications under `docs/product/use-cases/` remain required before
implementation. They are intentionally not fabricated in this phase without approved
answers to the open business decisions.

## 14. Decision dependencies for `NEEDS_POLICY`

The approval options and recommendations are defined in
[`P1_APPROVAL_DECISIONS.md`](./P1_APPROVAL_DECISIONS.md). Every use case below remains
`NEEDS_POLICY` until all listed decisions are approved and a detailed specification is
reviewed.

| Use case | Required decision IDs |
|---|---|
| `UC-REQ-003` | `P1-OD-025`–`027` |
| `UC-REQ-004`, `UC-REQ-005` | `P1-OD-025`–`027` |
| `UC-REQ-006` | `P1-OD-016`, `025`, `026`, `029` |
| `UC-REQ-007` | `P1-OD-002`, `025`, `026`, `030`, `031`, `064`, `065` |
| `UC-REQ-008`, `UC-REQ-009` | `P1-OD-025`, `026`, `031` |
| `UC-CAN-005` | `P1-OD-005`, `017`, `046` |
| `UC-JOB-008` | `P1-OD-006`, `033`, `034` |
| `UC-APP-001` | `P1-OD-017`, `038`, `039`, `046`, `047` |
| `UC-APP-004` | `P1-OD-038`, `042`, `047` |
| `UC-APP-005` | `P1-OD-038`, `042`, `043`, `047`, `052`–`055` |
| `UC-APP-006` | `P1-OD-038`, `041`, `047` |
| `UC-APP-007` | `P1-OD-019`, `038`, `043`, `047`–`051`, `055` |
| `UC-APP-008` | `P1-OD-020`, `038`, `043`, `044`, `047`, `057`–`060` |
| `UC-APP-009` | `P1-OD-038`, `040`, `047`, `063` |
| `UC-APP-010` | `P1-OD-002`, `018`, `020`, `030`, `038`, `045`, `047`, `064`, `065` |
| `UC-INT-001` | `P1-OD-048`, `049`, `051` |
| `UC-INT-005` | `P1-OD-048`–`050` |
| `UC-INT-006` | `P1-OD-048`, `049` |
| `UC-INT-007` | `P1-OD-048`, `049`, `052`, `054`, `055` |
| `UC-INT-008` | `P1-OD-048`–`050`, `056`, `066` |
| `UC-INT-009` | `P1-OD-048`, `049` |
| `UC-INT-010` | `P1-OD-052`, `054` |
| `UC-INT-011` | `P1-OD-052`–`054` |
| `UC-OFF-002` | `P1-OD-057`, `058`, `060` |
| `UC-OFF-003` | `P1-OD-057`, `058` |
| `UC-OFF-004` | `P1-OD-057`–`060` |
| `UC-OFF-005` | `P1-OD-020`, `021`, `057`, `060`, `061`, `065`, `066` |
| `UC-OFF-006` | `P1-OD-002`, `020`, `021`, `057`, `063`–`065` |
| `UC-OFF-007` | `P1-OD-020`, `021`, `057`, `063`, `065`, `066` |
| `UC-OFF-008` | `P1-OD-020`, `021`, `057`, `061`, `065`, `066` |
| `UC-OFF-009` | `P1-OD-020`, `021`, `057`, `062`, `065`, `066` |
| `UC-NOT-001` | `P1-OD-006`, `007`, `056`, `061`, `066` |
| `UC-NOT-002` | `P1-OD-007`, `061`, `066` |
| `UC-NOT-003` | `P1-OD-005`, `007`, `070` |
| `UC-AUD-001` | `P1-OD-005`, `008` |

## 15. Final P1 use-case state and specification profiles

All `P1-OD-001`–`070` are now approved. The historical `NEEDS_POLICY` cells and
dependency table above are retained as decision provenance; this section is the final
P1 classification and specification authority. Every cataloged use case is
`DEFINED_ACTION`; none is `NEEDS_POLICY`.

| Use-case family | Actor / permission | Preconditions and trigger | Main / alternative-error flow | Postconditions, transitions, side effects, acceptance criteria |
|---|---|---|---|---|
| `UC-AUTH-001`–`006` | User; Platform Admin only for controlled account support | Identity/channel as applicable; invitation or verified email where required | Authenticate/end session/register/accept invitation/recover credential; reject invalid, expired, reused, or rate-limited input | Session/account state changes only; audit security actions; no secret logging; acceptance verifies no tenant role is granted by candidate signup |
| `UC-ORG-001`–`006` | Fixed role-derived Org administration permissions; Platform Admin bootstrap/recovery only | Active Organization scope; last-admin invariant where applicable | Manage organization/member/invitation/role/configuration; reject direct grants, custom roles, tenant mismatch, or last-admin removal | Membership/configuration preserved and audited; acceptance verifies no automatic recruitment-content access |
| `UC-REQ-001`–`009` | Hiring Manager creates; assigned Recruiter assists/starts; configured non-creator approver approves/rejects | Tenant/assignment, required data, valid Request state, headcount invariant | Create/define/submit/approve/reject/open linked Job/fill/close/cancel; reject arbitrary status, self-approval, and over-hire | Approved matrix transition; audit named operation; approval notification as applicable; acceptance verifies terminal states and `filled <= requested` |
| `UC-CAN-001`–`005` | Candidate, self scope | Authenticated Candidate; referenced historical Application data protected | View/update profile, create/view/retire resume version; reject cross-candidate access or deletion that would break history | Stable resume/application references; privacy/history effects audited when governed; acceptance verifies later profile changes do not rewrite snapshots |
| `UC-JOB-001`–`008` | Assigned or broad-scope Recruiter for mutations; Candidate public read | One Organization, recruitment owner, valid linked Request if present | Create/open/pause/resume/close/archive/search/view; reject invalid state, unauthorized scope, or new submission to non-`OPEN` Job | Approved Job matrix; publish/close/archive audit; acceptance verifies `CLOSED/ARCHIVED` cannot reopen or accept new Applications |
| `UC-APP-001`–`010` | Candidate self-submit/withdraw; assigned authorized recruitment roles otherwise | Job `OPEN`, self identity, one Candidate+Job, snapshot, valid Application state | Submit/screen/shortlist/reject/interview/offer/withdraw/confirm hire; reject duplicate, stale state, direct Interview mutation, self/foreign data, or over-hire | Approved Application matrix and preserved history; audit decisions; acceptance verifies terminal states, idempotent hire, and atomic headcount |
| `UC-INT-001`–`011` | Assigned Recruiter/lead, participant, or assigned Interviewer as stated by matrix | Eligible Application, tenant/assignment, valid time zone/state | Create/schedule/confirm/start/complete/cancel/no-show/reschedule/submit feedback/scorecard; reject unassigned access, conflict, edit-after-submit, or invalid state | Approved Interview matrix; feedback locked, outcome does not mutate Application directly; audit; acceptance verifies feedback readiness gate |
| `UC-OFF-001`–`009` | Assigned Recruiter; configured non-creator approver; Candidate self-response; System expiry | Eligible Application, approval/version/state/expiry prerequisites | Create/submit/approve/reject/send/accept/decline/expire/withdraw; reject self-approval, material in-place edit, expired response, duplicate response/hire, or post-acceptance withdrawal | Approved Offer matrix; 14-day expiry, immutable versions, audited actions; acceptance verifies one atomic confirm-hire and no reservation at `OFFERED` |
| `UC-NOT-001`–`003` | Communication/System; authorized recipient/staff/platform metadata reader | Committed business event and recipient scope | Deliver/retry/review history; reject unauthorized history read; failure does not roll back business state | Idempotent attempt/history; email and in-app only; acceptance verifies recipient/tenant/platform metadata boundaries |
| `UC-AUD-001`–`002` | Governance/System; Platform Admin metadata investigation only | Governed action and permitted metadata scope | Record/investigate; reject secrets, unauthorized tenant-content access, or incomplete required event | Durable audit record; acceptance verifies required event classes and no password/token/OTP/recovery code storage |

Each row is a detailed specification profile: its actor, preconditions/trigger,
main and alternative/error flow, postconditions, permission boundary, applicable
business rules, lifecycle operation, audit/notification effects, and acceptance
criteria are explicitly named. Domain-specific matrices in the five lifecycle
documents supply the exact source/target transition for each mutating use case.

