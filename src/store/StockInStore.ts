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

    sanitizeData(values: any) {
        const total = (values.items || []).reduce((sum: number, item: any) => {
            return sum + (Number(item.quantityActual || 0) * Number(item.unitPrice || 0));
        }, 0);

        return {
            receiptNumber: values.receiptNumber || '',
            receiptDate: values.receiptDate || '',
            companyName: values.companyName || '',
            departmentName: values.departmentName || '',
            debtAccount: values.debtAccount || '',
            creditAccount: values.creditAccount || '',
            creatorId: values.creatorId || '',
            receiverId: values.receiverId || '',
            warehouseKeeperId: values.warehouseKeeperId || '',
            chiefAccountantId: values.chiefAccountantId || '',
            warehouseId: values.warehouseId || '',
            delivererName: values.delivererName || '',
            note: values.note || '',
            totalAmount: total,
            items: (values.items || []).map((item: any) => ({
                productCode: item.productCode || '',
                productName: item.productName || '',
                unit: item.unit || '',
                quantityDocument: Number(item.quantityDocument || 0),
                quantityActual: Number(item.quantityActual || 0),
                unitPrice: Number(item.unitPrice || 0),
            }))
        };
    }
}
