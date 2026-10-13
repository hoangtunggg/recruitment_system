# P1 Business Traceability Matrix

**Status:** APPROVED  
**Last updated:** 2026-10-05  
**Scope:** P1 requirement-to-rule-to-use-case traceability only

## 1. Purpose and limits

This matrix verifies that every business rule defined in
[`BUSINESS_RULES.md`](./BUSINESS_RULES.md) is traceable to an explicit requirement
source and to either a cataloged use case or a clearly identified cross-cutting
coverage boundary.

P1 does not establish code or test traceability. Those links remain `NOT_STARTED`
until the relevant architecture, migration, and implementation phases. A mapping to
`all protected use cases` or a domain-wide use-case family means that the rule is an
invariant evaluated wherever that boundary applies; it does not create an unstated
business operation.

## 2. Identity, authorization, and product scope

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-AUTH-001` | AGENTS §5 | `UC-AUTH-001`, `UC-AUTH-002` | MAPPED |
| `BR-AUTH-002` | AGENTS §§5,18 | `UC-ORG-003`, `UC-ORG-004`, `UC-ORG-005` | MAPPED; role-composition policy remains open |
| `BR-AUTH-003` | AGENTS §5 | `UC-AUD-002`, `UC-AUTH-004`, `UC-ORG-006` | MAPPED |
| `BR-AUTH-004` | `P1-OD-001`, `024`, `067`–`069` | All protected use cases | APPROVED CROSS-CUTTING |
| `BR-AUTH-005` | AGENTS §§18,45 | Protected use cases that read or mutate scoped resources | CROSS-CUTTING |
| `BR-AUTH-006` | AGENTS §18 | All identifier-based protected resource access | CROSS-CUTTING |
| `BR-AUTH-007` | `P1-OD-068` | `UC-AUTH-003` and all operations accepting identity/ownership input | APPROVED CROSS-CUTTING |
| `BR-AUTH-008` | `P1-OD-003` | Candidate use cases plus staff-role operations for the same User | APPROVED CROSS-CONTEXT BOUNDARY |
| `BR-AUTH-009` | `P1-OD-009` | `UC-ORG-003`–`005` and all multi-role authorization decisions | APPROVED |
| `BR-AUTH-010` | `P1-OD-010` | `UC-ORG-004`, `UC-ORG-005` | APPROVED |
| `BR-AUTH-011` | `P1-OD-011` | `UC-ORG-004`, `UC-ORG-005` | APPROVED |
| `BR-AUTH-012` | `P1-OD-014` | `UC-AUTH-004`, `UC-ORG-006`, `UC-AUD-002` and all tenant-content access | APPROVED SCOPE DENIAL |
| `BR-AUTH-013` | `P1-OD-067` | `UC-AUTH-005`, `UC-AUTH-006`, `UC-ORG-002` | APPROVED |
| `BR-AUTH-014` | `P1-OD-068` | `UC-AUTH-003` | APPROVED |
| `BR-AUTH-015` | `P1-OD-068` | `UC-AUTH-003` | APPROVED |
| `BR-AUTH-016` | `P1-OD-069` | `UC-AUTH-004` | APPROVED SCOPE LIMIT |
| `BR-SCP-001` | AGENTS §§0,56 | Entire use-case catalog | SCOPE GATE; AI/ML remains out of scope |

## 3. Domain ownership and organization

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-DOM-001` | AGENTS §8 | All domain use-case families | CROSS-CUTTING |
| `BR-DOM-002` | AGENTS §8 | All cross-domain use cases | CROSS-CUTTING |
| `BR-DOM-003` | `P1-OD-024` | All lifecycle terminal/correction operations | APPROVED SCOPE LIMIT |
| `BR-ORG-001` | AGENTS §4 | `UC-ORG-*` and recruiter operations in organization scope | CROSS-CUTTING |
| `BR-ORG-002` | AGENTS §18 | `UC-APP-003` and all private organization-resource reads | CROSS-CUTTING |
| `BR-ORG-003` | AGENTS §§4-5 | `UC-ORG-001`, `UC-ORG-006` | MAPPED |
| `BR-ORG-004` | AGENTS §7 | `UC-ORG-001` through `UC-ORG-005` | MAPPED |
| `BR-ORG-005` | `P1-OD-004` | Every private organization-scoped use case | APPROVED TENANT INVARIANT |
| `BR-ORG-006` | `P1-OD-012` | `UC-ORG-004`, `UC-ORG-006`, privileged-role audit | APPROVED |
| `BR-ORG-007` | `P1-OD-013` | `UC-APP-003` and assigned/broad-scope recruitment operations | APPROVED |
| `BR-ORG-008` | `P1-OD-023` | `UC-ORG-001`–`005` and protected recruitment-content reads | APPROVED SCOPE DENIAL |

