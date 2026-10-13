# Business Rules

**Status:** APPROVED — legal retention parameters remain EXTERNAL_POLICY_PENDING  
**Last updated:** 2026-10-05  
**Source:** Explicit legacy `AGENTS.md` rules plus authorized `P1-OD-*` decisions;
unresolved policy is excluded

## 1. Identifier policy

- Rule IDs are stable and must not be reused for another rule.
- New rules append a new ID within the owning prefix.
- A retired rule keeps its ID and receives `DEPRECATED` or `ARCHIVED` status rather
  than being renumbered.
- Rules remain `DRAFT` until explicitly approved; §16 records the current individually
  `APPROVED` rule set.
- Open questions are tracked as `P1-OD-*` decisions, not represented as rules.

## 2. Identity and authorization rules

| ID | Rule | Source |
|---|---|---|
| `BR-AUTH-001` | `User` represents identity and must not be treated as a business role. | AGENTS §5 |
| `BR-AUTH-002` | Organization-specific roles and permissions must be evaluated through organization membership rather than one global user-role field. | AGENTS §§5,18 |
| `BR-AUTH-003` | Platform-level roles must remain distinct from organization-level roles. | AGENTS §5 |
| `BR-AUTH-004` | Every protected business operation must enforce authorization at the backend. | AGENTS §19 |
| `BR-AUTH-005` | Authorization must evaluate user, membership, role, permission, resource ownership/scope, and resource state as applicable. | AGENTS §§18,45 |
| `BR-AUTH-006` | Knowledge of a resource identifier is never sufficient authorization. | AGENTS §18 |
| `BR-AUTH-007` | Client-supplied identity or ownership information must not override authenticated server-side context. | AGENTS §45 |

## 3. Product scope rules

| ID | Rule | Source |
|---|---|---|
| `BR-SCP-001` | AI/ML functionality, terminology, scoring, ranking, recommendation, interview analysis, generated interview questions, matching, and AI-assisted rejection must not be introduced without an explicit approved requirement and architecture decision. | AGENTS §§0,56 |

## 4. Cross-domain ownership rules

| ID | Rule | Source |
|---|---|---|
| `BR-DOM-001` | Each business domain owns its data. | AGENTS §8 |
| `BR-DOM-002` | One domain must not directly modify another domain's data unless an approved architecture explicitly defines the operation. | AGENTS §8 |
| `BR-DOM-003` | No lifecycle may provide a generic reopen, force-status, or terminal-state reversal operation. A correction requires a separately approved use case with explicit actor, reason, authorization, audit, and transition. | `P1-OD-024` |

## 5. Organization rules

| ID | Rule | Source |
|---|---|---|
| `BR-ORG-001` | Recruiter permissions are scoped to an organization and do not grant access to every organization. | AGENTS §4 |
| `BR-ORG-002` | A recruiter belonging to Organization A must not access private recruitment data belonging to Organization B without separate authority. | AGENTS §18 |
| `BR-ORG-003` | Organization Admin and Platform Admin are distinct roles with distinct scopes. | AGENTS §§4-5 |
| `BR-ORG-004` | Organization owns organization membership, organization roles, and organization permissions. | AGENTS §7 |

## 6. Recruitment Planning rules

| ID | Rule | Source |
|---|---|---|
| `BR-REQ-001` | Recruitment Planning owns recruitment requests, hiring needs, requested headcount, approvals, and the Recruitment Request lifecycle. | AGENTS §7 |
| `BR-REQ-002` | Recruitment Request status must change only through an approved state machine; arbitrary status assignment is prohibited. | AGENTS §§10,15 |
| `BR-REQ-003` | Any organization-configurable approval step must be explicitly documented. | AGENTS §9 |
| `BR-REQ-004` | Every Recruitment Request transition must validate current state, operation, actor, permissions, and applicable business rules. | AGENTS §15 |
| `BR-REQ-005` | Recruitment Request approval is enabled by default and may be configured only per Organization through platform-marked configurable steps, supported sequential step counts, and fixed approver roles. Direct-user overrides, arbitrary approval graphs, and request/frontend bypasses are prohibited. | `P1-OD-001` |
| `BR-REQ-006` | A Recruitment Request approval or rejection requires a configured valid approver role; `RECRUITER` and `ORG_ADMIN` alone do not approve, and the Request creator cannot approve their own Request. | `P1-OD-022` |

