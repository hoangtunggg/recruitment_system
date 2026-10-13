import { Injectable, LoggerService } from '@nestjs/common';
import { correlationContext } from './correlation-context';
import { redactSensitiveData } from './redaction';

@Injectable()
export class StructuredLogger implements LoggerService {
  log(message: unknown, context?: string): void {
    this.write('info', message, context);
  }

  error(message: unknown, trace?: string, context?: string): void {
    this.write('error', message, context, trace);
  }

  warn(message: unknown, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string): void {
    this.write('debug', message, context);
  }

  verbose(message: unknown, context?: string): void {
    this.write('trace', message, context);
  }

  private write(level: string, message: unknown, context?: string, trace?: string): void {
    const entry = redactSensitiveData({
      level,
      context,
      correlationId: correlationContext.current()?.correlationId,
      message,
      trace,
    });
    process.stdout.write(`${JSON.stringify(entry)}\n`);
  }
}
