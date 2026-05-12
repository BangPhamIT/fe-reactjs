import { action, makeObservable, observable, runInAction } from "mobx";
import WarehouseApi from "../apis/WarehouseApi";
import BaseStore from "./BaseStore";
import type RootStore from "./index";

export interface IWarehouse {
    id: string;
    warehouseCode: string;
    name: string;
    location?: string;
}

export default class WarehouseStore extends BaseStore {
    warehouses: IWarehouse[] = [];
    loading: boolean = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            warehouses: observable,
            loading: observable,
            fetchWarehouses: action.bound
        });
    }

    async fetchWarehouses() {
        this.loading = true;
        try {
            const data = await WarehouseApi.getAll();
            runInAction(() => {
                this.warehouses = data;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            console.error("Failed to fetch warehouses", error);
        }
    }
}
