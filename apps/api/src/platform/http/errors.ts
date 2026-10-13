import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  AUTHENTICATION_INVALID = 'AUTHENTICATION_INVALID',
  AUTHORIZATION_DENIED = 'AUTHORIZATION_DENIED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  CONFLICT = 'CONFLICT',
  IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export type FieldViolation = Readonly<{
  field: string;
  message: string;
}>;

export class ApplicationError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly status: HttpStatus,
    message: string,
    readonly violations?: readonly FieldViolation[],
  ) {
    super(message);
  }
}

export class InputValidationError extends ApplicationError {
  constructor(violations: readonly FieldViolation[]) {
    super(
      ErrorCode.VALIDATION_FAILED,
      HttpStatus.BAD_REQUEST,
      'Request validation failed',
      violations,
    );
  }
}

export type ProblemDetails = Readonly<{
  code: ErrorCode;
  status: number;
  message: string;
  correlationId?: string;
  violations?: readonly FieldViolation[];
}>;

export function toProblemDetails(
  exception: unknown,
  correlationId?: string,
): ProblemDetails {
  if (exception instanceof ApplicationError) {
    return {
      code: exception.code,
      status: exception.status,
      message: exception.message,
      correlationId,
      violations: exception.violations,
    };
  }

  return {
    code: ErrorCode.INTERNAL_ERROR,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred',
    correlationId,
  };
}