## 4. Recruitment Request

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-REQ-001` | AGENTS §7 | `UC-REQ-001`, `UC-REQ-002`, `UC-REQ-006` through `UC-REQ-009` | MAPPED |
| `BR-REQ-002` | AGENTS §§10,15 | `UC-REQ-003` through `UC-REQ-009` | NEEDS POLICY; transition matrix is unresolved |
| `BR-REQ-003` | `P1-OD-001` | `UC-REQ-003`, `UC-REQ-004`, `UC-REQ-005` | APPROVED; exact lifecycle matrix remains unresolved |
| `BR-REQ-004` | AGENTS §15 | Every Recruitment Request transition use case, `UC-REQ-003` through `UC-REQ-009` | CROSS-CUTTING TRANSITION GUARD |
| `BR-REQ-005` | `P1-OD-001` | `UC-REQ-003`–`005` | APPROVED |
| `BR-REQ-006` | `P1-OD-022` | `UC-REQ-004`, `UC-REQ-005` | APPROVED |

## 5. Candidate

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-CAN-001` | AGENTS §7 | `UC-CAN-001`, `UC-CAN-002` | MAPPED |
| `BR-CAN-002` | AGENTS §4 | `UC-CAN-001` through `UC-CAN-004` | MAPPED |
| `BR-CAN-003` | AGENTS §17 | `UC-CAN-003`, `UC-CAN-004`, `UC-CAN-005` | MAPPED |
| `BR-CAN-004` | AGENTS §17 | `UC-CAN-003`, `UC-CAN-005` | MAPPED |
| `BR-CAN-005` | AGENTS §16 | `UC-CAN-002` | MAPPED |

## 6. Job

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-JOB-001` | AGENTS §7 | `UC-JOB-001`, `UC-JOB-007`, `UC-JOB-008` | MAPPED |
| `BR-JOB-002` | AGENTS §11 | `UC-JOB-002` through `UC-JOB-006` | MAPPED |
| `BR-JOB-003` | AGENTS §11 | `UC-APP-001`, `UC-JOB-007`, `UC-JOB-008` | MAPPED |
| `BR-JOB-004` | AGENTS §§15,41 | `UC-JOB-002` through `UC-JOB-006` | MAPPED |
| `BR-JOB-005` | AGENTS §15 | Every Job transition use case, `UC-JOB-002` through `UC-JOB-006` | CROSS-CUTTING TRANSITION GUARD |

## 7. Application

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-APP-001` | AGENTS §§7,12 | `UC-APP-001` | MAPPED |
| `BR-APP-002` | AGENTS §7 | Entire `UC-APP-*` family | DOMAIN OWNERSHIP |
| `BR-APP-003` | AGENTS §§12,15 | `UC-APP-001`, `UC-APP-004` through `UC-APP-010` | NEEDS POLICY; transition matrix is unresolved |
| `BR-APP-004` | AGENTS §§30,32,47,63 | `UC-APP-001` | NEEDS POLICY; duplicate key and active-status scope require `P1-OD-039` |
| `BR-APP-005` | AGENTS §12 | Every Application transition use case, `UC-APP-004` through `UC-APP-010` | CROSS-CUTTING CLIENT BOUNDARY |
| `BR-APP-006` | AGENTS §16 | `UC-APP-001` | NEEDS POLICY; mandatory snapshot fields are unresolved |
| `BR-APP-007` | AGENTS §4 | `UC-APP-002`, `UC-APP-003`, `UC-APP-009` | MAPPED |
| `BR-APP-008` | AGENTS §8 | `UC-APP-007` | MAPPED |
| `BR-APP-009` | AGENTS §15 | `UC-APP-004` through `UC-APP-010` | CROSS-CUTTING TRANSITION GUARD |

## 8. Interview

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-INT-001` | AGENTS §7 | `UC-INT-001`, `UC-INT-002`, `UC-INT-003` and the remaining `UC-INT-*` lifecycle operations | DOMAIN OWNERSHIP |
| `BR-INT-002` | AGENTS §4 | `UC-INT-003`, `UC-INT-004`, `UC-INT-010`, `UC-INT-011` | MAPPED |
| `BR-INT-003` | AGENTS §4 | `UC-INT-004`, `UC-INT-010`, `UC-INT-011` | MAPPED |
| `BR-INT-004` | AGENTS §13 | `UC-INT-007`, `UC-INT-010`, `UC-INT-011` | MAPPED |
| `BR-INT-005` | AGENTS §13 | `UC-INT-007` | NEEDS POLICY; completion-with-pending-feedback rule is unresolved |
| `BR-INT-006` | AGENTS §8 | Entire `UC-INT-*` family where Candidate data is referenced | CROSS-DOMAIN BOUNDARY |
| `BR-INT-007` | AGENTS §15 | `UC-INT-001`, `UC-INT-002`, `UC-INT-005` through `UC-INT-009` | CROSS-CUTTING TRANSITION GUARD |

## 9. Offer

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-OFF-001` | AGENTS §7 | `UC-APP-008`, `UC-OFF-001`, `UC-OFF-002` and the remaining `UC-OFF-*` lifecycle operations | DOMAIN OWNERSHIP |
| `BR-OFF-002` | AGENTS §14 | `UC-OFF-005`, `UC-OFF-006`, `UC-OFF-007` | MAPPED |
| `BR-OFF-003` | AGENTS §14 | `UC-APP-010`, `UC-OFF-006` | NEEDS POLICY; hiring-completion coordination is unresolved |
| `BR-OFF-004` | `P1-OD-001`, `022` | `UC-OFF-001` through `UC-OFF-009` | APPROVED CROSS-CUTTING TRANSITION GUARD |
| `BR-OFF-005` | AGENTS §33 | `UC-OFF-005`, `UC-OFF-006` | MAPPED |
| `BR-OFF-006` | `P1-OD-001`, `P1-OD-022` | `UC-OFF-002`–`004` | APPROVED; exact lifecycle matrix remains unresolved |

