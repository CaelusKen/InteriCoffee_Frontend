//For Response
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }
  
// Paginated response interface
export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}