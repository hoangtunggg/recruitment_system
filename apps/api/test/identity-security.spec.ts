import assert from 'node:assert/strict';
import test from 'node:test';
import { issueRecoveryCodes, totpAt, verifyTotp } from '../src/modules/identity/totp.ts';

test('P7-ID-BLK-004 TOTP uses SHA-256 six digits and only the approved drift window', () => {
  const at = new Date('2026-10-06T00:00:00.000Z');
  const secret = 'mfa-secret-material-for-test';
  const code = totpAt(secret, at);
  assert.match(code, /^\d{6}$/);
  assert.equal(verifyTotp(secret, code, at), true);
  assert.equal(
    verifyTotp(secret, totpAt(secret, new Date(at.getTime() + 30_000)), at),
    true,
  );
  assert.equal(
    verifyTotp(secret, totpAt(secret, new Date(at.getTime() + 60_000)), at),
    false,
  );
});

test('P7-ID-BLK-004 recovery code plaintext is issued once and persistence values are hashes', () => {
  const codes = issueRecoveryCodes();
  assert.equal(codes.plaintext.length, 10);
  assert.equal(codes.hashes.length, 10);
  assert.equal(
    codes.hashes.some((hash) => codes.plaintext.includes(hash)),
    false,
  );
});
