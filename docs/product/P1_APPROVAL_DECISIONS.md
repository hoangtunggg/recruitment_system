# P1 Approval Decision Register

**Status:** APPROVED — `P1-OD-005` external legal parameters pending  
**Last updated:** 2026-10-05  
**Decision authority:** Product Owner and Security/Privacy Owner as indicated  
**Closure state:** 70 of 70 decisions approved; `P1-OD-005` is `EXTERNAL_POLICY_PENDING` for legal parameters

## 1. How to use this register

This register consolidates every existing `P1-OD-*` ambiguity and adds
`P1-OD-067`–`070` for `NEEDS_POLICY` use cases that previously had no explicit
decision record. Options and recommendations are proposals, not approved policy.

A decision closes only when an authorized owner records:

- the selected option or an explicit replacement;
- any required parameters or exceptions;
- approver and approval date;
- affected document updates.

Until then an undecided row remains `PROPOSED`, affected policy remains `DRAFT`, and
affected use cases remain `NEEDS_POLICY`.

Suggested response format:

```text
Approve recommended baseline except:
P1-OD-010 = B, with <details>
P1-OD-027 = A, with <details>
...
```

## 2. Role composition and organization/tenant scope

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-003` | A: Candidate profile is independent of organization membership and the same User may also hold staff memberships. B: Candidate is an organization membership role. | **A**; preserves candidate self-ownership and multi-organization applications without conflating staff authority. | Determines identity cardinality, privacy boundary, and account linking. | `BR-AUTH-001`–`003`, `BR-CAN-001`, `002`; `UC-CAN-*`, `UC-AUTH-*` | APPROVED — A |
| `P1-OD-004` | A: strict logical tenant isolation; each private recruitment resource belongs to exactly one Organization. B: organization hierarchy/shared resources are supported. | **A** for initial scope; shared access requires a later explicit model. | Establishes tenant key, isolation checks, and sharing expectations. | `BR-AUTH-005`, `006`, `BR-ORG-001`, `002`; all organization-scoped use cases | APPROVED — A |
| `P1-OD-009` | A: one role per membership. B: multiple roles per membership with unioned permissions subject to scope. | **B**; real participants commonly combine Recruiter, Hiring Manager, or Interviewer responsibilities. | Simplifies staffing but requires conflict/least-privilege handling. | `BR-AUTH-002`; `UC-ORG-003`–`005` | APPROVED — B |
| `P1-OD-010` | A: fixed platform-defined organization roles. B: customizable roles composed from stable permissions. | **A** initially; defer custom roles until governance and migration requirements exist. | Lower administration complexity; less tenant flexibility. | `BR-AUTH-002`, `BR-ORG-004`; `UC-ORG-004`, `005` | APPROVED — A |
| `P1-OD-011` | A: permissions only through roles. B: direct membership grants/denials are also allowed. | **A**; avoids opaque per-user authorization drift. | Easier audit and support; exceptional access needs a governed role. | `BR-AUTH-002`, `005`, `BR-ORG-004`; `UC-ORG-004`, `005` | APPROVED — A |
| `P1-OD-012` | A: Organization Admin may assign every organization role including Organization Admin without additional safeguards. B: Organization Admin manages non-admin roles and existing admins may add/remove admins with last-admin protection; Platform Admin is limited to bootstrap/recovery. | **B**, with first-admin bootstrap, atomic last-admin replacement, and full privileged-change audit. | Reduces privilege-escalation/lockout risk while retaining tenant self-administration and recovery. | `BR-ORG-003`, `004`, `BR-AUD-001`; `UC-ORG-004`, `UC-ORG-006` | APPROVED — B |
| `P1-OD-013` | A: Recruiter/Hiring Manager access is organization-wide. B: assignment-scoped by default with explicit permission for wider organization scope. | **B**; least privilege while allowing separately governed broad access. | Requires assignment ownership and possibly separate broad-scope permissions. | `BR-AUTH-005`, `BR-ORG-001`, `002`; `UC-APP-003`–`008`, `UC-JOB-001`–`006`, `UC-INT-*`, `UC-OFF-*` | APPROVED — B |
| `P1-OD-014` | A: Platform Admin never sees tenant recruitment content. B: metadata-only by default, with time-bound, reasoned, audited break-glass content access. | **A** for initial scope; any future break-glass access requires a separate approved requirement and security design. | Establishes a strict support/privacy boundary and prevents platform-role authorization bypass. | `BR-AUTH-003`, `005`, `BR-AUD-001`; `UC-AUTH-004`, `UC-ORG-006`, `UC-AUD-002` | APPROVED — A |
| `P1-OD-023` | A: Organization Admin can view recruitment content by default. B: administration authority covers membership/configuration only; content requires a separate business role/permission. | **B**; separates security administration from recruitment participation. | Prevents implicit access to candidate PII. | `BR-ORG-003`, `004`, `BR-AUTH-005`; `UC-ORG-001`–`005`, protected recruitment reads | APPROVED — B |

### Approved Role/Tenant baseline

**Approval evidence:** explicit user approval on 2026-10-05. The following parameters
are part of the approved decisions, not optional recommendations.

- Candidate is independent of Organization Membership. One User may own a Candidate
  Profile while holding different staff roles in different organizations. Staff
  membership never grants access to the User's private Candidate data.
- Every private recruitment resource belongs to exactly one Organization. Initial
  scope has no organization hierarchy, inherited tenant permission, or shared
  cross-organization recruitment resource. Backend organization-scoped queries must
  enforce `organizationId` or an equivalent tenant boundary.
- A membership may hold multiple roles. Effective permissions are the union of role
  permissions but remain limited by organization, assignment, ownership, resource
  state, and business rules.
- Initial organization roles are fixed: `ORG_ADMIN`, `RECRUITER`,
  `HIRING_MANAGER`, and `INTERVIEWER`. Custom roles are not supported.
- Permissions are granted through roles only. Direct user grants, direct deny
  overrides, and ad-hoc membership permissions are not supported.
- Organization Admin may manage non-admin roles. A current Organization Admin may add
  another Organization Admin; Platform Admin participates only in bootstrap/recovery.
  The first Organization Admin is bootstrapped at organization creation. Removing or
  deactivating the last Organization Admin is prohibited unless a replacement is
  established in the same workflow. Privileged-role changes and Platform Admin
  recovery are fully audited with actor, reason, and timestamp. No approval quorum is
  required in initial scope.
- Recruitment access is assignment-scoped by default. Explicit organization-wide
  read/manage permissions may widen scope but are still constrained by state and
  business rules. Reassignment is allowed for an appropriately authorized Recruiter,
  or an Organization Admin who also holds recruitment-management authority, and is
  audited. Platform Admin does not perform routine recruitment assignment.
- Platform Admin cannot view CVs, Application content, Interview feedback, Offer
  content, or internal recruitment notes, and cannot bypass tenant recruitment
  authorization. Initial scope has no break-glass access.
- Organization Admin has no recruitment-content access by default. They must also
  hold an appropriate business role to participate in recruitment.

## 3. Permission and approval authority

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-001` | A: Recruitment Request and Offer approvals are configurable per organization with documented defaults. B: one fixed approval policy for all organizations. | **A**, with approvals enabled by default until an organization disables a platform-marked configurable step. | Configuration is tenant-scoped, role-based, audited, and cannot be overridden per user or request. Initial scope has only supported sequential steps/roles, not arbitrary graphs. | `BR-REQ-003`, `BR-REQ-005`, `BR-OFF-004`, `BR-OFF-006`, `BR-AUD-007`; `UC-REQ-003`–`005`, `UC-OFF-002`–`004` | APPROVED — A |
| `P1-OD-022` | A: Recruiters cannot approve Recruitment Requests/Offers; only configured Hiring Managers or designated approvers can. B: Recruiters may approve with an explicit permission. | **A**. | Recruiter and Org Admin alone do not approve. Approval is role-derived only; valid approver role is required and creators cannot approve their own Request or Offer. | `BR-AUTH-005`, `BR-REQ-006`, `BR-OFF-006`, `BR-AUD-007`; `UC-REQ-004`, `005`, `UC-OFF-003`, `004` | APPROVED — A |
| `P1-OD-024` | A: terminal/completed decisions cannot be generically reopened. B: privileged actors may reverse them. | **A**. | No generic reopen, force-status operation, or administrative `PATCH status`; Platform Admin cannot bypass lifecycle. A future correction requires its own approved actor, reason, authorization, audit, and explicit transition. | `BR-DOM-003`, `BR-AUD-007`; terminal operations across `UC-REQ-*`, `UC-JOB-*`, `UC-APP-*`, `UC-INT-*`, `UC-OFF-*` | APPROVED — A |
| `P1-OD-067` | A: self-registration with verification. B: invitation-only identity creation. C: candidate self-registration plus staff invitation. | **C**. | Candidate self-registration requires verified normalized email and creates neither membership nor staff authority. Staff join only through an audited, tenant-bound, single-use invitation with fixed intended roles and a 72-hour expiry. | `BR-AUTH-013`, `BR-ORG-006`, `BR-AUD-007`; `UC-AUTH-005`, `UC-AUTH-006`, `UC-ORG-002` | APPROVED — C |
| `P1-OD-068` | A: verified email recovery plus configurable MFA/session controls. B: administrator-assisted recovery only. | **A**, with the approved email, TOTP, recovery-code, rate-limit, and session-revocation baseline. | Prevents account enumeration and account takeover while separating authentication recovery from tenant role authority. MFA is mandatory for Platform Admin and Org Admin. | `BR-AUTH-014`, `BR-AUTH-015`, `BR-AUD-004`, `BR-AUD-007`; `UC-AUTH-003` | APPROVED — A |
| `P1-OD-069` | A: Platform Admin may activate/suspend accounts but cannot impersonate; deletion is deactivation/anonymization subject to retention. B: full account mutation and impersonation. | **A**. | Account states are `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, and `DEACTIVATED`; suspension/deactivation revoke sessions but preserve membership/history. Platform Admin manages account metadata/lifecycle only, never tenant content or membership roles. | `BR-AUTH-016`, `BR-AUTH-012`, `BR-ORG-006`, `BR-AUD-001`, `BR-AUD-005`, `BR-AUD-006`, `BR-AUD-007`; `UC-AUTH-004` | APPROVED — A |

### Approved Permission / Approval Authority baseline

The following detailed policy is authoritative only for the six decisions above.
All decision rows are finalized in §10.

- Recruitment Request and Offer approval are enabled by default per Organization. Only
  platform-marked steps may be disabled. Configuration may select supported sequential
  step count and fixed approver roles; it cannot use arbitrary graphs, per-user
  overrides, request-parameter/frontend bypasses, or direct grants. Every change is
  audited. A disabled valid step must use its separately documented lifecycle path;
  it is not a generic bypass.
- A role with approved recruitment-configuration permission may configure the policy.
  `ORG_ADMIN` has that authority only when that same membership also has the relevant
  role-derived configuration permission. `RECRUITER` alone never approves. The
  default Request approver is `HIRING_MANAGER`; an Offer approver is
  `HIRING_MANAGER` or another supported fixed approver role. `ORG_ADMIN` alone does
  not approve. The object creator may not approve that Request or Offer.
- There is no generic lifecycle reopen, reversal, force-status operation, or
  privileged Platform Admin bypass. Initial scope has no corrective reversal flow.
- Candidate registration uses a unique normalized email, password policy, and email
  verification; it produces no Organization Membership, organization role, or staff
  permission. Staff onboarding uses an organization-bound, audited invitation made
  by an actor with membership-management authority. Invitations include intended
  fixed roles, expire after 72 hours, are single-use, and cannot be reused when
  expired, revoked, or used. Acceptance links an existing User or completes a new
  verified identity without altering an existing Candidate Profile.
- Email is the initial verified identity channel. Password-reset tokens are secure,
  single-use, unlogged, and expire after 15 minutes. Public recovery responses do not
  reveal whether an email exists; recovery is limited to five requests per account per
  hour. Password reset revokes all sessions and refresh tokens; authenticated password
  change revokes other sessions by default. TOTP is the initial MFA method; MFA is
  mandatory for `PLATFORM_ADMIN` and `ORG_ADMIN`, recommended for other listed roles,
  and SMS is not the default MFA method. Recovery codes are single-use hashes and
  regeneration invalidates prior codes. Lost MFA without recovery codes uses a
  controlled verified recovery/support workflow, never a peer Org Admin reset.
- Platform Admin may suspend, reactivate a suspended account with reason/audit,
  deactivate an account, support approved recovery, and view platform account
  metadata. It may not impersonate, access tenant recruitment content, or assign
  organization roles to bypass the tenant boundary. Suspension/deactivation revokes
  sessions and blocks login but preserves memberships/history. Last-Org-Admin
  protection applies to deactivation. Anonymization/irreversible deletion remain
  dependent on retention/privacy approval.

## 4. Recruitment Request lifecycle

The proposed transition matrix is documented in
[`RECRUITMENT_REQUEST_LIFECYCLE.md`](./lifecycles/RECRUITMENT_REQUEST_LIFECYCLE.md).

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-015` | A: Recruitment Need is a separate aggregate/lifecycle. B: it is descriptive input owned by Recruitment Request. | **B** until a distinct lifecycle/reporting requirement exists. | Avoids an unsupported aggregate while retaining demand context. | `BR-REQ-001`; `UC-REQ-001`, `002` | APPROVED — see §10 |
| `P1-OD-016` | A: one Recruitment Request to one Job. B: one Recruitment Request to many Jobs sharing approved headcount. | **B**; supports multiple job postings/channels for one approved demand. | Requires aggregate headcount accounting across Jobs. | `BR-REQ-001`, `BR-JOB-001`; `UC-REQ-006`, `UC-JOB-001` | APPROVED — see §10 |
| `P1-OD-025` | A: approve the proposed explicit matrix. B: use a different matrix supplied by Product Owner. | **A**, subject to decisions `026`–`031`. | Converts status vocabulary into implementable operations. | `BR-REQ-002`, `004`; `UC-REQ-003`–`009` | APPROVED — see §10 |
| `P1-OD-026` | A: Hiring Manager submits; configured non-requester approver approves/rejects; authorized Recruiter starts recruitment; authorized Hiring Manager/Recruiter closes/cancels within state rules. B: supply another authority matrix. | **A**, with no self-approval where approval is enabled. | Establishes segregation of duties and operational ownership. | `BR-AUTH-005`, `BR-REQ-003`, `004`; `UC-REQ-003`–`009` | APPROVED — see §10 |
| `P1-OD-027` | A: one required approver. B: configurable ordered multi-step/quorum approval. | **B**, with a single-approver default for initial configuration. | Supports governance variation but increases state/history complexity. | `BR-REQ-003`; `UC-REQ-003`–`005` | APPROVED — see §10 |
| `P1-OD-028` | A: `REJECTED` is terminal. B: an authorized revise operation returns it to `DRAFT` while retaining rejection history. | **B**; supports correction without overwriting the rejected decision. | Requires immutable approval history/versioning. | `BR-REQ-002`, `004`, `BR-AUD-005`; `UC-REQ-005` plus a detailed revise specification | APPROVED — see §10 |
| `P1-OD-029` | A: Request enters `IN_RECRUITMENT` explicitly before any Job opens. B: opening the first linked Job performs/causes the transition. | **B**, provided the transition is coordinated and audited rather than directly mutating another domain. | Removes a redundant manual step but creates cross-domain coordination. | `BR-DOM-002`, `BR-REQ-001`, `BR-JOB-001`; `UC-REQ-006`, `UC-JOB-002` | APPROVED — see §10 |
| `P1-OD-030` | A: headcount is advisory and over-hire is allowed. B: headcount is enforced with atomic reservation/fill/release and explicit override authority. | **B**; default to no over-hire, with any override separately permissioned/audited. | Creates a critical concurrency invariant. | `BR-REQ-001`, `BR-OFF-005`; `UC-REQ-007`, `UC-OFF-005`, `006`, `UC-APP-010` | APPROVED — see §10 |
| `P1-OD-031` | A: `FILLED`, `CLOSED`, and `CANCELLED` are interchangeable terminal labels. B: `FILLED` means headcount satisfied, `CLOSED` means administratively ended, and `CANCELLED` means demand withdrawn before normal completion. | **B**. | Preserves meaningful reporting and history. | `BR-REQ-001`, `002`; `UC-REQ-007`–`009` | APPROVED — see §10 |

