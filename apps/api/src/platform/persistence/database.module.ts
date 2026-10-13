import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import path from 'node:path';
import { IdempotencyRecord } from './outbox/idempotency-record.entity';
import { OutboxRecord } from './outbox/outbox-record.entity';
import { DatabaseTransactionRunner } from './transaction-runner';
import { IdentitySessionEntity } from '../../modules/identity/persistence/identity-session.entity';
import { IdentityTokenEntity } from '../../modules/identity/persistence/identity-token.entity';
import { IdentityUserEntity } from '../../modules/identity/persistence/identity-user.entity';
import { MfaRecoveryCodeEntity } from '../../modules/identity/persistence/mfa-recovery-code.entity';
import { TargetConfigService } from '../configuration/target-config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [TargetConfigService],
      useFactory: (config: TargetConfigService) => ({
        driver: PostgreSqlDriver,
        clientUrl: config.databaseUrl,
        entities: [
          OutboxRecord,
          IdempotencyRecord,
          IdentityUserEntity,
          IdentityTokenEntity,
          IdentitySessionEntity,
          MfaRecoveryCodeEntity,
        ],
        extensions: [Migrator],
        migrations: {
          path: path.join(__dirname, 'migrations'),
          pathTs: path.join(process.cwd(), 'src/platform/persistence/migrations'),
          glob: '!(*.d).{js,ts}',
          transactional: true,
          allOrNothing: true,
        },
      }),
    }),
    MikroOrmModule.forFeature([
      OutboxRecord,
      IdempotencyRecord,
      IdentityUserEntity,
      IdentityTokenEntity,
      IdentitySessionEntity,
      MfaRecoveryCodeEntity,
    ]),
  ],
  providers: [DatabaseTransactionRunner],
  exports: [DatabaseTransactionRunner, MikroOrmModule],
})
export class DatabaseModule {}
