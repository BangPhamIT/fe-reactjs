import ApiService from "./ApiService";

class EmployeeApi extends ApiService {
    constructor() {
        super('employees');
    }

    async getAll() {
        const res = await this.get('');
        return res.data;
    }
}

export default new EmployeeApi();
