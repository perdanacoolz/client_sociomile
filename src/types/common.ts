
export interface BaseEntity {
    createdAt?: string;
    updatedBy?: string | null; 
}

export interface PagedResponse<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items: T[];
}

export interface ApiFilter {
    Filters?: string;
    Sorts?: string;
    Page?: number;
    PageSize?: number;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    isError: boolean;
    data: T;
}
