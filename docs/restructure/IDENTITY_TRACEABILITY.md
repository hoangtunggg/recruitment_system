# P7 Identity Traceability

**Status:** IMPLEMENTATION_EVIDENCE

| Requirement | BR / UC | Security / permission | API/code | Test/evidence |
|---|---|---|---|---|
| Registration, verification, login, session | `BR-AUTH-001`, `004`, `013`; `UC-AUTH-001`, `005` | `P7-ID-BLK-001`–`003` | `identity.service.ts`, `identity.controller.ts`, entities/migration | Password characterization and foundation tests; DB validation pending |
| Credential reset | `BR-AUTH-014`; `UC-AUTH-003` | `P7-ID-BLK-001`, `003` | `IdentityService.confirmPasswordReset` | Unit implementation; DB token race pending |
| MFA/recovery | `BR-AUTH-015`; `UC-AUTH-003` | `P7-ID-BLK-004` | `totp.ts`, `mfa.service.ts`, recovery entity | `identity-security.spec.ts`, `mfa.service.spec.ts` |
| Account lifecycle | `BR-AUTH-016`; `UC-AUTH-004` | Platform account lifecycle boundary | `account-lifecycle.service.ts` | `account-lifecycle.spec.ts`; Organization invariant pending |
| Invitation identity binding | `BR-AUTH-010`, `013`; `UC-AUTH-006` | Identity/Organization contract | `invitation-identity.service.ts`, Organization ports | `organization-identity-ports.spec.ts`; runtime pending |
| Tenant/platform boundary | `BR-AUTH-005`, `006`, `012` | no tenant-content bypass | `authorization.ts` | foundation authorization test |

All rows have target code/unit evidence. PostgreSQL concurrency, KMS deployment and
Organization runtime/E2E are `PENDING_INTEGRATION_VALIDATION`; they do not negate
implementation evidence or transfer Organization ownership.
