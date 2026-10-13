/** Organization-owned invariant; Identity must never inspect membership persistence. */
export interface OrganizationAccountLifecyclePort {
  assertAccountLifecycleAllowed(input: {
    userId: string;
    action: 'SUSPEND' | 'REACTIVATE' | 'DEACTIVATE';
  }): Promise<void>;
}
export const ORGANIZATION_ACCOUNT_LIFECYCLE_PORT = Symbol(
  'ORGANIZATION_ACCOUNT_LIFECYCLE_PORT',
);

export class UnavailableOrganizationAccountLifecyclePort
  implements OrganizationAccountLifecyclePort
{
  async assertAccountLifecycleAllowed(): Promise<void> {
    throw new Error('ORGANIZATION_LIFECYCLE_DEPENDENCY_UNAVAILABLE');
  }
}
