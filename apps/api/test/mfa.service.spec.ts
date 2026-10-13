import assert from 'node:assert/strict';
import test from 'node:test';
import { MfaService } from '../src/modules/identity/mfa.service.ts';
import { DeterministicTestSecretProtector } from '../src/modules/identity/test-secret-protector.ts';
import { totpAt } from '../src/modules/identity/totp.ts';

test('MFA enrollment encrypts before persistence material and confirms only valid proof', async () => {
  const service = new MfaService(new DeterministicTestSecretProtector(), {
    consumeRecoveryCode: async () => false,
  } as never);
  const enrollment = await service.beginEnrollment();
  assert.notEqual(enrollment.encryptedSecret, enrollment.provisioningSecret);
  const at = new Date('2026-10-06T00:00:00Z');
  const result = await service.confirmEnrollment({
    ...enrollment,
    code: totpAt(enrollment.provisioningSecret, at),
    now: at,
  });
  assert.equal(result.recoveryCodes.length, 10);
  await assert.rejects(() =>
    service.confirmEnrollment({ ...enrollment, code: '000000', now: at }),
  );
});

test('recovery code consumption succeeds exactly once, including concurrent attempts', async () => {
  let consumed = false;
  const service = new MfaService(new DeterministicTestSecretProtector(), {
    consumeRecoveryCode: async () => {
      if (consumed) return false;
      consumed = true;
      return true;
    },
  } as never);
  assert.equal(await service.consumeRecoveryCode('user-1', 'code'), true);
  assert.equal(await service.consumeRecoveryCode('user-1', 'code'), false);
  consumed = false;
  const results = await Promise.all([
    service.consumeRecoveryCode('user-1', 'code'),
    service.consumeRecoveryCode('user-1', 'code'),
  ]);
  assert.deepEqual(results.sort(), [false, true]);
});
