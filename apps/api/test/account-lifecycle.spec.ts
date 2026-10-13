import assert from 'node:assert/strict';
import test from 'node:test';
import { UnavailableOrganizationAccountLifecyclePort } from '../src/modules/identity/organization-account-lifecycle.port.ts';

test('last-Org-Admin protection fails closed without Organization runtime', async () => {
  await assert.rejects(
    () =>
      new UnavailableOrganizationAccountLifecyclePort().assertAccountLifecycleAllowed({
        userId: 'u',
        action: 'DEACTIVATE',
      }),
    /ORGANIZATION_LIFECYCLE_DEPENDENCY_UNAVAILABLE/,
  );
});
