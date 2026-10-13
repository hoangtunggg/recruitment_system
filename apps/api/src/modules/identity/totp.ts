import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createRecoveryCodes, hashOpaqueToken } from './identity-security';

const STEP_SECONDS = 30;
const DIGITS = 6;

export function createTotpSecret(): string {
  return randomBytes(32).toString('base64url');
}

export function totpAt(secret: string, at: Date): string {
  const counter = Math.floor(at.getTime() / 1000 / STEP_SECONDS);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac('sha256', Buffer.from(secret, 'base64url'))
    .update(buffer)
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const value =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];
  return (value % 10 ** DIGITS).toString().padStart(DIGITS, '0');
}

/** Permits exactly the approved ±1 step drift window. */
export function verifyTotp(secret: string, code: string, at: Date): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  return [-1, 0, 1].some((offset) => {
    const expected = Buffer.from(
      totpAt(secret, new Date(at.getTime() + offset * STEP_SECONDS * 1000)),
    );
    const received = Buffer.from(code);
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export function issueRecoveryCodes(): { plaintext: string[]; hashes: string[] } {
  const plaintext = createRecoveryCodes();
  return { plaintext, hashes: plaintext.map(hashOpaqueToken) };
}
