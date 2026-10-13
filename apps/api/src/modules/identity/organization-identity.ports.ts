export interface OrganizationInvitationAcceptancePort {
  validateForIdentityAcceptance(input: {
    invitationToken: string;
    normalizedEmail: string;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{
    invitationId: string;
    organizationId: string;
    expectedInvitationVersion: number;
  }>;
  confirmIdentityAndCreateMembership(input: {
    invitationId: string;
    expectedInvitationVersion: number;
    userId: string;
    normalizedEmail: string;
    idempotencyKey: string;
    correlationId?: string;
  }): Promise<{ membershipId: string; organizationId: string; alreadyAccepted: boolean }>;
}
export interface PrivilegedMfaAssurancePort {
  requiresMfa(input: { userId: string; platformAdmin: boolean }): Promise<boolean>;
}
export const ORGANIZATION_INVITATION_PORT = Symbol('ORGANIZATION_INVITATION_PORT');
export const PRIVILEGED_MFA_ASSURANCE_PORT = Symbol('PRIVILEGED_MFA_ASSURANCE_PORT');
export class UnavailableOrganizationIdentityPort
  implements OrganizationInvitationAcceptancePort, PrivilegedMfaAssurancePort
{
  async validateForIdentityAcceptance(): Promise<never> {
    throw new Error('PENDING_ORGANIZATION');
  }
  async confirmIdentityAndCreateMembership(): Promise<never> {
    throw new Error('PENDING_ORGANIZATION');
  }
  async requiresMfa(): Promise<never> {
    throw new Error('PENDING_ORGANIZATION');
  }
}
