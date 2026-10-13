import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  ACCESS_TOKEN_VERIFIER,
  AccessTokenVerifier,
  AuthenticatedPrincipal,
  SESSION_REVOCATION_STORE,
  SessionRevocationStore,
} from './principal';
import { IS_PUBLIC_ROUTE } from './public-route.decorator';
import { ApplicationError, ErrorCode } from '../http/errors';

type PrincipalRequest = Request & { principal?: AuthenticatedPrincipal };

@Injectable()
export class TargetAuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ACCESS_TOKEN_VERIFIER) private readonly tokenVerifier: AccessTokenVerifier,
    @Inject(SESSION_REVOCATION_STORE)
    private readonly revocationStore: SessionRevocationStore,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<PrincipalRequest>();
    const token = this.extractBearerToken(request.headers.authorization);
    let verified;
    try {
      verified = await this.tokenVerifier.verify(token);
    } catch {
      throw new ApplicationError(
        ErrorCode.AUTHENTICATION_INVALID,
        401,
        'Authentication token is invalid',
      );
    }

    if (await this.revocationStore.isRevoked(verified.sessionId)) {
      throw new ApplicationError(
        ErrorCode.AUTHENTICATION_REQUIRED,
        401,
        'Session is no longer active',
      );
    }

    request.principal = {
      userId: verified.subject,
      sessionId: verified.sessionId,
      platformRole: verified.platformRole,
      candidateId: verified.candidateId,
    };
    return true;
  }

  private extractBearerToken(header: string | undefined): string {
    const match = header?.match(/^Bearer ([^\s]+)$/i);
    if (!match) {
      throw new ApplicationError(
        ErrorCode.AUTHENTICATION_REQUIRED,
        401,
        'Bearer authentication is required',
      );
    }
    return match[1];
  }
}
