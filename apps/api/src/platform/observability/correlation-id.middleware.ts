import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { correlationContext } from './correlation-context';

type CorrelatedRequest = Request & { correlationId?: string };

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: CorrelatedRequest, response: Response, next: NextFunction): void {
    const header = request.header('x-correlation-id');
    const correlationId =
      header && /^[A-Za-z0-9_-]{1,128}$/.test(header) ? header : randomUUID();
    request.correlationId = correlationId;
    response.setHeader('x-correlation-id', correlationId);
    correlationContext.run({ correlationId }, next);
  }
}