## 5. Job lifecycle completion decisions

The Job transition matrix already exists; these decisions close its remaining policy
boundary.

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-032` | A: any Recruiter in the organization may transition Jobs. B: assigned Recruiter with `PERM-JOB-MANAGE`, with optional separately granted organization-wide scope. | **B**. | Enforces least privilege and clear ownership. | `BR-AUTH-005`, `BR-JOB-005`; `UC-JOB-002`–`006` | APPROVED — see §10 |
| `P1-OD-033` | A: `OPEN` means visible to eligible/public candidates. B: `OPEN` is internal and publication is separate. | **A** for the current vocabulary; add a separate status only through an approved future requirement. | Determines discoverability and `UC-JOB-008`. | `BR-JOB-001`–`003`; `UC-JOB-002`, `007`, `008` | APPROVED — see §10 |
| `P1-OD-034` | A: initial scope supports immediate internal publication only. B: scheduling, unpublishing, and external channels are included. | **A**; treat provider/channel integration as later scope under `P1-OD-006`. | Keeps initial delivery independent of unselected providers. | `BR-JOB-001`; `UC-JOB-002`, `003`, `007`, `008` | APPROVED — see §10 |
| `P1-OD-035` | A: `CLOSED`/`ARCHIVED` cannot reopen; create a new linked Job if needed. B: controlled restore is allowed. | **A**. | Preserves terminal history and simple publication semantics. | `BR-JOB-002`–`005`; `UC-JOB-003`–`008` | APPROVED — see §10 |
| `P1-OD-036` | A: pausing/closing automatically terminates active Applications. B: both stop new submissions; existing Applications continue unless explicitly transitioned under Application rules. | **B**. | Prevents silent candidate outcome changes. | `BR-JOB-003`, `BR-DOM-002`, `BR-APP-003`; `UC-JOB-003`, `005`, `UC-APP-*` | APPROVED — see §10 |
| `P1-OD-037` | A: linked Jobs share and enforce Recruitment Request headcount. B: Job capacity is independent. | **A** when a Job is linked; any standalone-Job policy requires separate approval. | Connects job creation and hiring capacity. | `BR-REQ-001`, `BR-JOB-001`; `UC-JOB-001`, `UC-REQ-007`, `UC-OFF-006` | APPROVED — see §10 |

## 6. Application lifecycle, duplicate, and snapshot policy

The proposed transition matrix is documented in
[`APPLICATION_LIFECYCLE.md`](./lifecycles/APPLICATION_LIFECYCLE.md).

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-017` | A: snapshot only resume version. B: snapshot resume version, candidate identity/contact used for recruitment, submitted answers, consent/terms version, and submission time; copy additional profile fields only when the use case requires them. | **B**, minimized to necessary fields and subject to retention/privacy approval. | Balances historical fidelity with data minimization. | `BR-CAN-003`–`005`, `BR-APP-006`; `UC-APP-001`, `UC-CAN-002`–`005` | APPROVED — see §10 |
| `P1-OD-018` | A: Application owns final `HIRED`; no separate onboarding aggregate in current scope. B: create a separate Hire aggregate. | **A**; employee onboarding remains out of current scope. | Keeps the current domain/status model coherent. | `BR-APP-002`, `BR-OFF-003`; `UC-APP-010`, `UC-OFF-006` | APPROVED — see §10 |
| `P1-OD-038` | A: approve the proposed Application transition matrix. B: provide a replacement matrix. | **A**, subject to `039`–`047` and Offer decisions. | Makes nine lifecycle actions implementable and testable. | `BR-APP-003`, `005`, `009`; `UC-APP-001`, `004`–`010` | APPROVED — see §10 |
| `P1-OD-039` | A: one Application per Candidate+Job for all time. B: only one active Application per Candidate+Job; reapplication after a terminal outcome requires an explicitly allowed new submission. | **B**, with active states defined by the approved matrix and no silent reuse of the old record. | Determines uniqueness constraint and candidate reapplication. | `BR-APP-004`; `UC-APP-001` | APPROVED — see §10 |
| `P1-OD-040` | A: withdrawal allowed from any non-hired state and reversible. B: Candidate may withdraw from `APPLIED` through `OFFERED` only before Offer acceptance; withdrawal is terminal. | **B**. | Gives candidate control without rewriting accepted/hired outcomes. | `BR-APP-003`, `007`, `009`; `UC-APP-009` | APPROVED — see §10 |
| `P1-OD-041` | A: free-form reason only, visible to Candidate. B: required internal reason code/notes, optional approved candidate-facing category/message, terminal except a separately audited correction. | **B**. | Supports consistency, privacy, reporting, and defensible history. | `BR-APP-002`, `003`, `BR-AUD-002`, `005`; `UC-APP-006` | APPROVED — see §10 |
| `P1-OD-042` | A: Recruiter alone screens/shortlists. B: Recruiter screens; shortlisting may require Hiring Manager participation when organization configuration enables it. | **B**, with no quorum by default unless explicitly configured. | Supports collaborative hiring without blocking every workflow. | `BR-APP-003`, `009`; `UC-APP-004`, `005` | APPROVED — see §10 |
| `P1-OD-043` | A: Interview completion automatically advances/rejects Application. B: Interview publishes outcome/feedback readiness; an authorized Application operation explicitly advances or rejects. | **B**. | Preserves domain ownership and human decision authority. | `BR-DOM-002`, `BR-APP-008`, `BR-INT-006`; `UC-INT-007`, `010`, `011`, `UC-APP-005`–`008` | APPROVED — see §10 |
| `P1-OD-044` | A: remove one status because `OFFER_PENDING` and `OFFERED` are equivalent. B: `OFFER_PENDING` means offer preparation/approval; `OFFERED` means an approved offer was sent. | **B**. | Gives a clear boundary between internal preparation and candidate-visible offer. | `BR-APP-002`, `BR-OFF-001`, `002`; `UC-APP-008`, `UC-OFF-002`–`005` | APPROVED — see §10 |
| `P1-OD-045` | A: Offer acceptance immediately sets Application `HIRED`. B: acceptance authorizes a separate idempotent confirm-hire operation. | **B**. | Allows final headcount and business checks before recording hire. | `BR-OFF-003`, `BR-APP-009`; `UC-OFF-006`, `UC-APP-010` | APPROVED — see §10 |
| `P1-OD-046` | A: use the minimized snapshot in `P1-OD-017`. B: Product Owner supplies another mandatory field set. | **A**, subject to Privacy Owner review. | Fixes Application historical evidence and storage obligations. | `BR-APP-006`; `UC-APP-001` | APPROVED — see §10 |
| `P1-OD-047` | A: best-effort duplicate checks and unconditional state writes. B: idempotency key for submission, database-enforced active uniqueness, and conditional/versioned lifecycle transitions. | **B**. | Prevents duplicated submissions and lost updates under retry/concurrency. | `BR-APP-004`, `009`; `UC-APP-001`, `004`–`010` | APPROVED — see §10 |

