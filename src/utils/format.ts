export const formatCurrency = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberPriceToWordsInVnd = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null || amount === '') return 'Không đồng';

    let num = typeof amount === 'string' ? parseInt(amount) : Math.floor(amount);
    if (isNaN(num) || num <= 0) return 'Không đồng';

    const units = ['', 'ngàn', 'triệu', 'tỷ', 'ngàn tỷ', 'triệu tỷ'];
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    const readThreeDigits = (n: number, showZero: boolean): string => {
        let res = '';
        const hundred = Math.floor(n / 100);
        const ten = Math.floor((n % 100) / 10);
        const unit = n % 10;

        if (hundred > 0 || showZero) {
            res += digits[hundred] + ' trăm ';
        }

        if (ten > 0) {
            if (ten === 1) res += 'mười ';
            else res += digits[ten] + ' mươi ';
        } else if ((hundred > 0 || showZero) && unit > 0) {
            res += 'lẻ ';
        }

        if (unit > 0) {
            if (unit === 1 && ten > 1) res += 'mốt';
            else if (unit === 5 && ten > 0) res += 'lăm';
            else res += digits[unit];
        }

        return res.trim();
    };

    let words = '';
    let unitIndex = 0;

    do {
        const threeDigits = num % 1000;
        if (threeDigits > 0) {
            const part = readThreeDigits(threeDigits, num >= 1000);
            words = part + ' ' + units[unitIndex] + ' ' + words;
        } else if (num >= 1000 && words.trim().length > 0 && !words.trim().startsWith('không trăm')) {
            words = 'không trăm ' + units[unitIndex] + ' ' + words;
        }
        num = Math.floor(num / 1000);
        unitIndex++;
    } while (num > 0);

    const result = words.trim();
    if (result.length === 0) return 'Không đồng';

    const finalResult = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
    return finalResult.replace(/\s+/g, ' ');
};
