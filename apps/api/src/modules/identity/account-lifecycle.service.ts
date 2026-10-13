import { Inject, Injectable } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { AccountState } from './identity.types';
import {
  ORGANIZATION_ACCOUNT_LIFECYCLE_PORT,
  OrganizationAccountLifecyclePort,
} from './organization-account-lifecycle.port';

@Injectable()
export class AccountLifecycleService {
  constructor(
    private readonly identity: IdentityService,
    @Inject(ORGANIZATION_ACCOUNT_LIFECYCLE_PORT)
    private readonly organization: OrganizationAccountLifecyclePort,
  ) {}
  suspend(userId: string, actorId: string, reason: string) {
    return this.transition('SUSPEND', userId, actorId, reason, AccountState.SUSPENDED);
  }
  reactivate(userId: string, actorId: string, reason: string) {
    return this.transition('REACTIVATE', userId, actorId, reason, AccountState.ACTIVE);
  }
  deactivate(userId: string, actorId: string, reason: string) {
    return this.transition(
      'DEACTIVATE',
      userId,
      actorId,
      reason,
      AccountState.DEACTIVATED,
    );
  }
  private async transition(
    action: 'SUSPEND' | 'REACTIVATE' | 'DEACTIVATE',
    userId: string,
    actorId: string,
    reason: string,
    next: AccountState.SUSPENDED | AccountState.ACTIVE | AccountState.DEACTIVATED,
  ) {
    await this.organization.assertAccountLifecycleAllowed({ userId, action });
    await this.identity.changeAccountState({ userId, actorId, reason, next });
  }
}