## 7. Interview lifecycle and feedback policy

The proposed transition matrix is documented in
[`INTERVIEW_LIFECYCLE.md`](./lifecycles/INTERVIEW_LIFECYCLE.md).

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-019` | A: Interview directly writes Application status/result. B: Interview exposes a durable outcome/reference; Application consumes it through an explicit operation/event. | **B**. | Preserves ownership and traceability. | `BR-DOM-002`, `BR-APP-008`, `BR-INT-006`; `UC-INT-007`, `UC-APP-005`–`008` | APPROVED — see §10 |
| `P1-OD-048` | A: approve the proposed Interview matrix. B: provide a replacement matrix. | **A**, subject to `049`–`056`. | Defines schedule, confirmation, execution, completion, cancellation, and no-show behavior. | `BR-INT-007`; `UC-INT-001`, `002`, `005`–`009` | APPROVED — see §10 |
| `P1-OD-049` | A: Recruiter controls all transitions. B: Recruiter schedules/cancels/marks no-show; each participant confirms their participation; assigned lead/recruiter starts and completes under permission. | **B**. | Splits operational coordination from participant acknowledgement. | `BR-AUTH-005`, `BR-INT-002`, `007`; `UC-INT-002`, `005`–`009` | APPROVED — see §10 |
| `P1-OD-050` | A: Candidate confirmation is always required and candidate may directly reschedule. B: confirmation requirement is configurable; Candidate requests changes and an authorized scheduler commits them. | **B**. | Avoids unauthorized calendar mutation while supporting candidate coordination. | `BR-INT-007`; `UC-INT-004`, `005`, `008` | APPROVED — see §10 |
| `P1-OD-051` | A: rounds are strictly sequential. B: sequential by default; explicitly configured parallel rounds are allowed with ordering/group metadata. | **B**. | Supports panel/parallel processes but requires completion aggregation. | `BR-INT-001`; `UC-INT-001`, `002`, `007` | APPROVED — see §10 |
| `P1-OD-052` | A: feedback is optional/unlocked indefinitely. B: required assignments have configurable due dates; edits are versioned and lock at an approved decision boundary, with audited override. | **B**; Product Owner must select the lock boundary. | Improves completion/reporting but adds overdue and correction workflow. | `BR-INT-004`, `005`, `BR-AUD-002`; `UC-INT-010` | APPROVED — see §10 |
| `P1-OD-053` | A: unstructured notes only. B: organization-approved round template with rating scale, required fields, recommendation, and restricted recruitment-team visibility. | **B**; exact scale/template remains organization configuration. | Enables consistent evaluation while preserving candidate privacy. | `BR-INT-001`, `003`; `UC-INT-011` | APPROVED — see §10 |
| `P1-OD-054` | A: Interview cannot complete until all feedback is submitted. B: Interview may complete after the session; Application progression waits for required feedback/scorecards unless an authorized audited override is used. | **B**. | Separates event completion from evaluation readiness without silently skipping feedback. | `BR-INT-004`, `005`; `UC-INT-007`, `010`, `011`, `UC-APP-005`–`008` | APPROVED — see §10 |
| `P1-OD-055` | A: score/result automatically changes Application state. B: result enables an explicit authorized Application decision. | **B**. | Preserves human decision and Application ownership. | `BR-DOM-002`, `BR-APP-002`, `BR-INT-006`; `UC-INT-007`, `010`, `011`, `UC-APP-005`–`008` | APPROVED — see §10 |
| `P1-OD-056` | A: store/display local time only and require calendar integration. B: persist an instant plus source time zone, validate conflicts, render participant zones, and keep provider integration out of initial scope. | **B**; notifications follow approved Communication policy. | Avoids time-zone ambiguity without selecting an external provider. | `BR-INT-001`, `BR-NOT-003`; `UC-INT-002`, `004`, `008`, `UC-NOT-001` | APPROVED — see §10 |

## 8. Offer lifecycle, hiring, and headcount

The proposed transition matrix is documented in
[`OFFER_LIFECYCLE.md`](./lifecycles/OFFER_LIFECYCLE.md).

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-002` | A: accepted Offer immediately completes Hire. B: Hire completes through an explicit confirm-hire action after Offer acceptance and headcount validation. | **B**. | Separates candidate intent from the organization's recorded hiring completion. | `BR-OFF-002`, `003`; `UC-OFF-006`, `UC-APP-010` | APPROVED — see §10 |
| `P1-OD-020` | A: Offer directly mutates Application/headcount. B: committed Offer outcomes are coordinated through explicit Application/Recruitment Planning operations. | **B**. | Preserves ownership and failure recovery. | `BR-DOM-002`, `BR-OFF-001`, `BR-APP-002`, `BR-REQ-001`; `UC-OFF-005`–`009`, `UC-APP-010`, `UC-REQ-007` | APPROVED — see §10 |
| `P1-OD-021` | A: all cross-domain work is synchronous. B: synchronous validation/commands where an immediate answer is required, durable events for committed outcomes/side effects. | **B** as a semantic recommendation; P3 must choose the technical mechanism. | Defines consistency expectations without pre-empting architecture. | `BR-DOM-002`, `BR-NOT-003`; cross-domain Application/Interview/Offer use cases | APPROVED — see §10 |
| `P1-OD-057` | A: approve the proposed Offer matrix. B: provide a replacement matrix. | **A**, subject to `058`–`066`. | Makes approval, send, response, expiration, and withdrawal explicit. | `BR-OFF-004`; `UC-OFF-001`–`009` | APPROVED — see §10 |
| `P1-OD-058` | A: every Offer requires approval by a configured non-creator approver. B: approval is organization-configurable by threshold/type. | **B**, with approval required by default and no self-approval. | Supports governance variation but requires documented configuration. | `BR-OFF-004`, `BR-AUD-002`; `UC-OFF-002`–`004` | APPROVED — see §10 |
| `P1-OD-059` | A: `REJECTED` is terminal. B: revise creates a new version and returns the Offer to `DRAFT`, preserving rejection history. | **B**. | Supports correction without erasing the approval decision. | `BR-OFF-001`, `004`, `BR-AUD-005`; `UC-OFF-004`, `001`, `002` | APPROVED — see §10 |
| `P1-OD-060` | A: approved/sent Offer content may be edited in place. B: submitted/approved versions are immutable; material change creates a new version and resets approval; sent Offers require withdrawal/replacement. | **B**. | Preserves what was approved and shown to the Candidate. | `BR-OFF-001`, `004`, `005`; `UC-OFF-002`, `005`, `009` | APPROVED — see §10 |
| `P1-OD-061` | A: expiration is optional/free-form. B: sent Offer has an explicit expiry instant and source time zone; reminders are configured; material extension creates a new version/reapproval; system expires idempotently. | **B**. | Creates deterministic response windows and automation. | `BR-OFF-004`, `005`, `BR-NOT-005`; `UC-OFF-005`, `008`, `UC-NOT-001`, `002` | APPROVED — see §10 |
| `P1-OD-062` | A: any Recruiter may withdraw at any time. B: assigned authorized Recruiter may withdraw before acceptance with required reason; post-acceptance rescission is a separate unresolved/legal operation. | **B**. | Protects accepted commitments and preserves accountability. | `BR-AUTH-005`, `BR-OFF-004`, `BR-AUD-002`; `UC-OFF-009` | APPROVED — see §10 |
| `P1-OD-063` | A: Candidate may freely reverse acceptance/decline. B: response is terminal; exception handling requires an authorized audited replacement/rescission flow. | **B**. | Prevents ambiguous commitments while leaving exceptional correction explicit. | `BR-OFF-002`, `004`, `005`; `UC-OFF-006`, `007` | APPROVED — see §10 |
| `P1-OD-064` | A: Offer acceptance directly hires. B: idempotent confirm-hire after acceptance transitions Application and converts reserved headcount to filled. | **B**. | Defines the exact hire boundary and audit point. | `BR-OFF-003`, `BR-APP-009`, `BR-REQ-001`; `UC-OFF-006`, `UC-APP-010`, `UC-REQ-007` | APPROVED — see §10 |
| `P1-OD-065` | A: reserve headcount when Offer is sent and release on decline/expiry/withdrawal. B: reserve only on acceptance, allowing more live Offers than available positions. | **A** by default; any over-offer mode requires explicit organization configuration and candidate-risk acceptance. | Prevents valid Offers from competing for the last slot; may reduce offer throughput. | `BR-REQ-001`, `BR-OFF-005`; `UC-OFF-005`–`009`, `UC-APP-010`, `UC-REQ-007` | APPROVED — see §10 |

