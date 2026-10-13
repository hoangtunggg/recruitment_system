# Domain Glossary

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Source:** `AGENTS.md` §§0, 4-18

The terms below are canonical within this draft. New documents should not introduce a
synonym for a listed term without an approved terminology change.

| Term | Definition | Notes/open boundary |
|---|---|---|
| User | Authenticated identity owning credentials and sessions. | Not a business role. |
| Organization | Strict logical tenant/business context within which recruitment staff operate; each private recruitment resource belongs to exactly one Organization in initial scope. | Organization hierarchy, inherited tenant permission, and shared cross-organization recruitment resources are not supported. |
| Organization Membership | Association between a User and an Organization through which organization roles and permissions are evaluated. | A membership may hold multiple fixed roles; membership lifecycle remains undefined. |
| Role | Named collection of business authority in a scope. Initial organization roles are `ORG_ADMIN`, `RECRUITER`, `HIRING_MANAGER`, and `INTERVIEWER`. | Platform and organization roles are distinct; custom organization roles are not supported initially. |
| Permission | Specific role-derived authorization capability evaluated with organization, assignment, ownership, and state. | Direct user grant/deny and ad-hoc membership permissions are not supported initially. |
| Candidate | Organization-independent applicant represented by a candidate profile and participating in applications, interviews, and offers. | The same User may separately hold staff memberships; those contexts grant no access to private Candidate data. |
| Candidate Profile | Candidate's current information, such as skills, experience, education, and preferences. | It is not the historical application snapshot. |
| Resume / CV | Candidate-provided career document managed as stable versions. | A historical application references the submitted version. |
| Resume Version | Immutable/stable version of a resume used for traceable submissions. | Replacement/retention rules remain undefined. |
| Recruitment Need | Business demand that motivates a recruitment request. | Whether represented as a separate persisted resource is undecided. |
| Recruitment Request | Controlled request for hiring capacity/position requirements and approval. | Owned by Recruitment Planning. |
| Requested Headcount | Number of hires requested by a recruitment request. | Allocation/decrement/concurrency rules remain undefined. |
| Approval | Decision step allowing or rejecting continuation of a controlled workflow. | Optionality and approver chain are configurable but undefined. |
| Job | Recruitable opening/job description and requirements derived from an approved hiring context. | Relationship/cardinality to Recruitment Request is undecided. |
| Job Publication | Making an OPEN job discoverable to eligible candidates. | Channel and scheduling rules remain undefined. |
| Application | First-class record of a candidate applying to a specific job, including lifecycle and historical submission context. | Must not be hidden inside Job or Candidate. |
| Application Snapshot | Historical candidate/profile information retained for a specific application. | Required fields are undecided. |
| Screening | Review stage following application submission. | Detailed criteria and assignment rules remain undefined. |
| Shortlisting | Explicit decision to advance an application from screening toward interviews. | Requires an authorized business action. |
| Rejection | Explicit terminal/non-advancing application decision with retained history. | Reason requirements and reversibility are undecided. |
| Recruitment Pipeline | Ordered business progression of an application through screening, interview, offer, and hiring outcomes. | Organization configurability is undecided. |
| Interview | Scheduled evaluation activity associated with a recruitment process. | Owned by Interview domain. |
| Interview Round | A stage/grouping within an interview process. | Number and types are undefined. |
| Interview Assignment | Association granting an Interviewer access to a specific interview. | Does not grant general application access. |
| Interview Feedback | Qualitative evaluation submitted for an assigned interview. | Completion rules remain undefined. |
| Scorecard | Structured interview evaluation submitted by an authorized interviewer. | Criteria/scales remain undefined; no AI scoring is allowed. |
| Hiring Decision | Human-authorized decision concerning progression/hiring. | Decision authority and quorum remain undefined. |
| Offer | Controlled employment proposal with approval, sending, response, and lifecycle history. | A sent offer is not an accepted offer. |
| Hire | Recruitment outcome reached according to approved offer/hiring rules. | Exact completion event remains `P1-OD-002`. |
| Notification | Communication side effect informing a recipient of an event or required action. | Does not make recruitment decisions. |
| Delivery History | Record of notification attempts/outcomes. | Required retention and retry guarantees are undefined. |
| Audit Record | Durable trace of a security- or business-critical action. | Mandatory action set remains `P1-OD-008`. |
| Resource Scope | Organization, ownership, assignment, and state boundaries within which an action may be authorized. | A resource ID alone never establishes scope. |
| Lifecycle | Defined statuses and permitted business transitions for a resource. | Direct arbitrary status assignment is prohibited. |
| Business Operation | Named action that validates actor, permission, resource state, rules, and side effects before changing state. | Preferred over generic status updates. |

## Terms not permitted in current product scope

AI scoring, AI ranking, AI matching, AI recommendation, AI interview analysis, RAG,
embedding, LLM, and AI-generated interview questions are not current product concepts.

