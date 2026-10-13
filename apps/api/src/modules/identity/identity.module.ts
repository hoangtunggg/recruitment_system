import { Module } from '@nestjs/common';
import { AccountLifecycleService } from './account-lifecycle.service';
import { TargetIdentityRuntimeBoundary } from './identity-runtime-boundaries';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';
import {
  BREACHED_PASSWORD_CHECKER,
  IDENTITY_AUDIT_SINK,
  IDENTITY_KEY_SERVICE,
  IDENTITY_REPOSITORY,
  TOTP_SECRET_PROTECTOR,
} from './identity.types';
import { InvitationIdentityService } from './invitation-identity.service';
import { MfaService } from './mfa.service';
import {
  ORGANIZATION_ACCOUNT_LIFECYCLE_PORT,
  UnavailableOrganizationAccountLifecyclePort,
} from './organization-account-lifecycle.port';
import {
  ORGANIZATION_INVITATION_PORT,
  PRIVILEGED_MFA_ASSURANCE_PORT,
  UnavailableOrganizationIdentityPort,
} from './organization-identity.ports';
import { MikroIdentityRepository } from './persistence/mikro-identity.repository';

/** Target Identity is inactive until P7 validation and the cutover gate complete. */
@Module({
  controllers: [IdentityController],
  providers: [
    IdentityService,
    MfaService,
    AccountLifecycleService,
    InvitationIdentityService,
    MikroIdentityRepository,
    TargetIdentityRuntimeBoundary,
    UnavailableOrganizationIdentityPort,
    {
      provide: ORGANIZATION_INVITATION_PORT,
      useExisting: UnavailableOrganizationIdentityPort,
    },
    {
      provide: PRIVILEGED_MFA_ASSURANCE_PORT,
      useExisting: UnavailableOrganizationIdentityPort,
    },
    {
      provide: ORGANIZATION_ACCOUNT_LIFECYCLE_PORT,
      useClass: UnavailableOrganizationAccountLifecyclePort,
    },
    { provide: IDENTITY_REPOSITORY, useExisting: MikroIdentityRepository },
    { provide: IDENTITY_AUDIT_SINK, useExisting: TargetIdentityRuntimeBoundary },
    { provide: BREACHED_PASSWORD_CHECKER, useExisting: TargetIdentityRuntimeBoundary },
    { provide: IDENTITY_KEY_SERVICE, useExisting: TargetIdentityRuntimeBoundary },
    { provide: TOTP_SECRET_PROTECTOR, useExisting: TargetIdentityRuntimeBoundary },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
