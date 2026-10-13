import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

type Argon2 = (
  algorithm: 'argon2id',
  options: {
    message: Buffer;
    nonce: Buffer;
    parallelism: number;
    tagLength: number;
    memory: number;
    passes: number;
  },
  callback: (error: Error | null, derivedKey: ArrayBuffer) => void,
) => void;

const argon2 = promisify((crypto as typeof crypto & { argon2: Argon2 }).argon2);

/** Approved Argon2id parameters; the encoded record carries its random salt. */
export class Argon2idPasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const derived = await argon2('argon2id', {
      message: Buffer.from(password, 'utf8'),
      nonce: salt,
      memory: 19 * 1024,
      passes: 2,
      parallelism: 1,
      tagLength: 32,
    });
    return `argon2id$v=1$m=19456,t=2,p=1$${salt.toString('base64url')}$${Buffer.from(derived).toString('base64url')}`;
  }

  async verify(password: string, encoded: string): Promise<boolean> {
    const fields = encoded.split('$');
    if (
      fields.length !== 5 ||
      fields[0] !== 'argon2id' ||
      fields[2] !== 'm=19456,t=2,p=1'
    ) {
      return false;
    }
    const actual = await argon2('argon2id', {
      message: Buffer.from(password, 'utf8'),
      nonce: Buffer.from(fields[3], 'base64url'),
      memory: 19 * 1024,
      passes: 2,
      parallelism: 1,
      tagLength: 32,
    });
    const expected = Buffer.from(fields[4], 'base64url');
    const candidate = Buffer.from(actual);
    return (
      candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)
    );
  }
}
