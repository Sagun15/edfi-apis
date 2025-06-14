export type PaginationParams = {
  limit: number;
  offset: number;
};

export type PaginationLinkParams = {
  first: PaginationParams;
  last: PaginationParams;
  next: PaginationParams;
  previous: PaginationParams;
};
