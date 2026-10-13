# Permission Model

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Source:** `AGENTS.md` §§4-5, 15, 18-19, 23, 45

## 1. Authorization decision

Every protected business action must evaluate all applicable dimensions:

```text
Authenticated User
  + Organization Membership
  + Role
  + Permission
  + Resource ownership / assignment / organization scope
  + Resource lifecycle state
  + Business preconditions
```

A role or resource identifier alone is insufficient. Frontend visibility is not a
security boundary; enforcement belongs in the backend.

Approved Role/Tenant decisions add these constraints:

- membership may hold multiple fixed roles and receives the union of their
  permissions;
- permissions are role-derived only, with no direct membership grant/deny;
- role union never bypasses organization, assignment, ownership, state, or business
  rules;
- every private recruitment resource belongs to exactly one Organization in initial
  scope, and backend queries enforce that tenant boundary;
- recruitment access is assignment-scoped unless a separate organization-wide
  permission is present.

Normative authorization behavior is defined by `BR-AUTH-001` through
`BR-AUTH-007`, `BR-ORG-001` through `BR-ORG-004`, and the domain-specific rules in
`BUSINESS_RULES.md`.

## 2. Permission scopes

| Scope | Meaning |
|---|---|
| `SELF` | Only the authenticated user's own candidate/account resource |
| `PUBLIC` | Publicly visible resource without private recruitment data |
| `ASSIGNED` | Resource explicitly assigned to the actor |
| `ORG` | Resource belongs to an organization in which the user has an active membership and required permission |
| `PLATFORM` | Platform-wide administrative scope granted separately from organization membership |
| `CONFIGURED` | Action is available only when an approved organization configuration enables it |

## 3. Permission catalog

These identifiers are stable draft identifiers derived only from capabilities stated
in `AGENTS.md`. A permission never bypasses ownership, assignment, organization, state,
or business-rule checks.

### Candidate

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-CAN-PROFILE-MANAGE` | View and update own candidate profile | SELF |
| `PERM-CAN-RESUME-MANAGE` | Manage own resume/CV versions | SELF |
| `PERM-JOB-SEARCH-PUBLIC` | Search public jobs | PUBLIC |
| `PERM-APP-SUBMIT` | Submit an application as the authenticated candidate | SELF + resource state |
| `PERM-APP-VIEW-OWN` | View own applications | SELF |
| `PERM-APP-WITHDRAW-OWN` | Withdraw own application when allowed | SELF + resource state |
| `PERM-INT-VIEW-ASSIGNED` | View interview schedules assigned to the candidate | SELF + ASSIGNED |
| `PERM-OFF-RESPOND-OWN` | Respond to own sent offer | SELF + resource state |

### Recruiter

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-REC-ACTIVITY-MANAGE` | Manage assigned recruitment activities | ORG + ASSIGNED |
| `PERM-REC-READ-ALL` | Read recruitment resources across the active Organization without assignment | ORG + explicit role-derived broad scope |
| `PERM-REC-MANAGE-ALL` | Manage and reassign recruitment resources across the active Organization, subject to action/state rules | ORG + explicit role-derived broad scope |
| `PERM-JOB-CREATE` | Create a job within an authorized organization context | ORG |
| `PERM-JOB-MANAGE` | Manage an authorized job | ORG + ownership/assignment |
| `PERM-APP-REVIEW` | Review authorized applications | ORG + ownership/assignment |
| `PERM-APP-SCREEN` | Start/perform screening | ORG + ownership/assignment + state |
| `PERM-APP-SHORTLIST` | Shortlist an application | ORG + ownership/assignment + state |
| `PERM-APP-REJECT` | Reject an application | ORG + ownership/assignment + state |
| `PERM-INT-SCHEDULE` | Schedule an interview | ORG + ownership/assignment |
| `PERM-INT-ASSIGN-INTERVIEWER` | Coordinate/assign interviewers | ORG + ownership/assignment |
| `PERM-OFF-CREATE` | Create an offer for an authorized application | ORG + ownership/assignment + state |
| `PERM-PIPELINE-MANAGE` | Perform authorized recruitment-pipeline operations | ORG + ownership/assignment + state |

