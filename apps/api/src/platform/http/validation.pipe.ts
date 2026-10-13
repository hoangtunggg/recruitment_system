import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { FieldViolation, InputValidationError } from './errors';

function flattenValidationErrors(errors: ValidationError[]): FieldViolation[] {
  return errors.flatMap((error) => {
    const own = Object.values(error.constraints ?? {}).map((message) => ({
      field: error.property,
      message,
    }));
    const children = flattenValidationErrors(error.children ?? []).map((child) => ({
      ...child,
      field: `${error.property}.${child.field}`,
    }));
    return [...own, ...children];
  });
}

@Injectable()
export class TargetValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors) =>
        new InputValidationError(flattenValidationErrors(errors)),
    });
  }

  override transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    return super.transform(value, metadata);
  }
}