## 7. Candidate rules

| ID | Rule | Source |
|---|---|---|
| `BR-CAN-001` | Candidate owns candidate profile data, skills, work experience, education, resume versions, and preferences. | AGENTS §7 |
| `BR-CAN-002` | A Candidate may manage only their own candidate profile and resume/CV versions unless separate authority is explicitly approved. | AGENTS §4 |
| `BR-CAN-003` | Resume/CV files used by applications must have stable versions. | AGENTS §17 |
| `BR-CAN-004` | Uploading a new resume version must not silently replace the resume associated with a historical application. | AGENTS §17 |
| `BR-CAN-005` | Updating Candidate Profile data must not silently change historical Application context. | AGENTS §16 |

## 8. Job rules

| ID | Rule | Source |
|---|---|---|
| `BR-JOB-001` | Job owns job openings, descriptions, requirements, publication, and Job lifecycle. | AGENTS §7 |
| `BR-JOB-002` | The defined Job transitions are `DRAFT -> OPEN`, `OPEN -> PAUSED`, `PAUSED -> OPEN`, `OPEN -> CLOSED`, `PAUSED -> CLOSED`, and `CLOSED -> ARCHIVED`. | AGENTS §11 |
| `BR-JOB-003` | `CLOSED` and `ARCHIVED` jobs must not accept new applications unless an approved requirement defines an exception. | AGENTS §11 |
| `BR-JOB-004` | Job lifecycle changes must use explicit business operations rather than unrestricted status assignment. | AGENTS §§15,41 |
| `BR-JOB-005` | Every Job transition must validate current state, operation, actor, permissions, and applicable business rules. | AGENTS §15 |

## 9. Application rules

| ID | Rule | Source |
|---|---|---|
| `BR-APP-001` | Application is a first-class domain and must not be hidden inside Job or Candidate. | AGENTS §§7,12 |
| `BR-APP-002` | Application owns application lifecycle, screening state, recruitment pipeline, rejection information, and application history. | AGENTS §7 |
| `BR-APP-003` | Application lifecycle changes must use explicit business operations and valid transitions; arbitrary status assignment is prohibited. | AGENTS §§12,15 |
| `BR-APP-004` | Concurrent duplicate active applications must be prevented; the exact duplicate key and active-status scope require approval under `P1-OD-039`. | AGENTS §§30,32,47,63 |
| `BR-APP-005` | Frontend clients must not directly control Application lifecycle state. | AGENTS §12 |
| `BR-APP-006` | An Application must retain the submitted resume version, required profile snapshot, and submission timestamp where required by the approved use case. | AGENTS §16 |
| `BR-APP-007` | A Candidate must never receive access to another candidate's private application data. | AGENTS §4 |
| `BR-APP-008` | Application logic must not directly modify private Interview persistence structures. | AGENTS §8 |
| `BR-APP-009` | Every Application transition must validate current state, operation, actor, permissions, and applicable business rules. | AGENTS §15 |

## 10. Interview rules

| ID | Rule | Source |
|---|---|---|
| `BR-INT-001` | Interview owns interview process, rounds, scheduling, assigned interviewers, feedback, scorecards, and Interview lifecycle. | AGENTS §7 |
| `BR-INT-002` | An Interviewer may access only assigned interviews unless broader permission is explicitly granted. | AGENTS §4 |
| `BR-INT-003` | An Interviewer may see only the minimum candidate/job information required for the assigned interview unless broader permission is explicitly granted. | AGENTS §4 |
| `BR-INT-004` | Interview completion and feedback completion are separate concepts. | AGENTS §13 |
| `BR-INT-005` | An interview may be completed while feedback is pending only when an approved business rule permits it. | AGENTS §13 |
| `BR-INT-006` | Interview logic must not directly modify Candidate profile records. | AGENTS §8 |
| `BR-INT-007` | Every Interview lifecycle transition must validate current state, operation, actor, permissions, and applicable business rules. | AGENTS §15 |

