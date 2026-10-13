import { createHash, createSign, createVerify, randomUUID } from 'node:crypto';
import {
  BreachedPasswordChecker,
  IdentityAuditEvent,
  IdentityAuditSink,
  IdentityKeyService,
} from './identity.types';

/** Deployment must supply an ES256 key reference and PEM material via its secret manager. */
export class Es256KeyProvider implements IdentityKeyService {
  constructor(
    private readonly input: {
      privateKeyPem?: string;
      publicKeyPem?: string;
      kid?: string;
      issuer: string;
      audience: string;
    },
  ) {}
  async signAccessToken(value: {
    subject: string;
    sessionId: string;
    platformAdmin: boolean;
  }): Promise<string> {
    if (!this.input.privateKeyPem || !this.input.kid)
      throw new Error('CONFIG_REQUIRED: ES256 signing key');
    const header = Buffer.from(
      JSON.stringify({ alg: 'ES256', typ: 'JWT', kid: this.input.kid }),
    ).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        iss: this.input.issuer,
        aud: this.input.audience,
        sub: value.subject,
        sid: value.sessionId,
        jti: randomUUID(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 600,
      }),
    ).toString('base64url');
    const signer = createSign('SHA256');
    signer.update(`${header}.${payload}`);
    signer.end();
    return `${header}.${payload}.${signer.sign({ key: this.input.privateKeyPem, dsaEncoding: 'ieee-p1363' }).toString('base64url')}`;
  }
  verify(token: string): boolean {
    if (!this.input.publicKeyPem)
      throw new Error('CONFIG_REQUIRED: ES256 verification key');
    const [h, p, s] = token.split('.');
    const verifier = createVerify('SHA256');
    verifier.update(`${h}.${p}`);
    verifier.end();
    return verifier.verify(
      { key: this.input.publicKeyPem, dsaEncoding: 'ieee-p1363' },
      Buffer.from(s, 'base64url'),
    );
  }
}
export class FailClosedBreachedPasswordProvider implements BreachedPasswordChecker {
  async isRejected(): Promise<boolean> {
    throw new Error('CONFIG_REQUIRED: breached password provider');
  }
}
export class LocalHashBreachedPasswordProvider implements BreachedPasswordChecker {
  constructor(private readonly hashes: ReadonlySet<string>) {}
  async isRejected(password: string) {
    return this.hashes.has(
      createHash('sha1').update(password).digest('hex').toUpperCase(),
    );
  }
}
export class SafeAuditAdapter implements IdentityAuditSink {
  constructor(private readonly write: (event: IdentityAuditEvent) => Promise<void>) {}
  async append(event: IdentityAuditEvent) {
    const metadata = Object.fromEntries(
      Object.entries(event.metadata ?? {}).filter(
        ([key]) => !/(password|token|secret|otp|code)/i.test(key),
      ),
    );
    await this.write({ ...event, metadata });
  }
}
