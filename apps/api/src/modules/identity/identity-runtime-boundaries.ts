import { Injectable } from '@nestjs/common';
import {
  BreachedPasswordChecker,
  IdentityAuditEvent,
  IdentityAuditSink,
  IdentityKeyService,
  TotpSecretProtector,
} from './identity.types';

/** Fail closed until deployment wires privacy-preserving blocklist, KMS and Governance audit adapters. */
@Injectable()
export class TargetIdentityRuntimeBoundary
  implements
    BreachedPasswordChecker,
    IdentityAuditSink,
    IdentityKeyService,
    TotpSecretProtector
{
  async isRejected(_password: string): Promise<boolean> {
    throw new Error('Identity breached-password provider is not configured');
  }
  async append(_event: IdentityAuditEvent): Promise<void> {
    throw new Error('Identity audit sink is not configured');
  }
  async signAccessToken(_input: {
    subject: string;
    sessionId: string;
    platformAdmin: boolean;
  }): Promise<string> {
    throw new Error('Identity ES256 key service is not configured');
  }
  async encrypt(_secret: string): Promise<{ ciphertext: string; keyReference: string }> {
    throw new Error('Identity TOTP secret protector is not configured');
  }
  async decrypt(_input: { ciphertext: string; keyReference: string }): Promise<string> {
    throw new Error('Identity TOTP secret protector is not configured');
  }
}
