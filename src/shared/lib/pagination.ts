export const hasPreviousPage = (page: number): boolean => page > 1;

export const hasNextPage = (page: number, pageSize: number, total: number): boolean =>
  page * pageSize < total;
