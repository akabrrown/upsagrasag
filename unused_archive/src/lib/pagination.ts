// lib/pagination.ts
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Extract page and limit from URLSearchParams with defaults */
export function getPagination(params: URLSearchParams, defaultLimit = 20) {
  const page = parseInt(params.get('page') ?? '1', 10);
  const limit = parseInt(params.get('limit') ?? String(defaultLimit), 10);
  return { page: Math.max(page, 1), limit: Math.max(limit, 1) };
}
