import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'node:path';
import { IdentitySessionEntity } from './src/modules/identity/persistence/identity-session.entity';
import { IdentityTokenEntity } from './src/modules/identity/persistence/identity-token.entity';
import { IdentityUserEntity } from './src/modules/identity/persistence/identity-user.entity';
import { validateTargetConfiguration } from './src/platform/configuration/target-config';
import { IdempotencyRecord } from './src/platform/persistence/outbox/idempotency-record.entity';
import { OutboxRecord } from './src/platform/persistence/outbox/outbox-record.entity';

const configuration = validateTargetConfiguration(process.env);
export default {
  driver: PostgreSqlDriver,
  clientUrl: configuration.databaseUrl,
  entities: [
    OutboxRecord,
    IdempotencyRecord,
    IdentityUserEntity,
    IdentityTokenEntity,
    IdentitySessionEntity,
  ],
  extensions: [Migrator],
  migrations: {
    path: path.join(__dirname, 'dist/platform/persistence/migrations'),
    pathTs: path.join(__dirname, 'src/platform/persistence/migrations'),
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
  },
};
