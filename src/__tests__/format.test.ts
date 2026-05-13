import { describe, it, expect } from 'vitest';
import { formatCurrency, numberPriceToWordsInVnd } from '../utils/format';

describe('formatCurrency', () => {
    it('should format numbers with commas', () => {
        expect(formatCurrency(1000)).toBe('1,000');
        expect(formatCurrency(1000000)).toBe('1,000,000');
    });

    it('should handle string input', () => {
        expect(formatCurrency('2500')).toBe('2,500');
    });

    it('should return "0" for invalid inputs', () => {
        expect(formatCurrency(undefined)).toBe('0');
        expect(formatCurrency(null)).toBe('0');
        expect(formatCurrency('abc')).toBe('0');
    });
});

describe('numberPriceToWordsInVnd', () => {
    it('should convert numbers to Vietnamese words', () => {
        expect(numberPriceToWordsInVnd(1000)).toBe('Một ngàn đồng');
        expect(numberPriceToWordsInVnd(1500000)).toBe('Một triệu năm trăm ngàn đồng');
        expect(numberPriceToWordsInVnd(1000000)).toBe('Một triệu đồng');
    });

    it('should handle zero and invalid inputs', () => {
        expect(numberPriceToWordsInVnd(0)).toBe('Không đồng');
        expect(numberPriceToWordsInVnd(null)).toBe('Không đồng');
        expect(numberPriceToWordsInVnd(-100)).toBe('Không đồng');
    });

    it('should format special cases (lăm, mốt, lẻ)', () => {
        expect(numberPriceToWordsInVnd(15)).toBe('Mười lăm đồng');
        expect(numberPriceToWordsInVnd(21)).toBe('Hai mươi mốt đồng');
        expect(numberPriceToWordsInVnd(105)).toBe('Một trăm lẻ năm đồng');
    });

    it('should handle middle zero groups correctly (không trăm - compact)', () => {
        // Trường hợp 1.000.005 -> Bây giờ sẽ gọn hơn
        expect(numberPriceToWordsInVnd(1000005)).toBe('Một triệu không trăm lẻ năm đồng');
        
        // Trường hợp 1.005.000
        expect(numberPriceToWordsInVnd(1005000)).toBe('Một triệu không trăm lẻ năm ngàn đồng');

        // Trường hợp hàng tỷ -> Rất gọn
        expect(numberPriceToWordsInVnd(1000000000)).toBe('Một tỷ đồng');
        expect(numberPriceToWordsInVnd(1000000001)).toBe('Một tỷ không trăm lẻ một đồng');
    });
});
