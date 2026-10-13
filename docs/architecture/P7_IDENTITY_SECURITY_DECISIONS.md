# P7 Identity Security Decisions

**Status:** APPROVED  
**Approval authority:** explicit user approval, 2026-10-06  
**Scope:** P7 Identity security parameters only. This record does not authorize a
cutover, alter legacy runtime behavior, or assign Organization responsibilities to
Identity.

## 1. Decision register

| Blocker | Approved decision | Status |
|---|---|---|
| `P7-ID-BLK-001` | Password acceptance, storage, breached-password handling and throttling baseline | RESOLVED |
| `P7-ID-BLK-002` | Email-verification challenge baseline | RESOLVED |
| `P7-ID-BLK-003` | Access/refresh token and signing-key baseline | RESOLVED |
| `P7-ID-BLK-004` | TOTP/MFA/recovery-secret baseline | RESOLVED |

These decisions preserve `P1-OD-067`–`069`: candidate registration creates neither
membership nor staff authority; reset is non-enumerating, single-use and 15 minutes;
MFA is mandatory for Platform Admin and Org Admin; Platform Admin does not impersonate
or alter organization membership/roles.

## 2. `P7-ID-BLK-001` — password baseline

| Parameter | Approved baseline |
|---|---|
| Acceptance | Accept 15–128 Unicode characters. Do not impose composition rules and do not truncate input. |
| Composition | No mandatory upper/lower/digit/symbol composition rule. |
| Breached/common passwords | Reject passwords found in a breached/common-password list. Use a privacy-preserving lookup or local fallback. If an external provider is unavailable, do not silently weaken the policy; emit an operational event and follow the documented fallback. |
| Storage | Argon2id: memory 19 MiB (19,456 KiB), iterations 2, parallelism 1, unique random salt, with algorithm/parameters encoded in the stored hash. |
| Login abuse protection | Apply progressive throttling and temporary lock behavior using both account and source limits, with enumeration-resistant responses. Exact thresholds are deployment configuration, not a new product rule. |
| Session effect | Password change and password reset revoke sessions as required by the approved session policy. |

Password history, arbitrary password normalization, permanent lockout, and a specific
throttling threshold are not asserted by this record.

## 3. `P7-ID-BLK-002` — email-verification challenge baseline

| Parameter | Approved baseline |
|---|---|
| Generation/storage | Use an opaque random 256-bit value and store its hash only. Never log or audit the raw value. |
| Expiry | 24 hours from issue. |
| Single use/replay | Atomic conditional consume. Consumed, expired, superseded or unknown values return safe generic verification failure. |
| Resend | A resend invalidates the preceding challenge. Enforce a 60-second cooldown and at most five resends per email per hour, while preserving non-enumerating behavior. |
| State | Only valid verification transitions `PENDING_VERIFICATION` to `ACTIVE`. |
| Audit | Audit the action with safe metadata only; no raw token is recorded. |

## 4. `P7-ID-BLK-003` — access, refresh, session and signing-key baseline

### Access token

| Parameter | Approved baseline |
|---|---|
| Format/algorithm | ES256 JWT, signed with an asymmetric key held in KMS or a managed secret manager. No signing key may be in source. |
| Lifetime and header | Ten-minute lifetime and a `kid` header. |
| Required claims | `iss`, `aud`, `sub`, `iat`, `exp`, and `jti`. |
| Excluded claims | No organization membership, organization role, permission, assignment or client-selected tenant claim. |

### Refresh token/session

| Parameter | Approved baseline |
|---|---|
| Format/storage | Use an opaque, non-JWT refresh token and store only a safe hash plus session-family metadata. |
| Lifetime | 30-day absolute and 7-day inactivity lifetime, whichever occurs first. |
| Rotation/replay | Rotate every refresh. Conditional consume creates successor in one transaction. Reuse of a consumed token revokes the entire family, audits, and requires re-authentication. |
| Revocation | Logout revokes the current family. Password reset, privileged recovery, and privileged MFA disable revoke all sessions and require login again. |