## 11. Offer rules

| ID | Rule | Source |
|---|---|---|
| `BR-OFF-001` | Offer owns offer approvals, sending, candidate response, lifecycle, and hiring-completion behavior related to offers. | AGENTS §7 |
| `BR-OFF-002` | A sent offer is not equivalent to an accepted offer. | AGENTS §14 |
| `BR-OFF-003` | Hiring completion must follow approved business rules and must not be inferred solely from an offer being sent. | AGENTS §14 |
| `BR-OFF-004` | Every Offer lifecycle transition must validate current state, operation, actor, permissions, and applicable business rules. | AGENTS §15 |
| `BR-OFF-005` | Retryable Offer operations must not silently create duplicate business outcomes. | AGENTS §33 |
| `BR-OFF-006` | Offer approval is enabled by default and may be configured only per Organization through platform-marked configurable steps and supported fixed approver roles. `RECRUITER` and `ORG_ADMIN` alone do not approve, and the Offer creator cannot approve their own Offer. Direct-user overrides, arbitrary graphs, and request/frontend bypasses are prohibited. | `P1-OD-001`, `P1-OD-022` |

## 12. Communication rules

| ID | Rule | Source |
|---|---|---|
| `BR-NOT-001` | Communication owns notification delivery, email, templates, and delivery history. | AGENTS §7 |
| `BR-NOT-002` | Communication must not own or make recruitment decisions. | AGENTS §§7-8 |
| `BR-NOT-003` | Notification is normally a side effect of a completed or committed business operation. | AGENTS §35 |
| `BR-NOT-004` | Notification delivery failure must not silently invalidate valid recruitment state unless an approved use case explicitly requires delivery as part of the operation. | AGENTS §35 |
| `BR-NOT-005` | Retryable notification delivery must be evaluated for duplicate side effects. | AGENTS §§33-35 |

## 13. Governance and history rules

| ID | Rule | Source |
|---|---|---|
| `BR-AUD-001` | Sensitive Platform Admin actions must be auditable. | AGENTS §4 |
| `BR-AUD-002` | Security- and business-critical recruitment actions must be evaluated for audit requirements. | AGENTS §36 |
| `BR-AUD-003` | Audit data should capture available actor, action, target, organization, timestamp, correlation/request identifier, and relevant metadata. | AGENTS §36 |
| `BR-AUD-004` | Passwords, tokens, secrets, and unnecessary sensitive information must never be written to audit/log records. | AGENTS §36 |
| `BR-AUD-005` | Business-significant recruitment history should be preserved through lifecycle state, archival, deactivation, or soft deletion rather than indiscriminate hard deletion. | AGENTS §37 |
| `BR-AUD-006` | Deleting or deactivating a user must not destroy required recruitment history. | AGENTS §37 |
| `BR-AUD-007` | Audit must record approval-policy changes; Recruitment Request and Offer approval/rejection; invitation creation, revocation, and acceptance; password reset/change; MFA enablement, disablement, and recovery; account lock/suspension; and privileged-account reactivation. Audit must not store passwords, OTP secrets, raw recovery codes, or raw reset tokens. | `P1-OD-001`, `022`, `067`–`069` |

## 14. Rule decisions still required

The following subjects intentionally have no rule yet because the governing source is
insufficient:

- approval chains and approver authority;
- exact Recruitment Request, Application, Interview, and Offer transition matrices;
- duplicate-application policy;
- requested-headcount allocation and concurrency;
- offer versioning, expiration, and acceptance/hiring coordination;
- mandatory Application snapshot fields;
- interview feedback/scorecard criteria and completion policy;
- audit-mandatory action list beyond sensitive Platform Admin actions;
- retention/deletion periods;
- notification channel and delivery SLA;
- remaining approval authority and lifecycle permissions.

Decision identifiers and detailed questions are maintained in the related product and
lifecycle documents.

## 15. Approval-closure dependencies

No rule is promoted by the approval-closure preparation alone. The proposal set and
impact analysis are centralized in
[`P1_APPROVAL_DECISIONS.md`](./P1_APPROVAL_DECISIONS.md).

