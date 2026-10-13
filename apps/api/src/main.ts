import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

/**
 * P5 target entry point. It is deliberately not invoked: legacy services remain
 * active and no traffic is transferred until an authorized later phase.
 */
export async function bootstrapTargetSkeleton() {
  return NestFactory.create(ApiModule);
}
