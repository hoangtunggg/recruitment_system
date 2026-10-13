import { redactSensitiveData } from './redaction';

export type AuditIntent = Readonly<{
  actorId: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  correlationId?: string;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}>;

export interface AuditWriter {
  append(intent: AuditIntent): Promise<void>;
}

export const AUDIT_WRITER = Symbol('AUDIT_WRITER');

/** Governance owns persistence and read authorization in P7; P6 exposes safe intent only. */
export function sanitizeAuditIntent(intent: AuditIntent): AuditIntent {
  return {
    ...intent,
    metadata: intent.metadata
      ? (redactSensitiveData(intent.metadata) as Record<string, unknown>)
      : undefined,
  };
}
