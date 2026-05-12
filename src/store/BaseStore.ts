import { action, makeObservable, observable } from 'mobx';
import type RootStore from './index';
import type { PagingRequest } from '../types/http';

interface SetObservableProps {
    isMergeObject?: boolean
}

export default class BaseStore {
    rootStore: RootStore;
    [key: string]: any;

    get defaultPaging() {
        return {
            pagination: { pageIndex: 0, pageSize: 20 },
            sorting: [] as any[]
        };
    }

    totalRecord = 0;
    paging = this.defaultPaging;

    keepSearchParams?: Record<string, any> = undefined;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            totalRecord: observable,
            paging: observable,
            clean: action.bound,
            keepSearchParams: observable,
            setObservable: action.bound,
            resetPaging: action.bound
        });
        this.rootStore = rootStore;
    }

    setObservable(
        field: string,
        value: unknown,
        options?: SetObservableProps
    ) {
        this[field] = options?.isMergeObject && value instanceof Object ?
            { ...(this[field] || {}), ...value } :
            value;
    }

    resetPaging() {
        this.paging = this.defaultPaging;
    }

    convertPagingFromTableToRequest(paging: any): PagingRequest {
        return {
            page: paging.pagination.pageIndex + 1,
            size: paging.pagination.pageSize,
            sorting: paging.sorting.filter((sort: any) => sort.id).map((sort: any) => ({
                sortKey: sort.id,
                sortDir: sort.desc ? 'DESC' : 'ASC'
            }))
        };
    }

    convertPaginationFromRequestToTable(pagination: { page: number; size: number; }) {
        return {
            pageIndex: pagination.page - 1,
            pageSize: pagination.size
        };
    }

    clean() {
        this.paging = this.defaultPaging;
        this.keepSearchParams = undefined;
    }
}