### Hiring Manager

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-REQ-CREATE` | Create a recruitment request | ORG |
| `PERM-REQ-DEFINE-REQUIREMENTS` | Define position requirements | ORG + ownership/assignment |
| `PERM-REQ-APPROVE` | Approve a configured Recruitment Request when not its creator | ORG + CONFIGURED + ownership/assignment + state + non-creator |
| `PERM-REQ-REJECT` | Reject a configured Recruitment Request when not its creator | ORG + CONFIGURED + ownership/assignment + state + non-creator |
| `PERM-APP-REVIEW-HM` | Review candidates/applications in an authorized hiring context | ORG + ownership/assignment |
| `PERM-APP-SHORTLIST-PARTICIPATE` | Participate in shortlisting | ORG + ownership/assignment + state |
| `PERM-INT-PARTICIPATE-HM` | Participate in an assigned interview | ORG + ASSIGNED |
| `PERM-DECISION-SUBMIT` | Provide a hiring decision | ORG + ownership/assignment + state |
| `PERM-OFF-APPROVE` | Approve an offer when configured | ORG + CONFIGURED + ownership/assignment + state |
| `PERM-OFF-REJECT-APPROVAL` | Reject an offer approval when configured and not its creator | ORG + CONFIGURED + ownership/assignment + state + non-creator |

### Interviewer

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-INT-VIEW-INTERVIEWER` | View assigned interview information | ORG + ASSIGNED |
| `PERM-INT-VIEW-MINIMUM-CONTEXT` | View minimum candidate/job context required for an assignment | ORG + ASSIGNED |
| `PERM-INT-FEEDBACK-SUBMIT` | Submit feedback for an assigned interview | ORG + ASSIGNED + state |
| `PERM-INT-SCORECARD-SUBMIT` | Submit a scorecard for an assigned interview | ORG + ASSIGNED + state |

