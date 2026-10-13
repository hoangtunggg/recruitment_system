import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { TotpSecretProtector } from './identity.types';

/** Test-only deterministic adapter. It is deliberately not registered in production. */
export class DeterministicTestSecretProtector implements TotpSecretProtector {
  private readonly key = createHash('sha256')
    .update('test-only-not-a-production-key')
    .digest();
  async encrypt(secret: string): Promise<{ ciphertext: string; keyReference: string }> {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const body = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    return {
      ciphertext: Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url'),
      keyReference: 'test-key-v1',
    };
  }
  async decrypt(input: { ciphertext: string; keyReference: string }): Promise<string> {
    if (input.keyReference !== 'test-key-v1') throw new Error('Unknown test key');
    const data = Buffer.from(input.ciphertext, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', this.key, data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString(
      'utf8',
    );
  }
}