## 9. Notification, audit, retention, and integration policy

| ID | Options | Recommendation | Business impact | Affected rules/use cases | Status |
|---|---|---|---|---|---|
| `P1-OD-005` | A: indefinite retention/hard delete on request. B: jurisdiction-approved retention schedule with export, legal hold, restricted soft deletion/anonymization, and preserved recruitment/audit referential history. | **B**; exact periods require Privacy/Legal approval before closure. | Controls compliance, storage, deletion, and historical integrity. | `BR-AUD-005`, `006`, `BR-CAN-003`–`005`, `BR-APP-006`; `UC-CAN-005`, `UC-AUTH-004`, archival/history use cases | APPROVED — see §10 |
| `P1-OD-006` | A: no external job board/calendar/e-signature/background-check integrations in initial scope. B: name approved providers now. | **A** unless Product Owner supplies a provider and scope. | Keeps P3 provider-neutral and avoids invented contracts. | Product scope; `UC-JOB-002`, `UC-INT-002`, `UC-OFF-005`, `UC-NOT-001` | APPROVED — see §10 |
| `P1-OD-007` | A: in-app only, best effort. B: in-app plus email for selected events, asynchronous at-least-once attempts, visible delivery status, and no rollback of committed recruitment state. | **B**, with recipients/SLA finalized under `P1-OD-066`. | Improves reach but adds provider, retry, preference, and privacy concerns. | `BR-NOT-001`–`005`; `UC-NOT-001`–`003` | APPROVED — see §10 |
| `P1-OD-008` | A: audit only sensitive Platform Admin actions. B: mandatory audit for authentication/security administration, membership/role changes, approvals/rejections, publication/closure, application decisions, interview schedule/feedback changes, offer actions, hiring, and destructive/privacy operations. | **B**. | Provides accountability at increased storage/privacy cost. | `BR-AUD-001`–`006`; `UC-AUD-001`, all listed mutating use cases | APPROVED — see §10 |
| `P1-OD-066` | A: ad-hoc notifications with no delivery guarantee. B: event/recipient matrix covering approval requests/decisions, interview schedule/change/cancel, application outcome, Offer send/reminder/withdrawal/expiry, and hire; retry idempotently and expose final delivery failure without rolling back business state. | **B**; exact SLA/channel preference needs Product Owner approval. | Defines operational communication expectations and failure handling. | `BR-NOT-001`–`005`, `BR-OFF-005`; `UC-NOT-001`, `002`, lifecycle operations | APPROVED — see §10 |
| `P1-OD-070` | A: delivery history visible only to Platform Admin. B: organization-scoped operational history for authorized staff plus platform-wide support/audit access; recipients see only their own notification status if exposed. | **B**, with retention tied to `P1-OD-005`. | Enables support while preserving tenant and recipient privacy. | `BR-AUTH-005`, `BR-NOT-001`, `BR-AUD-004`; `UC-NOT-003`, `UC-AUD-002` | APPROVED — see §10 |

