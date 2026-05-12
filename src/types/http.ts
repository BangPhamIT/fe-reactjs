export interface PagingRequest {
    page: number;
    size: number;
    sorting?: { sortKey: string; sortDir: 'ASC' | 'DESC' }[];
}

export interface PagingResponse<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
}
