export interface PaginatedResult<T> {
  collection: T[];
  currentPage: number;
  pageSize: number;
  totalPageCount: number;
  totalItemCount: number;
}
