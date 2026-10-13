import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { toProblemDetails } from './errors';

type CorrelatedRequest = Request & { correlationId?: string };

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<CorrelatedRequest>();
    const response = context.getResponse<Response>();
    const problem = toProblemDetails(exception, request.correlationId);

    response.status(problem.status).json(problem);
  }
}
