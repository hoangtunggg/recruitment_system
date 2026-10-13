import { Inject, Injectable } from '@nestjs/common';
import {
  ORGANIZATION_INVITATION_PORT,
  OrganizationInvitationAcceptancePort,
} from './organization-identity.ports';

@Injectable()
export class InvitationIdentityService {
  constructor(
    @Inject(ORGANIZATION_INVITATION_PORT)
    private readonly organization: OrganizationInvitationAcceptancePort,
  ) {}
  async accept(input: {
    invitationToken: string;
    normalizedEmail: string;
    userId: string;
    idempotencyKey: string;
    correlationId?: string;
  }) {
    const invitation = await this.organization.validateForIdentityAcceptance(input);
    return this.organization.confirmIdentityAndCreateMembership({
      ...invitation,
      userId: input.userId,
      normalizedEmail: input.normalizedEmail,
      idempotencyKey: input.idempotencyKey,
      correlationId: input.correlationId,
    });
  }
}
