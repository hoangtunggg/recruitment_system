export type PageRequest = Readonly<{
  limit?: number;
  cursor?: string;
  order?: 'ASC' | 'DESC';
}>;

export type NormalizedPageRequest = Readonly<{
  limit: number;
  cursor?: string;
  order: 'ASC' | 'DESC';
}>;

export function normalizePageRequest(
  request: PageRequest,
  defaults: Readonly<{ defaultLimit: number; maxLimit: number }>,
): NormalizedPageRequest {
  const limit = request.limit ?? defaults.defaultLimit;
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > defaults.maxLimit) {
    throw new InputRangeError('limit must be within the configured page range');
  }

  if (request.cursor && !/^[A-Za-z0-9_-]{1,512}$/.test(request.cursor)) {
    throw new InputRangeError('cursor has an unsafe format');
  }

  return { limit, cursor: request.cursor, order: request.order ?? 'DESC' };
}

export class InputRangeError extends Error {}
