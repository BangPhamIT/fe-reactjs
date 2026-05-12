import { action, makeObservable, observable, runInAction } from "mobx";
import ApiStore from "./ApiStore";
import type RootStore from "./index";
import StockInApi from "@/apis/StockInApi";

export default class StockInStore extends ApiStore {
    list: any[] = [];
    currentReceipt: any = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            list: observable,
            currentReceipt: observable,
            fetchList: action.bound,
            fetchDetail: action.bound,
            createReceipt: action.bound,
            updateReceipt: action.bound,
            deleteReceipt: action.bound
        });
    }

    async fetchList() {
        try {
            const params = this.convertPagingFromTableToRequest(this.paging);
            const data = await this.call(StockInApi.getList({ ...params, ...this.keepSearchParams }));
            
            runInAction(() => {
                this.list = data.elements || [];
                this.totalRecord = data.paginate?.totalRecord || 0;
            });
        } catch (error) {
            console.error("Error in fetchList:", error);
        }
    }

    async fetchDetail(id: string) {
        try {
            const data = await this.call(StockInApi.getDetail(id));
            runInAction(() => {
                this.currentReceipt = data;
            });
            return data;
        } catch (error) {
            console.error("Error in fetchDetail:", error);
        }
    }

    async createReceipt(data: any) {
        return this.call(StockInApi.createReceipt(data));
    }

    async updateReceipt(id: string, data: any) {
        return this.call(StockInApi.updateReceipt(id, data));
    }

    async deleteReceipt(id: string) {
        await this.call(StockInApi.deleteReceipt(id));
        await this.fetchList();
    }
}
