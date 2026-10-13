# P7 Identity Characterization Matrix

**Status:** IMPLEMENTATION_EVIDENCE

| Behavior | Current/target classification | Authority/evidence |
|---|---|---|
| Password hashing | INTENTIONAL_CHANGE | `P7-ID-BLK-001`: Argon2id target policy replaces legacy hash uncertainty. |
| Email verification | INTENTIONAL_CHANGE | `P7-ID-BLK-002`: opaque hashed 24-hour, single-use target token. |
| Access/refresh session | INTENTIONAL_CHANGE | `P7-ID-BLK-003`: ES256/opaque rotating family target model. |
| Logout/revocation | TARGET_NEW | Target session-family revocation boundary. |
| MFA/TOTP | INTENTIONAL_CHANGE | `P7-ID-BLK-004`: encrypted SHA-256 TOTP and hashed recovery codes. |
| Account lifecycle | TARGET_NEW | Explicit suspend/reactivate/deactivate; no generic patch. |
| Organization membership/roles | PRESERVED_BOUNDARY | Organization remains owner; target Identity only uses public ports. |

Legacy remains active. Runtime/data comparison is `PENDING_INTEGRATION_VALIDATION`.
