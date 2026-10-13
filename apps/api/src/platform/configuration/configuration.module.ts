import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TargetConfigService, validateTargetConfiguration } from './target-config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateTargetConfiguration,
    }),
  ],
  providers: [
    {
      provide: TargetConfigService,
      useFactory: () => new TargetConfigService(validateTargetConfiguration(process.env)),
    },
  ],
  exports: [TargetConfigService],
})
export class ConfigurationModule {}