### Organization Admin

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-ORG-MANAGE` | Manage organization information | ORG |
| `PERM-ORG-MEMBER-INVITE` | Invite organization members | ORG |
| `PERM-ORG-MEMBERSHIP-MANAGE` | Manage organization membership | ORG |
| `PERM-ORG-ROLE-ASSIGN` | Assign organization roles | ORG |
| `PERM-ORG-PERMISSION-MANAGE` | Manage approved organization-level configuration; it does not create custom roles or direct permission grants | ORG |
| `PERM-REC-APPROVAL-CONFIG-MANAGE` | Configure supported Recruitment Request and Offer approval steps/roles for the organization | ORG + fixed role + audit |

### Platform Admin

| Permission ID | Capability | Scope |
|---|---|---|
| `PERM-PLATFORM-ACCOUNT-MANAGE` | Manage platform accounts | PLATFORM |
| `PERM-PLATFORM-ACCOUNT-LIFECYCLE-MANAGE` | Suspend, reactivate, deactivate, and support approved account recovery without impersonation or tenant-content access | PLATFORM |
| `PERM-PLATFORM-ORG-MANAGE` | Manage organizations at platform level | PLATFORM |
| `PERM-PLATFORM-SUPPORT` | Perform approved platform support operations | PLATFORM |
| `PERM-AUD-EVENT-INVESTIGATE` | Investigate security/audit events | PLATFORM |
| `PERM-PLATFORM-CONFIG-MANAGE` | Manage platform-wide configuration | PLATFORM |

## 4. Capability matrix

The matrix indicates capabilities granted by the current draft sources. `—` means
"not granted by the current source", not a final permanent denial.

| Capability | Candidate | Recruiter | Hiring Manager | Interviewer | Org Admin | Platform Admin |
|---|---|---|---|---|---|---|
| Own candidate profile/resumes | SELF | — | — | — | — | — |
| Search public jobs | PUBLIC | PUBLIC | PUBLIC | PUBLIC | PUBLIC | PUBLIC |
| Submit/view/withdraw own application | SELF | — | — | — | — | — |
| Create/manage jobs | — | ORG/ASSIGNED | — | — | — | — |
| Review applications/candidates | — | ORG/ASSIGNED; ORG only with explicit broad permission | ORG/ASSIGNED; ORG only with explicit broad permission | Minimum assigned context only | No access without additional business role | No tenant-content access |
| Screen/shortlist/reject | — | ORG/ASSIGNED | Shortlist participation only | — | — | — |
| Create recruitment requests | — | — | ORG | — | — | — |
| Schedule/coordinate interviews | — | ORG/ASSIGNED | — | — | — | — |
| Participate and submit feedback | Candidate participation only | As assigned; details undefined | ASSIGNED | ASSIGNED | — | — |
| Create offers | — | ORG/ASSIGNED | — | — | — | — |
| Approve offers | — | — | CONFIGURED/ASSIGNED | — | — | — |
| Approve/reject recruitment requests | — | — | CONFIGURED/ASSIGNED, non-creator | — | — | — |
| Configure supported approval policy | — | Fixed role only when granted the configuration permission | Fixed role only when granted the configuration permission | — | Fixed role only when granted the configuration permission | — |
| Respond to own offer | SELF | — | — | — | — | — |
| Manage organization/memberships | — | — | — | — | ORG, subject to privileged-role safeguards | PLATFORM bootstrap/recovery only for Organization Admin changes |
| Investigate security/audit events | — | — | — | — | Not specified | PLATFORM |
| Suspend/reactivate/deactivate account | — | — | — | — | — | PLATFORM only; no impersonation/content access |

## 5. Mandatory resource checks

Before allowing a protected operation, the backend must establish:

1. authenticated user identity;
2. active organization membership when an organization resource is involved;
3. applicable platform or organization role;
4. required permission;
5. matching organization scope;
6. ownership or assignment where required;
7. allowed resource state and transition;
8. remaining business preconditions.

Client-supplied actor, organization, owner, or role values are not authoritative.
Platform Admin authority cannot bypass tenant recruitment authorization.

For assignment-managed recruitment resources:

- Recruiter, Hiring Manager, and Interviewer scope follows the approved actor rules;
- reassignment requires appropriate recruitment-management permission and an audit
  record;
- Organization Admin may reassign only when the same membership also holds a business
  role carrying the required recruitment-management permission;
- Platform Admin does not participate in routine recruitment assignment.

## 6. Explicit privacy constraints

- A Candidate must never access another candidate's private application data.
- A Recruiter in Organization A must not access Organization B's private recruitment
  data merely because the user has a recruiter role elsewhere.
- An Interviewer sees only assigned interviews and the minimum required candidate/job
  information unless separately granted broader authority.
- Organization Admin authority is not Platform Admin authority.
- Organization Admin has no Candidate, Application, Interview, Offer, or internal-note
  visibility unless the membership also holds an appropriate business role.
- Platform Admin has no Candidate CV, Application content, Interview feedback, Offer
  content, or internal recruitment-note visibility in initial scope.

## 7. Approved Permission / Approval Authority baseline

`P1-OD-001`, `022`, `024`, and `067`–`069` are `APPROVED`.

- Recruitment Request and Offer approval are enabled by default per Organization.
  Only platform-marked configurable steps may be disabled; configuration is limited
  to supported sequential steps and fixed approver roles. It has no arbitrary graph,
  direct-user override, or request/frontend bypass.
- `PERM-REC-APPROVAL-CONFIG-MANAGE` is role-derived only. An `ORG_ADMIN` must also
  hold that capability through the fixed-role model; the admin role alone neither
  configures recruitment approvals nor grants recruitment-content access.
- `RECRUITER` alone cannot approve or reject Recruitment Requests or Offers.
  `HIRING_MANAGER` is the default Request approver and may be the Offer approver when
  configured. An approver must have the configured role/permission, relevant tenant
  and assignment scope, valid state, and cannot be the object creator.
- No permission grants generic reopen, force-status, or terminal-state reversal.
- Staff invitations require `PERM-ORG-MEMBER-INVITE` and organization scope; only
  fixed intended roles can be included. Candidate registration grants no staff
  permission or membership.
- Platform account lifecycle management is platform-only. It cannot impersonate,
  access tenant recruitment content, or assign tenant roles; it observes
  last-Organization-Admin protection.

## 8. Remaining unresolved permission decisions

| ID | Decision needed |
|---|---|
| — | No remaining permission-authority decision in this approved bundle. Lifecycle-specific authority remains governed by its unresolved lifecycle decisions. |

## 9. Approval-closure mapping

Full options, approval evidence, and business impact are in
[`P1_APPROVAL_DECISIONS.md`](./P1_APPROVAL_DECISIONS.md). Only rows explicitly marked
`APPROVED` below are authoritative.

| Authority boundary | Outcome | Decision IDs | Status | Affected permissions/use cases |
|---|---|---|---|---|
| Membership role composition | Multiple fixed roles per membership; role-derived grants only | `P1-OD-009`–`011` | APPROVED | Organization membership/role/permission operations |
| Privileged role assignment | Current Organization Admin may add/remove admins with last-admin protection; Platform Admin is limited to bootstrap/recovery; all privileged changes are audited | `P1-OD-012` | APPROVED | `PERM-ORG-ROLE-ASSIGN`, `PERM-PLATFORM-ORG-MANAGE`; `UC-ORG-004`, `006` |
| Recruiter/Hiring Manager data scope | Assignment scope by default; wider ORG scope only through explicit role-derived permission | `P1-OD-013` | APPROVED | `PERM-REC-READ-ALL`, `PERM-REC-MANAGE-ALL`; Job/Application/Interview/Offer operations |
| Platform support access | Metadata/control only; no tenant recruitment content and no break-glass in initial scope | `P1-OD-014` | APPROVED | Platform Admin permissions; `UC-AUTH-004`, `UC-ORG-006`, `UC-AUD-002` |
| Organization Admin content access | Membership/configuration only unless an additional business role is held | `P1-OD-023` | APPROVED | Organization Admin catalog and protected recruitment reads |
| Request/Offer approval baseline | Default-enabled per-Organization supported configuration; configured non-creator approver; no Recruiter/Org Admin-alone approval | `P1-OD-001`, `022` | APPROVED | `PERM-REC-APPROVAL-CONFIG-MANAGE`, `PERM-REQ-APPROVE`, `PERM-REQ-REJECT`, `PERM-OFF-APPROVE`, `PERM-OFF-REJECT-APPROVAL` |
| Lifecycle reversal | No generic reversal, force-status, or Platform Admin lifecycle bypass | `P1-OD-024` | APPROVED | No generic lifecycle permission |
| Identity provisioning/recovery/admin | Candidate self-registration, staff invitation, verified email recovery, TOTP/MFA assurance, restricted platform account lifecycle | `P1-OD-067`–`069` | APPROVED | `PERM-ORG-MEMBER-INVITE`, `PERM-PLATFORM-ACCOUNT-LIFECYCLE-MANAGE`, `UC-AUTH-003`–`006`, `UC-ORG-002` |

`PERM-REC-READ-ALL` and `PERM-REC-MANAGE-ALL` are the stable catalog identifiers for
the approved broad-scope concepts. Because permissions may be granted only through
fixed roles, configuring either permission on a role affects every membership holding
that role in the organization; selective per-member broad access is not supported by
the approved baseline.

