import { describe, it, expect, beforeEach, vi } from 'vitest';
import EmployeeStore from '../store/EmployeeStore';
import WarehouseStore from '../store/WarehouseStore';
import EmployeeApi from '../apis/EmployeeApi';
import WarehouseApi from '../apis/WarehouseApi';

// Mock các API
vi.mock('../apis/EmployeeApi');
vi.mock('../apis/WarehouseApi');

const mockRootStore = {} as any;

describe('Master Data Stores', () => {
    
    describe('EmployeeStore', () => {
        let employeeStore: EmployeeStore;

        beforeEach(() => {
            vi.clearAllMocks();
            // Ẩn log lỗi khi chạy test để màn hình gọn gàng hơn
            vi.spyOn(console, 'error').mockImplementation(() => {});
            employeeStore = new EmployeeStore(mockRootStore);
        });

        it('should fetch and store employees correctly', async () => {
            const mockData = [
                { id: '1', fullName: 'Employee 1', position: 1, employeeCode: 'EMP1' },
                { id: '2', fullName: 'Employee 2', position: 2, employeeCode: 'EMP2' }
            ];
            vi.mocked(EmployeeApi.getAll).mockResolvedValue(mockData);

            await employeeStore.fetchEmployees();

            expect(employeeStore.employees).toEqual(mockData);
            expect(employeeStore.loading).toBe(false);
        });

        it('should handle fetch errors', async () => {
            vi.mocked(EmployeeApi.getAll).mockRejectedValue(new Error('Network error'));
            
            await employeeStore.fetchEmployees();

            expect(employeeStore.employees).toEqual([]);
            expect(employeeStore.loading).toBe(false);
        });
    });

    describe('WarehouseStore', () => {
        let warehouseStore: WarehouseStore;

        beforeEach(() => {
            vi.clearAllMocks();
            warehouseStore = new WarehouseStore(mockRootStore);
        });

        it('should fetch and store warehouses correctly', async () => {
            const mockData = [
                { id: 'w1', name: 'Warehouse 1', warehouseCode: 'WH1' },
                { id: 'w2', name: 'Warehouse 2', warehouseCode: 'WH2' }
            ];
            vi.mocked(WarehouseApi.getAll).mockResolvedValue(mockData);

            await warehouseStore.fetchWarehouses();

            expect(warehouseStore.warehouses).toEqual(mockData);
        });
    });
});
