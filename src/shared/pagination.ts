import { AppError } from '@vaur94/mcpbase';

export interface PaginationInput {
  readonly page?: number;
  readonly pageSize?: number;
}

export interface PaginationState {
  readonly page: number;
  readonly pageSize: number;
  readonly offset: number;
}

export function normalizePagination(
  input: PaginationInput,
  defaultPageSize: number,
  maxPageSize = 100,
): PaginationState {
  const page = input.page ?? 1;
  const requestedPageSize = input.pageSize ?? defaultPageSize;

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError('CONFIG_ERROR', 'page alani 1 veya daha buyuk tam sayi olmali.');
  }

  if (!Number.isInteger(requestedPageSize) || requestedPageSize < 1) {
    throw new AppError('CONFIG_ERROR', 'pageSize alani 1 veya daha buyuk tam sayi olmali.');
  }

  const pageSize = Math.min(requestedPageSize, maxPageSize);

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}
