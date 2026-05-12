import ApiService from "./ApiService";

class StockInApi extends ApiService {
    constructor() {
        super('stock-in-receipts');
    }

    async getList(params: any) {
        const res = await this.get('', params);
        return res.data;
    }

    async createReceipt(body: any) {
        const res = await this.post('', body);
        return res.data;
    }

    async updateReceipt(id: string, body: any) {
        const res = await this.put(`/${id}`, body);
        return res.data;
    }

    async getDetail(id: string) {
        const res = await this.get(`/${id}`);
        return res.data;
    }

    async deleteReceipt(id: string) {
        const res = await this.delete(`/${id}`);
        return res.data;
    }
}

export default new StockInApi();
