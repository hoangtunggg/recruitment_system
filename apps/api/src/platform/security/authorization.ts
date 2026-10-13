import { AuthenticatedPrincipal } from './principal';

export type FixedOrganizationRole =
  | 'ORG_ADMIN'
  | 'RECRUITER'
  | 'HIRING_MANAGER'
  | 'INTERVIEWER';

export type MembershipAuthorizationContext = Readonly<{
  organizationId: string;
  active: boolean;
  roles: readonly FixedOrganizationRole[];
  rolePermissions: Readonly<Record<FixedOrganizationRole, readonly string[]>>;
  assignedResourceIds?: readonly string[];
}>;

export type AuthorizationRequest = Readonly<{
  permission: string;
  organizationId?: string;
  resourceId?: string;
  tenantContent: boolean;
  assignmentRequired?: boolean;
  candidateSelf?: boolean;
  candidateId?: string;
}>;

/**
 * Generic evaluator: Organization supplies role-derived permissions and each domain
 * supplies the resource/assignment/state facts. It deliberately owns no domain
 * permission catalog and has no direct-grant path.
 */
export class PermissionEvaluator {
  can(
    principal: AuthenticatedPrincipal,
    memberships: readonly MembershipAuthorizationContext[],
    request: AuthorizationRequest,
  ): boolean {
    if (request.tenantContent && principal.platformRole === 'PLATFORM_ADMIN') {
      return false;
    }

    if (request.candidateSelf) {
      return Boolean(
        principal.candidateId && principal.candidateId === request.candidateId,
      );
    }

    if (!request.organizationId) {
      return !request.tenantContent && principal.platformRole === 'PLATFORM_ADMIN';
    }

    const membership = memberships.find(
      (candidate) =>
        candidate.active && candidate.organizationId === request.organizationId,
    );
    if (!membership) {
      return false;
    }

    const permissions = new Set(
      membership.roles.flatMap((role) => membership.rolePermissions[role] ?? []),
    );
    if (!permissions.has(request.permission)) {
      return false;
    }

    if (request.assignmentRequired && request.resourceId) {
      return membership.assignedResourceIds?.includes(request.resourceId) ?? false;
    }

    return true;
  }
}
