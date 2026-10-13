import assert from 'node:assert/strict';
import test from 'node:test';
import { UnavailableOrganizationIdentityPort } from '../src/modules/identity/organization-identity.ports.ts';

test('Identity Organization ports fail closed without runtime adapter', async () => {
  const port = new UnavailableOrganizationIdentityPort();
  await assert.rejects(
    () => port.requiresMfa({ userId: 'u', platformAdmin: false }),
    /PENDING_ORGANIZATION/,
  );
  await assert.rejects(
    () =>
      port.validateForIdentityAcceptance({
        invitationToken: 'x',
        normalizedEmail: 'a@b.test',
        idempotencyKey: 'k',
      }),
    /PENDING_ORGANIZATION/,
  );
});
