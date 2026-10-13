# P7 Identity–Organization Invitation Acceptance Contract

**Status:** RESOLVED_FOR_IDENTITY_DESIGN  
**Scope:** published in-process contract specification only. It creates no Organization
logic, persistence, membership, role, route, or runtime behavior.

## 1. Ownership

Identity owns User identity, normalized verified email, credentials, authentication
state and sessions. Organization owns invitation business state, Organization
Membership, organization roles and tenant membership lifecycle. Identity must never
write Organization tables or assign organization roles.

## 2. Published Organization port

```text
OrganizationInvitationAcceptancePort
  validateForIdentityAcceptance(input) -> InvitationAcceptanceContext | InvitationError
  confirmIdentityAndCreateMembership(input, transaction) -> InvitationAcceptanceResult | InvitationError
```

### `validateForIdentityAcceptance`

Input: `invitationToken`, `normalizedEmail`, `idempotencyKey`, `correlationId`.

Output: `invitationId`, `organizationId`, `expectedInvitationVersion`,
`normalizedEmail`, `expiresAt`. Intended roles remain Organization-private and are not
an Identity authorization input.

Errors: `INVITATION_INVALID`, `INVITATION_EXPIRED`, `INVITATION_REVOKED`,
`INVITATION_ALREADY_USED`, `INVITATION_EMAIL_MISMATCH`, `INVITATION_CONFLICT`.
Public adapters map these without exposing invitation/organization existence.

### `confirmIdentityAndCreateMembership`

Input: `invitationId`, `expectedInvitationVersion`, `userId`, `normalizedEmail`,
`idempotencyKey`, `correlationId`, and caller-provided local transaction context.

Output: `organizationId`, `membershipId`, `alreadyAccepted`, `acceptedAt`.

Organization conditionally consumes the still-valid invitation and creates/binds the
membership with its fixed intended roles. It alone enforces expiry, revocation,
single-use, duplicate membership and role rules.

## 3. Transaction and audit boundary

1. Identity normalizes email and validates/provisions or links the User identity.
2. Application orchestration calls Organization validation; Identity never reads
   Organization private persistence.
3. The confirm port runs in the same local PostgreSQL transaction as Identity
   acceptance, using a transaction-aware public port, never an exposed repository/table.
4. Identity and Organization append their own safe audit intents with one correlation
   ID. Organization owns invitation/membership audit; Identity owns credential/
   verification audit.
5. Commit makes both effects visible. No external side effect occurs in transaction.

## 4. Idempotency and failure

- Caller supplies one Idempotency-Key per acceptance attempt.
- A repeated completed request returns original `membershipId` and `acceptedAt`.
- In-progress/version conflict returns `INVITATION_CONFLICT` and is safe to retry with
  the same key.
- Failed identity verification/provisioning does not consume invitation.
- Failed Organization confirmation rolls back the shared local transaction.
- Expired, revoked or consumed invitation creates neither membership nor staff
  authority.

## 5. Blocker disposition

`P7-ID-BLK-005` is **RESOLVED_FOR_IDENTITY_DESIGN**. This is not evidence that
Organization implements the port or that staff acceptance is executable. Runtime
integration/testing remains a future Identity dependency after approved security
parameters are available; this contract does not authorize Organization migration.
