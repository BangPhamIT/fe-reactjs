import { describe, it, expect } from 'vitest';
import { validateSchema } from '../pages/dialogs/StockInForm';

describe('StockInForm Validation Schema', () => {
    const validData = {
        receiptNumber: 'PNK001',
        receiptDate: '2024-05-12',
        warehouseId: 'wh-1',
        delivererName: 'Nguyen Van A',
        receiverId: 'emp-1',
        creatorId: 'emp-2',
        warehouseKeeperId: 'emp-3',
        chiefAccountantId: 'emp-4',
        items: [
            {
                productName: 'Sản phẩm 1',
                quantityDocument: 10,
                quantityActual: 10,
                unitPrice: 5000
            }
        ]
    };

    it('should pass with valid data', async () => {
        const isValid = await validateSchema.isValid(validData);
        expect(isValid).toBe(true);
    });

    it('should fail if receiptNumber is missing', async () => {
        const invalidData = { ...validData, receiptNumber: '' };
        const isValid = await validateSchema.isValid(invalidData);
        expect(isValid).toBe(false);
    });

    it('should fail if items list is empty', async () => {
        const invalidData = { ...validData, items: [] };
        const isValid = await validateSchema.isValid(invalidData);
        expect(isValid).toBe(false);
    });

    it('should fail if quantityActual is negative', async () => {
        const invalidData = { 
            ...validData, 
            items: [{ ...validData.items[0], quantityActual: -1 }] 
        };
        const isValid = await validateSchema.isValid(invalidData);
        expect(isValid).toBe(false);
    });

    it('should fail if productName is missing in items', async () => {
        const invalidData = { 
            ...validData, 
            items: [{ ...validData.items[0], productName: '' }] 
        };
        const isValid = await validateSchema.isValid(invalidData);
        expect(isValid).toBe(false);
    });
});