| Rule area | Existing rule IDs | Decisions required before affected policy can be approved |
|---|---|---|
| Identity, role, tenant scope | `BR-AUTH-*`, `BR-ORG-*` | Role/Tenant baseline and identity/administration decisions `P1-OD-003`, `004`, `009`–`014`, `023`, `067`–`069` are approved; remaining lifecycle/authority dependencies are recorded by use case |
| Recruitment Request and headcount | `BR-REQ-*` | `P1-OD-001`, `022` are approved; `015`, `016`, `025`–`031`, `037`, `064`, `065` remain |
| Candidate history/retention | `BR-CAN-*` | `P1-OD-005`, `017`, `039`, `046` |
| Job policy beyond the defined matrix | `BR-JOB-*` | `P1-OD-006`, `016`, `032`–`037` |
| Application lifecycle and snapshots | `BR-APP-*` | `P1-OD-017`–`021`, `038`–`047`, `052`–`055`, `057`–`065` |
| Interview lifecycle and feedback | `BR-INT-*` | `P1-OD-019`, `048`–`056` |
| Offer, hiring, and reservation | `BR-OFF-*` | `P1-OD-001`, `022` are approved; `002`, `020`, `021`, `030`, `045`, `057`–`066` remain |
| Notification | `BR-NOT-*` | `P1-OD-006`, `007`, `056`, `061`, `066`, `070` |
| Audit, deletion, and retention | `BR-AUD-*` | `P1-OD-024`, `067`–`069` and selected audit behavior are approved; `005`, `008`, `041`, `052`, `058`, `062`, `070` remain |

Rules without a material open-decision dependency also remain `DRAFT` until the
authorized owner explicitly approves them; absence of a dependency is not approval.

## 16. Approved Role/Tenant and Permission/Authority rules

The following existing rules are `APPROVED` by `P1-OD-003`, `004`, `009`–`014`, and
`023`: `BR-AUTH-001`, `BR-AUTH-002`, `BR-AUTH-003`, `BR-AUTH-005`, and
`BR-ORG-001` through `BR-ORG-004`. Other pre-existing rules remain `DRAFT` unless
separately approved.

The approved decisions also establish these new stable rules:

