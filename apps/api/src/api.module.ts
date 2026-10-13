import { Module } from '@nestjs/common';
import { ApplicationModule } from './modules/application/application.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InterviewModule } from './modules/interview/interview.module';
import { JobModule } from './modules/job/job.module';
import { OfferModule } from './modules/offer/offer.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { RecruitmentPlanningModule } from './modules/recruitment-planning/recruitment-planning.module';
import { ConfigurationModule } from './platform/configuration/configuration.module';
import { HttpPlatformModule } from './platform/http/http-platform.module';
import { ObservabilityModule } from './platform/observability/observability.module';
import { DatabaseModule } from './platform/persistence/database.module';
import { OutboxModule } from './platform/persistence/outbox/outbox.module';
import { SecurityModule } from './platform/security/security.module';

/**
 * Target-only composition root. Modules own their private implementation and do
 * not import legacy apps, repositories, gRPC contracts, or global role helpers.
 */
@Module({
  imports: [
    ConfigurationModule,
    HttpPlatformModule,
    ObservabilityModule,
    DatabaseModule,
    OutboxModule,
    SecurityModule,
    IdentityModule,
    OrganizationModule,
    CandidateModule,
    RecruitmentPlanningModule,
    JobModule,
    ApplicationModule,
    InterviewModule,
    OfferModule,
    CommunicationModule,
    GovernanceModule,
  ],
})
export class ApiModule {}