## 10. Final P1 approval closure

The explicit P1-finalization task approves the following previously proposed rows.
This table is authoritative over the historical proposal-status cells above. Where the
task supplies a more specific baseline than the earlier recommendation, the task
baseline controls. `P1-OD-005` approves the business principle only; its legal
duration/jurisdiction parameter remains `EXTERNAL_POLICY_PENDING`.

| Decision IDs | Approved option/baseline | Status |
|---|---|---|
| `015`, `016`, `025`–`027`, `029`–`031` | B, B, A, A, B, B, B, B | APPROVED |
| `028` | A — rejected Request is terminal | APPROVED |
| `032`–`037` | B, A, A, A, B, A | APPROVED |
| `017`, `018`, `038`, `040`–`047` | B, A, A, B, B, B, B, B, B, A, B | APPROVED |
| `039` | A — one Application per Candidate+Job in initial scope; no re-application | APPROVED |
| `019`, `048`–`056` | B, A, B, B, B, B (lock at submission/no edits), B (platform-defined template), B, B, B | APPROVED |
| `002`, `020`, `021`, `057`–`064` | B, B, B, A, B, B, B, B (14-day default), B, B, B, B | APPROVED |
| `065` | B baseline — no reservation at `OFFERED`; enforce capacity atomically at confirm-hire | APPROVED |
| `005` | B business principle; exact jurisdiction, legal hold, and retention periods are external parameters | APPROVED — EXTERNAL_POLICY_PENDING |
| `006`, `007`, `008`, `066`, `070` | A, B, B, B, B | APPROVED |