| ID | Rule | Source | Status |
|---|---|---|---|
| `BR-AUTH-008` | Candidate is independent of Organization Membership. A User may own a Candidate Profile and separately hold staff memberships; staff authority never grants access to private Candidate data. | `P1-OD-003` | APPROVED |
| `BR-AUTH-009` | An Organization Membership may hold multiple roles. Effective permissions are the union of role permissions but remain constrained by organization, assignment, ownership, resource state, and business rules. | `P1-OD-009` | APPROVED |
| `BR-AUTH-010` | Initial organization roles are limited to `ORG_ADMIN`, `RECRUITER`, `HIRING_MANAGER`, and `INTERVIEWER`; custom organization roles are not supported. | `P1-OD-010` | APPROVED |
| `BR-AUTH-011` | Permissions are granted through roles only. Direct user grants, direct deny overrides, and ad-hoc membership permissions are not supported in initial scope. | `P1-OD-011` | APPROVED |
| `BR-AUTH-012` | Platform Admin cannot view tenant recruitment content or bypass tenant recruitment authorization; initial scope has no break-glass content access. | `P1-OD-014` | APPROVED |
| `BR-ORG-005` | Every private recruitment resource belongs to exactly one Organization in initial scope. Organization hierarchy, inherited tenant permissions, and shared cross-organization recruitment resources are not supported; backend queries enforce the tenant boundary. | `P1-OD-004` | APPROVED |
| `BR-ORG-006` | Privileged organization-role workflows must bootstrap the first Organization Admin, prevent removal/deactivation of the last admin without an atomic replacement, limit Platform Admin to bootstrap/recovery, and audit admin/privileged-role changes with actor, reason, and timestamp where applicable. | `P1-OD-012` | APPROVED |
| `BR-ORG-007` | Recruiter and Hiring Manager access is assignment-scoped by default; organization-wide access requires explicit role-derived permission. Reassignment requires recruitment-management authority and audit, and Platform Admin does not perform routine recruitment assignment. | `P1-OD-013` | APPROVED |
| `BR-ORG-008` | Organization Admin has no recruitment-content access by default and must hold an additional appropriate business role to participate in recruitment. | `P1-OD-023` | APPROVED |
| `BR-DOM-003` | No lifecycle may provide a generic reopen, force-status, or terminal-state reversal operation; corrections require a separately approved explicit and audited use case. | `P1-OD-024` | APPROVED |
| `BR-REQ-005` | Recruitment Request approval is default-enabled and tenant-configurable only through supported steps and fixed roles, without direct-user overrides, arbitrary graphs, or bypass. | `P1-OD-001` | APPROVED |
| `BR-REQ-006` | Request approval/rejection requires a valid configured role; Recruiter/Org Admin alone and the Request creator cannot approve. | `P1-OD-022` | APPROVED |
| `BR-OFF-006` | Offer approval is default-enabled and tenant-configurable only through supported steps and fixed approver roles; Recruiter/Org Admin alone and the Offer creator cannot approve. | `P1-OD-001`, `P1-OD-022` | APPROVED |
| `BR-AUD-007` | Approval configuration/actions, invitation lifecycle, authentication recovery/MFA, suspension, and privileged reactivation have the specified audit minimum and never log authentication secrets. | `P1-OD-001`, `022`, `067`–`069` | APPROVED |
| `BR-AUTH-013` | Candidate self-registration requires normalized unique verified email and grants no membership, organization role, or staff permission. Staff membership is created only by a tenant-bound, audited, single-use 72-hour invitation carrying fixed intended roles. | `P1-OD-067` | APPROVED |
| `BR-AUTH-014` | Password recovery uses verified email with secure single-use unlogged 15-minute reset tokens, non-enumerating public responses, five requests per account per hour, and session/refresh-token revocation after reset. | `P1-OD-068` | APPROVED |
| `BR-AUTH-015` | TOTP is the initial MFA method and is mandatory for Platform Admin and Organization Admin. Recovery codes are single-use hashes; peer Organization Admins cannot reset another user's authentication factor. | `P1-OD-068` | APPROVED |
| `BR-AUTH-016` | Platform Admin account authority is limited to account metadata, suspend/reactivate/deactivate, and approved recovery; it cannot impersonate, access tenant recruitment content, or alter organization membership/roles. Supported states are `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, and `DEACTIVATED`. | `P1-OD-069` | APPROVED |

The additionally approved pre-existing rules are `BR-AUTH-004`, `BR-AUTH-007`,
`BR-REQ-003`, `BR-OFF-004`, and `BR-AUD-001`, `BR-AUD-004`–`006`.

## 17. Final P1 approved lifecycle, workflow, and governance rules

| ID | Rule | Source | Status |
|---|---|---|---|
| `BR-REQ-007` | Recruitment Request begins `DRAFT`; approval follows the approved matrix; `REJECTED`, `CANCELLED`, and `CLOSED` are terminal. `APPROVED` becomes `IN_RECRUITMENT` only through opening a valid linked Job. | `P1-OD-015`, `016`, `025`–`031` | APPROVED |
| `BR-REQ-008` | Recruitment Request tracks requested, filled, and remaining headcount. Confirm-hire atomically enforces `filled <= requested`; `FILLED` means requested headcount is met. | `P1-OD-030`, `031` | APPROVED |
| `BR-JOB-006` | A Job has one Organization and recruitment owner. Only an assigned or role-derived broad-scope Recruiter may transition it; `OPEN` accepts applications, while `PAUSED`, `CLOSED`, and `ARCHIVED` do not. Publish, close, and archive are audited. | `P1-OD-032`–`037` | APPROVED |
| `BR-APP-010` | A Candidate may submit only for self to an `OPEN` Job. Initial scope permits one Application per Candidate+Job for all time, enforced by application logic and database concurrency protection. | `P1-OD-038`, `039`, `047` | APPROVED |
| `BR-APP-011` | An Application snapshot preserves the submitted resume version, recruitment identity/contact, answers, consent/terms version, and submission time; later Candidate changes do not rewrite it. | `P1-OD-017`, `046` | APPROVED |
| `BR-APP-012` | Application transitions follow the approved matrix; `REJECTED`, `WITHDRAWN`, and `HIRED` are terminal. Rejection records actor, timestamp, and reason. | `P1-OD-038`, `040`, `041` | APPROVED |
| `BR-APP-013` | Interview outcome/readiness enables an authorized Application decision but never directly mutates Application persistence. `OFFER_PENDING` is internal preparation; `OFFERED` means an approved Offer was sent. | `P1-OD-019`, `043`, `044` | APPROVED |
| `BR-APP-014` | Application reaches `HIRED` only once through idempotent confirm-hire after accepted Offer and atomic headcount validation. | `P1-OD-002`, `018`, `045`, `064`, `065` | APPROVED |
| `BR-INT-008` | Interview lifecycle follows the approved matrix; Recruiter schedules/cancels/no-shows, participants confirm, and assigned lead/Recruiter starts/completes. Reschedule retains history. | `P1-OD-048`–`051`, `056` | APPROVED |
| `BR-INT-009` | Rounds are sequential by default; supported parallel rounds require ordering/group metadata. Time is stored as instant plus source time zone; provider integration is outside initial scope. | `P1-OD-051`, `056` | APPROVED |
| `BR-INT-010` | Submitted feedback and scorecards use the platform-defined initial template, are visible only in authorized assignment scope, lock at submission, and cannot be edited in initial scope. | `P1-OD-052`, `053` | APPROVED |
| `BR-INT-011` | Interview may complete with pending feedback, but Application progression waits for required feedback/scorecards unless an authorized audited override applies. | `P1-OD-054`, `055` | APPROVED |
| `BR-OFF-007` | Offer follows the approved matrix and is associated with exactly one eligible Application. Approved/sent content is immutable; material change creates a new version and resets approval. | `P1-OD-057`, `059`, `060` | APPROVED |
| `BR-OFF-008` | A sent Offer has a 14-day expiry from send, with instant/source time zone. Authorized pre-expiry extension is audited and creates a new version/reapproval. | `P1-OD-061` | APPROVED |
| `BR-OFF-009` | Candidate may accept or decline only their own sent unexpired Offer. Acceptance is idempotent; candidate response is terminal and post-acceptance rescission is outside initial scope. | `P1-OD-063` | APPROVED |
| `BR-OFF-010` | Assigned authorized Recruiter may withdraw an Offer before acceptance with reason. | `P1-OD-062` | APPROVED |
| `BR-OFF-011` | No headcount is reserved at `OFFERED`. Confirm-hire atomically consumes capacity only when Application transitions to `HIRED`; over-hire is rejected. | `P1-OD-030`, `064`, `065` | APPROVED |
| `BR-OFF-012` | Offer outcomes coordinate with Application and Recruitment Planning through explicit commands/events; the P3 architecture selects the technical mechanism. | `P1-OD-020`, `021` | APPROVED |
| `BR-NOT-006` | Initial notification channels are email and, when present, in-app. SMS and external recruitment integrations are out of scope. Delivery is at-least-once/idempotent and never rolls back committed recruitment state. | `P1-OD-006`, `007`, `066` | APPROVED |
| `BR-NOT-007` | Notification history is self-scoped for Candidate, organization/resource-scoped for authorized staff, and platform-metadata-only for Platform Admin. | `P1-OD-070` | APPROVED |
| `BR-AUD-008` | Mandatory audit includes privileged role/membership changes, approvals, Job publication/closure/archive, Application shortlist/reject/withdraw, Interview schedule/reschedule/cancel/feedback, Offer actions, hiring, and authentication/account lifecycle. | `P1-OD-008` | APPROVED |
| `BR-AUD-009` | Recruitment/audit history is not hard-deleted by normal business workflow. Soft deletion, archive, or anonymization may apply subject to legal retention, export, and hold obligations. | `P1-OD-005` | APPROVED — EXTERNAL_POLICY_PENDING |

All **100 / 100** stable P1 rules are individually `APPROVED`. `BR-AUD-009` has an
approved principle but its jurisdiction, retention duration, legal-hold, and deletion
parameters remain `EXTERNAL_POLICY_PENDING`; it does not authorize a fixed period.

