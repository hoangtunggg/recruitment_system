import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const PASSWORD_MINIMUM_LENGTH = 15;
export const PASSWORD_MAXIMUM_LENGTH = 128;
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
export const REFRESH_ABSOLUTE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_IDLE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeEmail(email: string): string {
  return email.trim().toLocaleLowerCase('en-US');
}

export function assertPasswordLength(password: string): void {
  const length = [...password].length;
  if (length < PASSWORD_MINIMUM_LENGTH || length > PASSWORD_MAXIMUM_LENGTH) {
    throw new Error('PASSWORD_POLICY_REJECTED');
  }
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token).digest('base64url');
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createRecoveryCodes(): string[] {
  return Array.from({ length: 10 }, () => randomBytes(12).toString('base64url'));
}
