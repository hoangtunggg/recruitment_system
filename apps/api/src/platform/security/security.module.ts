import { Module } from '@nestjs/common';
import { PermissionEvaluator } from './authorization';

@Module({
  providers: [PermissionEvaluator],
  exports: [PermissionEvaluator],
})
export class SecurityModule {}
