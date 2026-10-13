export type PlatformRole = 'PLATFORM_ADMIN';

export type AuthenticatedPrincipal = Readonly<{
  userId: string;
  sessionId: string;
  platformRole?: PlatformRole;
  candidateId?: string;
}>;

export type VerifiedAccessToken = Readonly<{
  subject: string;
  sessionId: string;
  platformRole?: PlatformRole;
  candidateId?: string;
}>;

export interface AccessTokenVerifier {
  verify(token: string): Promise<VerifiedAccessToken>;
}

export interface SessionRevocationStore {
  isRevoked(sessionId: string): Promise<boolean>;
}

export const ACCESS_TOKEN_VERIFIER = Symbol('ACCESS_TOKEN_VERIFIER');
export const SESSION_REVOCATION_STORE = Symbol('SESSION_REVOCATION_STORE');
