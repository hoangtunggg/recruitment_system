# Actors and Roles

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Source:** `AGENTS.md` §§4-5, 18-19, 45

## 1. Identity versus role

`User` is the authenticated identity. It is not a business role.

Organization-specific roles are attached to an `OrganizationMembership`, not stored as
one global role on the user. The same user may hold different roles in different
organizations. Platform-level roles remain separate from organization roles.

```text
User
  -> zero or more OrganizationMembership records
       -> Organization
       -> one or more organization roles/permissions
  -> optional platform-level role(s)
```

## 2. Actor catalog

### Candidate

An applicant acting on their own candidate data and recruitment participation.

Explicit capabilities:

- manage own candidate profile;
- manage own resume/CV versions;
- search public jobs;
- submit applications;
- view own applications;
- withdraw an application when allowed;
- view assigned interview schedules;
- respond to own offers.

Scope constraints:

- self-owned candidate/application/offer data only;
- never another candidate's private application data;
- resource state can further restrict actions.

Under approved `P1-OD-003`, Candidate is organization-independent. The same User may
own a Candidate Profile and hold staff memberships in one or more organizations. Each
authorization context is evaluated independently; staff membership does not grant
access to the User's private Candidate data.

### Recruiter

An organization-scoped role that operates assigned recruitment workflows.

Explicit capabilities:

- manage assigned recruitment activities;
- create and manage jobs;
- review, screen, shortlist, and reject applications;
- schedule interviews and coordinate assigned interviewers;
- create offers;
- manage the recruitment pipeline.

The role grants no access outside the user's organization membership and is
assignment-scoped by default. Organization-wide recruitment access requires an
explicit role-derived permission. A Recruiter may reassign resources only with the
applicable recruitment-management authority, and reassignment must be audited.

### Hiring Manager

An organization-scoped role representing the business owner or participant in a
hiring need.

Explicit capabilities:

- create recruitment requests;
- define position requirements;
- review candidates;
- participate in shortlisting and interviews;
- provide hiring decisions;
- approve configured Recruitment Requests and Offers when the user is not the object
  creator.

Hiring Manager access is limited to requests they own/participate in and the related
assigned Jobs, Applications, Interviews, Offers, and decision data permitted by their
role. The role is not organization-wide by default.

### Interviewer

An organization-scoped, assignment-limited role.

Explicit capabilities:

- view assigned interview information;
- view the minimum candidate/job information necessary for the assignment;
- submit interview feedback;
- submit scorecards.

The Interviewer role does not automatically grant access to all applications.

### Organization Admin

An organization-scoped administrative role.

Explicit capabilities:

- manage organization information;
- invite organization members;
- manage organization membership;
- assign organization roles;
- manage organization-level permissions.

Organization Admin is distinct from Platform Admin and has no implicit platform-wide
authority. Organization Admin also has no recruitment-content access by default. To
participate in recruitment, the same membership must hold an appropriate additional
business role.

### Platform Admin

A platform-scoped administrative role.

Explicit capabilities:

- manage platform accounts;
- manage organizations;
- support platform administrative operations;
- investigate security and audit events;
- manage platform-wide configuration.

Sensitive Platform Admin actions must be auditable.

Platform Admin may access platform/control metadata required for account and
organization administration, operational status, and permitted security/audit
investigation. In initial scope, Platform Admin cannot view Candidate CVs, Application
content, Interview feedback, Offer content, or internal recruitment notes, and cannot
use the platform role to bypass tenant recruitment authorization. Break-glass tenant
content access is not supported.

## 3. Approved role composition and scope baseline

The following decisions are `APPROVED`: `P1-OD-003`, `004`, `009`–`014`, and `023`.

- One Organization Membership may hold multiple roles.
- Effective permissions are the union of role permissions, still constrained by
  organization, assignment, ownership, resource state, and business rules.
- Initial organization roles are fixed: `ORG_ADMIN`, `RECRUITER`,
  `HIRING_MANAGER`, and `INTERVIEWER`.
- Custom organization roles, direct user grants, direct deny overrides, and ad-hoc
  membership permissions are not supported in initial scope.
- Organization Admin may assign/remove non-admin organization roles.
- A current Organization Admin may add another Organization Admin. Platform Admin may
  add one only during bootstrap or recovery.
- Organization creation must establish its first Organization Admin.
- The last Organization Admin cannot be removed/deactivated unless a replacement is
  established successfully in the same workflow.
- Organization Admin changes, privileged-role changes, reassignment, and Platform
  Admin recovery are audited. Recovery includes reason, actor, and timestamp.
- Initial scope requires no approval quorum for Organization Admin changes.
- Recruiter and Hiring Manager access is assignment-scoped by default. Broader
  organization access requires explicit role-derived recruitment permission.
- Platform Admin has no tenant recruitment-content or routine assignment authority.

## 4. Approved permission, identity, and account-administration baseline

The following decisions are `APPROVED`: `P1-OD-001`, `022`, `024`, and `067`–`069`.

- `RECRUITER` alone cannot approve/reject Recruitment Requests or Offers. The default
  Request approver is `HIRING_MANAGER`; an Offer approver is a configured supported
  fixed role. `ORG_ADMIN` alone has no approval authority. The object creator cannot
  approve their own Request or Offer.
- Approval policy is tenant-scoped, default-enabled, and configured only by a
  role-derived recruitment-configuration permission. An `ORG_ADMIN` must also hold
  that capability; no direct user override, arbitrary graph, or frontend/request
  bypass is supported.
- Candidate self-registration uses verified normalized email and never creates an
  Organization Membership or staff authority. Staff membership arrives only from an
  organization-bound, audited, single-use invitation with fixed intended roles and a
  72-hour expiry. Existing Candidate Profile data remains unchanged on acceptance.
- Email is the initial recovery channel. MFA uses TOTP initially and is mandatory for
  `PLATFORM_ADMIN` and `ORG_ADMIN`. Authentication recovery does not alter an
  organization membership or role; another Organization Admin cannot reset a user's
  authentication factor.
- Platform Admin may manage only approved account lifecycle/metadata and recovery
  support. It cannot impersonate, access tenant recruitment content, or assign
  organization roles. Suspension/deactivation blocks login and preserves history;
  last-Organization-Admin protection remains applicable.
- No actor has generic lifecycle reopen, force-status, or terminal-state reversal
  authority. A future correction must be a separately approved, audited use case.

## 5. Non-role participants

Email providers, storage providers, calendar systems, and other integrations are
external systems, not business actors. No integration-specific authority is defined in
this phase.

