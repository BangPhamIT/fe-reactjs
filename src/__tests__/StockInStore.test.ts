import { describe, it, expect, beforeEach } from 'vitest';
import StockInStore from '../store/StockInStore';

// Giả lập RootStore vì StockInStore cần nó trong constructor
const mockRootStore = {} as any;

describe('StockInStore', () => {
    let stockInStore: StockInStore;

    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        stockInStore = new StockInStore(mockRootStore);
    });

    describe('sanitizeData', () => {
        it('should calculate totalAmount correctly from items', () => {
            const input = {
                items: [
                    { quantityActual: 2, unitPrice: 5000 },
                    { quantityActual: 3, unitPrice: 10000 }
                ]
            };
            const result = stockInStore.sanitizeData(input);
            expect(result.totalAmount).toBe(40000); // (2*5000) + (3*10000) = 10000 + 30000 = 40000
        });

        it('should handle empty or null items gracefully', () => {
            const input = { items: [] };
            const result = stockInStore.sanitizeData(input);
            expect(result.totalAmount).toBe(0);
            expect(result.items.length).toBe(0);
        });

        it('should ensure numeric values for quantity and price', () => {
            const input = {
                items: [
                    { quantityActual: '5', unitPrice: '2000' } // Nhập liệu dạng chuỗi
                ]
            };
            const result = stockInStore.sanitizeData(input);
            expect(typeof result.items[0].quantityActual).toBe('number');
            expect(result.items[0].quantityActual).toBe(5);
            expect(result.totalAmount).toBe(10000);
        });

        it('should fill default values for missing fields', () => {
            const input = {
                receiptNumber: 'PNK001',
                // thiếu các field khác
            };
            const result = stockInStore.sanitizeData(input);
            expect(result.receiptNumber).toBe('PNK001');
            expect(result.companyName).toBe('');
            expect(result.note).toBe('');
        });
    });
});
