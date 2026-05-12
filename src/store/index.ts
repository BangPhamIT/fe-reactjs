import StockInStore from "./StockInStore";
import ModalStore from "./ModalStore";
import EmployeeStore from "./EmployeeStore";
import WarehouseStore from "./WarehouseStore";

export default class RootStore {
    stockInStore: StockInStore;
    modalStore: ModalStore;
    employeeStore: EmployeeStore;
    warehouseStore: WarehouseStore;

    constructor() {
        this.stockInStore = new StockInStore(this);
        this.modalStore = new ModalStore();
        this.employeeStore = new EmployeeStore(this);
        this.warehouseStore = new WarehouseStore(this);
    }
}

export const rootStore = new RootStore();
