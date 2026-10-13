import { Injectable } from '@nestjs/common';

export type TargetConfiguration = Readonly<{
  databaseUrl: string;
  jwtIssuer: string;
  jwtAudience: string;
  outboxMaxAttempts: number;
  queryDefaultLimit: number;
  queryMaxLimit: number;
}>;

const required = (value: string | undefined, name: string): string => {
  if (!value?.trim()) {
    throw new Error(`Missing required target configuration: ${name}`);
  }

  return value.trim();
};

const positiveInteger = (value: string | undefined, name: string): number => {
  const parsed = Number(required(value, name));
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`Target configuration ${name} must be a positive integer`);
  }

  return parsed;
};

/**
 * Validates only target-process inputs. No legacy environment variable or secret is
 * read here, so booting the inactive target cannot silently inherit legacy trust.
 */
export function validateTargetConfiguration(
  environment: Record<string, string | undefined>,
): TargetConfiguration {
  const queryDefaultLimit = positiveInteger(
    environment.TARGET_QUERY_DEFAULT_LIMIT,
    'TARGET_QUERY_DEFAULT_LIMIT',
  );
  const queryMaxLimit = positiveInteger(
    environment.TARGET_QUERY_MAX_LIMIT,
    'TARGET_QUERY_MAX_LIMIT',
  );

  if (queryDefaultLimit > queryMaxLimit) {
    throw new Error('TARGET_QUERY_DEFAULT_LIMIT must not exceed TARGET_QUERY_MAX_LIMIT');
  }

  return Object.freeze({
    databaseUrl: required(environment.TARGET_DATABASE_URL, 'TARGET_DATABASE_URL'),
    jwtIssuer: required(environment.TARGET_JWT_ISSUER, 'TARGET_JWT_ISSUER'),
    jwtAudience: required(environment.TARGET_JWT_AUDIENCE, 'TARGET_JWT_AUDIENCE'),
    outboxMaxAttempts: positiveInteger(
      environment.TARGET_OUTBOX_MAX_ATTEMPTS,
      'TARGET_OUTBOX_MAX_ATTEMPTS',
    ),
    queryDefaultLimit,
    queryMaxLimit,
  });
}

@Injectable()
export class TargetConfigService {
  constructor(private readonly configuration: TargetConfiguration) {}

  get databaseUrl(): string {
    return this.configuration.databaseUrl;
  }

  get jwtIssuer(): string {
    return this.configuration.jwtIssuer;
  }

  get jwtAudience(): string {
    return this.configuration.jwtAudience;
  }

  get outboxMaxAttempts(): number {
    return this.configuration.outboxMaxAttempts;
  }

  get queryDefaultLimit(): number {
    return this.configuration.queryDefaultLimit;
  }

  get queryMaxLimit(): number {
    return this.configuration.queryMaxLimit;
  }
}
