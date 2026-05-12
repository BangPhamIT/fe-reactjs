import { action, makeObservable, observable, runInAction } from "mobx";
import EmployeeApi from "../apis/EmployeeApi";
import BaseStore from "./BaseStore";
import type RootStore from "./index";

export interface IEmployee {
    id: string;
    fullName: string;
    employeeCode: string;
    department?: string;
    position: number;
}

export default class EmployeeStore extends BaseStore {
    employees: IEmployee[] = [];
    loading: boolean = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            employees: observable,
            loading: observable,
            fetchEmployees: action.bound
        });
    }

    async fetchEmployees() {
        this.loading = true;
        try {
            const data = await EmployeeApi.getAll();
            runInAction(() => {
                this.employees = data;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            console.error("Failed to fetch employees", error);
        }
    }
}
