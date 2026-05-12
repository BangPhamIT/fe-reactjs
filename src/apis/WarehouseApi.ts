import ApiService from "./ApiService";

class WarehouseApi extends ApiService {
    constructor() {
        super('warehouses');
    }

    async getAll() {
        const res = await this.get('');
        return res.data;
    }
}

export default new WarehouseApi();