### Signing-key lifecycle

| Parameter | Approved baseline |
|---|---|
| Ownership/storage | Security/Platform deployment owner maintains asymmetric keys in KMS/HSM or managed secret manager. Identity receives key reference, active `kid`, verification set. |
| Rotation | Rotate at most every 90 days. Retain prior verification capability only while an already issued access token may remain valid, and never issue new tokens under the retired key. |
| Emergency response | Provide emergency key revoke/rotate and incident-handling procedures. |

## 5. `P7-ID-BLK-004` — MFA, recovery and secret protection baseline

| Parameter | Recommended baseline |
|---|---|
| Mandatory actors | MFA is required for Platform Admin and Org Admin. It does not grant tenant recruitment-content access. |
| TOTP | RFC 6238 TOTP using SHA-256, 6 digits, a 30-second step, and at most ±1 step. Replay prevention is required for security-sensitive actions where the implementation can enforce it. A client incompatibility with SHA-256 requires a new security decision; it does not authorize a silent switch to SHA-1. |
| Secret protection | Generate the secret with a CSPRNG. Store it envelope-encrypted at rest using a KMS/managed-secret-manager key that is separate from the database. |
| Recovery codes | Issue ten codes, display plaintext only once, store only an Argon2id or already approved secure hash, and invalidate all earlier codes when regenerating. |
| Disable and lost factor | MFA disable requires an authenticated session plus current MFA proof, or controlled Identity recovery. No peer Org Admin may disable another user's MFA. Controlled recovery must not alter membership or roles and must not impersonate the user. |
| Session effect | Reset, privileged recovery, and privileged MFA disable revoke sessions and require a new login. |
| Audit | Audit enrollment, disable, recovery, code regeneration/use, and privileged enforcement without recording secrets, OTPs, recovery codes, passwords, or tokens. |

KMS provider, key identifier, access policy, and rotation implementation are deployment
parameters. They must meet this baseline and are not authorization to weaken it.

## 6. Approval traceability

| Decision | Approved P1 requirements affected | P7 target concern | Status |
|---|---|---|---|
| `P7-ID-BLK-001` | `UC-AUTH-001`, `UC-AUTH-003`, `BR-AUTH-004`, `BR-AUD-004` | Credential acceptance/storage, login protection, session invalidation | Planned; no source implemented |
| `P7-ID-BLK-002` | `UC-AUTH-005`, `BR-AUTH-008`, `BR-AUTH-013`, `BR-AUD-007` | Candidate verification without membership grant | Planned; no source implemented |
| `P7-ID-BLK-003` | `UC-AUTH-001`–`003`, `BR-AUTH-001`, `BR-AUTH-004`, `BR-AUTH-006`, `BR-AUD-004` | Server-derived identity, sessions, revocation and strict tenant authorization | Planned; no source implemented |
| `P7-ID-BLK-004` | `UC-AUTH-003`, `UC-AUTH-004`, `BR-AUTH-015`, `BR-AUTH-016`, `BR-AUD-004`, `BR-AUD-007` | MFA and controlled account recovery without Organization-role changes | Planned; no source implemented |

## 7. Consistency and evidence

The approved baseline creates no global User role, direct permission grant, candidate-to-
membership conversion, tenant-content bypass, Platform Admin impersonation, or self-
escalation. It preserves Organization ownership of membership/roles and last-Org-Admin
safeguards. No conflict with approved P1/P3 source was found.

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) supports length/blocklist over composition rules and generic recovery/throttling principles.
- [RFC 9700](https://datatracker.ietf.org/doc/rfc9700/) supports refresh rotation/replay detection and audience restriction.
- [RFC 6238](https://datatracker.ietf.org/doc/rfc6238/) specifies TOTP and recommends a 30-second default period.