The approved operating baseline is: strict Organization isolation; fixed, role-derived
permissions; explicit named lifecycle transitions; no generic reversal; default-enabled
approval without creator approval; headcount fields `requested`, `filled`, and
`remaining` with `filled <= requested`; no Application re-apply in initial scope;
locked submitted Interview feedback; email/in-app notification with idempotent retry;
and audit for the named security and business-critical actions. No legal retention
period is implied by this closure.

## 11. Approval summary

| Priority bundle | Decision IDs | Closed | Awaiting approval |
|---|---|---:|---:|
| Role composition and tenant scope | `003`, `004`, `009`–`014`, `023` | 9 | 0 |
| Permission and approval authority | `001`, `022`, `024`, `067`–`069` | 6 | 0 |
| Recruitment Request | `015`, `016`, `025`–`031` | 9 | 0 |
| Job completion policy | `032`–`037` | 6 | 0 |
| Application/duplicate/snapshot | `017`, `018`, `038`–`047` | 12 | 0 |
| Interview/feedback | `019`, `048`–`056` | 10 | 0 |
| Offer/hiring/headcount | `002`, `020`, `021`, `057`–`065` | 12 | 0 |
| Notification/audit/retention/integration | `005`–`008`, `066`, `070` | 6 | 0 |
| **Total** | `P1-OD-001`–`070` | **70** | **0** |

No recommendation in this document changes a lifecycle, permission, rule, or use case
until its decision is explicitly approved and propagated to the owning documents.

