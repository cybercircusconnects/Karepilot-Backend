export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPaginationParams = ({ page = 1, limit = 10 }: PaginationOptions) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, skip };
};

export const buildPaginationMeta = (total: number, page: number, limit: number): PaginationMeta => {
  const pages = Math.max(1, Math.ceil(total / limit) || 1);

  return {
    page,
    limit,
    total,
    pages,
    hasNextPage: page < pages,
    hasPreviousPage: page > 1,
  };
};


