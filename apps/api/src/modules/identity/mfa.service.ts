import { Inject, Injectable } from '@nestjs/common';
import { hashOpaqueToken } from './identity-security';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
  TOTP_SECRET_PROTECTOR,
  TotpSecretProtector,
} from './identity.types';
import { createTotpSecret, issueRecoveryCodes, verifyTotp } from './totp';

export type MfaEnrollment = {
  encryptedSecret: string;
  keyReference: string;
  provisioningSecret: string;
};

/** Identity-only MFA application boundary; persistence and privileged-role lookup are ports. */
@Injectable()
export class MfaService {
  constructor(
    @Inject(TOTP_SECRET_PROTECTOR) private readonly protector: TotpSecretProtector,
    @Inject(IDENTITY_REPOSITORY) private readonly repository: IdentityRepository,
  ) {}

  async beginEnrollment(): Promise<MfaEnrollment> {
    const provisioningSecret = createTotpSecret();
    const encrypted = await this.protector.encrypt(provisioningSecret);
    return {
      encryptedSecret: encrypted.ciphertext,
      keyReference: encrypted.keyReference,
      provisioningSecret,
    };
  }

  async confirmEnrollment(input: {
    encryptedSecret: string;
    keyReference: string;
    code: string;
    now?: Date;
  }): Promise<{ recoveryCodes: string[] }> {
    const secret = await this.protector.decrypt({
      ciphertext: input.encryptedSecret,
      keyReference: input.keyReference,
    });
    if (!verifyTotp(secret, input.code, input.now ?? new Date()))
      throw new Error('MFA_PROOF_INVALID');
    return { recoveryCodes: issueRecoveryCodes().plaintext };
  }

  async verify(input: {
    encryptedSecret: string;
    keyReference: string;
    code: string;
    now?: Date;
  }): Promise<boolean> {
    const secret = await this.protector.decrypt({
      ciphertext: input.encryptedSecret,
      keyReference: input.keyReference,
    });
    return verifyTotp(secret, input.code, input.now ?? new Date());
  }
  async consumeRecoveryCode(
    userId: string,
    code: string,
    now = new Date(),
  ): Promise<boolean> {
    return this.repository.consumeRecoveryCode({
      userId,
      codeHash: hashOpaqueToken(code),
      now,
    });
  }
}
