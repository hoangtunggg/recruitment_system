import assert from 'node:assert/strict';
import test from 'node:test';
import { validateTargetConfiguration } from '../src/platform/configuration/target-config.ts';
import {
  ErrorCode,
  InputValidationError,
  toProblemDetails,
} from '../src/platform/http/errors.ts';
import { normalizePageRequest } from '../src/platform/http/pagination.ts';
import { sanitizeAuditIntent } from '../src/platform/observability/audit.ts';
import { redactSensitiveData } from '../src/platform/observability/redaction.ts';
import {
  assertIdempotencyKey,
  createDomainEvent,
  outboxRecordFor,
} from '../src/platform/persistence/outbox/outbox.ts';
import { TargetAuthenticationGuard } from '../src/platform/security/authentication.guard.ts';
import {
  MembershipAuthorizationContext,
  PermissionEvaluator,
} from '../src/platform/security/authorization.ts';

const environment = {
  TARGET_DATABASE_URL: 'postgresql://target:target@localhost:5432/target',
  TARGET_JWT_ISSUER: 'https://issuer.example.test',
  TARGET_JWT_AUDIENCE: 'recruitment-api',
  TARGET_OUTBOX_MAX_ATTEMPTS: '5',
  TARGET_QUERY_DEFAULT_LIMIT: '25',
  TARGET_QUERY_MAX_LIMIT: '100',
};

test('config rejects absent required target secrets and validates bounds', () => {
  assert.throws(() =>
    validateTargetConfiguration({ ...environment, TARGET_DATABASE_URL: '' }),
  );
  assert.throws(() =>
    validateTargetConfiguration({ ...environment, TARGET_QUERY_DEFAULT_LIMIT: '101' }),
  );
  assert.equal(validateTargetConfiguration(environment).queryMaxLimit, 100);
});

test('problem details never expose an internal exception message', () => {
  const validation = toProblemDetails(
    new InputValidationError([{ field: 'email', message: 'invalid' }]),
  );
  assert.equal(validation.code, ErrorCode.VALIDATION_FAILED);
  assert.equal(validation.violations?.[0]?.field, 'email');
  assert.deepEqual(toProblemDetails(new Error('database password xyz')), {
    code: ErrorCode.INTERNAL_ERROR,
    status: 500,
    message: 'An unexpected error occurred',
    correlationId: undefined,
  });
});

test('pagination is bounded and deterministic', () => {
  assert.deepEqual(normalizePageRequest({}, { defaultLimit: 25, maxLimit: 100 }), {
    limit: 25,
    cursor: undefined,
    order: 'DESC',
  });
  assert.throws(() =>
    normalizePageRequest({ limit: 101 }, { defaultLimit: 25, maxLimit: 100 }),
  );
});

test('permission evaluator unions only active membership roles and preserves tenant restrictions', () => {
  const roles: MembershipAuthorizationContext['rolePermissions'] = {
    ORG_ADMIN: [],
    RECRUITER: ['PERM-EXAMPLE-READ'],
    HIRING_MANAGER: ['PERM-EXAMPLE-APPROVE'],
    INTERVIEWER: [],
  };
  const memberships: MembershipAuthorizationContext[] = [
    {
      organizationId: 'org-a',
      active: true,
      roles: ['RECRUITER', 'HIRING_MANAGER'],
      rolePermissions: roles,
      assignedResourceIds: ['job-a'],
    },
  ];
  const evaluator = new PermissionEvaluator();
  const principal = { userId: 'user-1', sessionId: 'session-1' };

  assert.equal(
    evaluator.can(principal, memberships, {
      permission: 'PERM-EXAMPLE-APPROVE',
      organizationId: 'org-a',
      tenantContent: true,
    }),
    true,
  );
  assert.equal(
    evaluator.can(principal, memberships, {
      permission: 'PERM-EXAMPLE-READ',
      organizationId: 'org-b',
      tenantContent: true,
    }),
    false,
  );
  assert.equal(
    evaluator.can({ ...principal, platformRole: 'PLATFORM_ADMIN' }, memberships, {
      permission: 'PERM-EXAMPLE-READ',
      organizationId: 'org-a',
      tenantContent: true,
    }),
    false,
  );
});

test('authentication guard derives principal only from verified bearer token and active session', async () => {
  const request: { headers: { authorization?: string }; principal?: unknown } = {
    headers: { authorization: 'Bearer signed-token' },
  };
  const context = {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  };
  const guard = new TargetAuthenticationGuard(
    { getAllAndOverride: () => false } as never,
    { verify: async () => ({ subject: 'user-1', sessionId: 'session-1' }) },
    { isRevoked: async () => false },
  );
  assert.equal(await guard.canActivate(context as never), true);
  assert.deepEqual(request.principal, {
    userId: 'user-1',
    sessionId: 'session-1',
    platformRole: undefined,
    candidateId: undefined,
  });

  const revoked = new TargetAuthenticationGuard(
    { getAllAndOverride: () => false } as never,
    { verify: async () => ({ subject: 'user-1', sessionId: 'session-1' }) },
    { isRevoked: async () => true },
  );
  await assert.rejects(() => revoked.canActivate(context as never));
});

test('audit and logs redact secrets before persistence or output', () => {
  assert.deepEqual(redactSensitiveData({ password: 'x', nested: { accessToken: 'y' } }), {
    password: '[REDACTED]',
    nested: { accessToken: '[REDACTED]' },
  });
  assert.deepEqual(
    sanitizeAuditIntent({
      actorId: 'user-1',
      action: 'test',
      resourceType: 'test',
      resourceId: '1',
      occurredAt: new Date(0),
      metadata: { otpSecret: 'x' },
    }).metadata,
    { otpSecret: '[REDACTED]' },
  );
});

test('outbox identities and idempotency keys have technical invariants', () => {
  assert.throws(() => assertIdempotencyKey('short'));
  const event = createDomainEvent({
    eventType: 'test.event',
    aggregateId: 'aggregate-1',
    schemaVersion: '1',
    payload: {},
  });
  const record = outboxRecordFor(event);
  assert.equal(record.eventId, event.eventId);
  assert.equal(record.attempts, 0);
});