## 10. Communication

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-NOT-001` | AGENTS §7 | `UC-NOT-001`, `UC-NOT-003` | MAPPED |
| `BR-NOT-002` | AGENTS §§7-8 | `UC-NOT-001` | MAPPED |
| `BR-NOT-003` | AGENTS §35 | `UC-NOT-001` | MAPPED |
| `BR-NOT-004` | AGENTS §35 | `UC-NOT-002` | NEEDS POLICY; delivery-critical exceptions are unresolved |
| `BR-NOT-005` | AGENTS §§33-35 | `UC-NOT-002` | MAPPED |

## 11. Governance, audit, and history

| Rule ID | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-AUD-001` | `P1-OD-069` | `UC-AUD-001`, `UC-AUD-002`, `UC-AUTH-004`, `UC-ORG-006` | APPROVED |
| `BR-AUD-002` | AGENTS §36 | Security- and business-critical mutating use cases across all domains | NEEDS POLICY; mandatory audit-action list is unresolved |
| `BR-AUD-003` | AGENTS §36 | `UC-AUD-001` | MAPPED |
| `BR-AUD-004` | `P1-OD-068` | `UC-AUD-001`, `UC-AUTH-003` | APPROVED |
| `BR-AUD-005` | `P1-OD-069` | `UC-AUTH-004` account deactivation; retention/anonymization remains unresolved | APPROVED LIMITED SCOPE |
| `BR-AUD-006` | `P1-OD-069` | `UC-AUTH-004` | APPROVED LIMITED SCOPE |
| `BR-AUD-007` | `P1-OD-001`, `022`, `067`–`069` | Approval configuration/actions, invitation lifecycle, and `UC-AUTH-003`–`006` | APPROVED |

## 12. Final P1 closure mappings

| Rule IDs | Requirement source | Use-case coverage | P1 status |
|---|---|---|---|
| `BR-REQ-007`–`008` | `P1-OD-015`, `016`, `025`–`031` | `UC-REQ-001`–`009` | APPROVED |
| `BR-JOB-006` | `P1-OD-032`–`037` | `UC-JOB-001`–`008` | APPROVED |
| `BR-APP-010`–`014` | `P1-OD-017`, `018`, `038`–`047` | `UC-APP-001`–`010` | APPROVED |
| `BR-INT-008`–`011` | `P1-OD-019`, `048`–`056` | `UC-INT-001`–`011` | APPROVED |
| `BR-OFF-007`–`012` | `P1-OD-002`, `020`, `021`, `057`–`065` | `UC-OFF-001`–`009`, `UC-APP-010`, `UC-REQ-007` | APPROVED |
| `BR-NOT-006`–`007` | `P1-OD-006`, `007`, `066`, `070` | `UC-NOT-001`–`003` | APPROVED |
| `BR-AUD-008` | `P1-OD-008` | `UC-AUD-001` and governed mutation families | APPROVED |
| `BR-AUD-009` | `P1-OD-005` | archive/deactivate/anonymization and `UC-CAN-005`, `UC-AUTH-004` | APPROVED — EXTERNAL_POLICY_PENDING |

## 13. Coverage result

- Business rules defined: **100**.
- Business rules represented in this matrix: **100**.
- P1 requirement-to-rule-to-use-case/concept coverage: **100 / 100**.
- Individually approved rules: **100**.
- Remaining DRAFT rules: **0**.
- Code traceability: **NOT_STARTED** (outside P1).
- Test traceability: **NOT_STARTED** (outside P1).
- Open policy questions remain governed by the `P1-OD-*` records in the source
  product, permission, lifecycle, and use-case documents.
- Consolidated approval options, recommendations, impacts, and affected IDs are in
  [`P1_APPROVAL_DECISIONS.md`](./P1_APPROVAL_DECISIONS.md); recommendations do not
  close a decision.

