import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StockInForm from '../pages/dialogs/StockInForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { rootStore } from '@/store';
import { TEXTS } from '@/configs/texts';

// Mock rootStore
vi.mock('@/store', () => ({
    rootStore: {
        employeeStore: {
            employees: [],
            fetchEmployees: vi.fn(),
        },
        warehouseStore: {
            warehouses: [],
            fetchWarehouses: vi.fn(),
        },
        stockInStore: {
            sanitizeData: (values: any) => values, // Mock đơn giản cho sanitize
        }
    }
}));

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {ui}
        </LocalizationProvider>
    );
};

describe('StockInForm Component', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the form with initial state and new reference fields', () => {
        renderWithProviders(<StockInForm onSave={mockOnSave} onCancel={mockOnCancel} />);
        
        expect(screen.getByText(TEXTS.STOCK_IN.FORM_HEADER)).toBeInTheDocument();
        // Kiểm tra các trường mới
        expect(screen.getByLabelText(TEXTS.LABELS.REFERENCE_TYPE)).toBeInTheDocument();
        expect(screen.getByLabelText(TEXTS.LABELS.REFERENCE_NUMBER)).toBeInTheDocument();
        expect(screen.getByLabelText(TEXTS.LABELS.REFERENCE_DATE)).toBeInTheDocument();
        expect(screen.getByLabelText(TEXTS.LABELS.REFERENCE_ISSUER)).toBeInTheDocument();
        
        // Kiểm tra xem có mặc định 1 dòng hàng hóa không
        expect(screen.getAllByPlaceholderText(TEXTS.LABELS.PRODUCT_NAME).length).toBe(1);
    });

    it('should add a new item row when "Add Item" button is clicked', async () => {
        renderWithProviders(<StockInForm onSave={mockOnSave} onCancel={mockOnCancel} />);
        
        const addButton = screen.getByTestId('add-item-button');
        fireEvent.click(addButton);

        // Đợi dòng mới xuất hiện
        await waitFor(() => {
            expect(screen.getAllByPlaceholderText(TEXTS.LABELS.PRODUCT_NAME).length).toBe(2);
        });
    });

    it('should remove an item row when delete icon is clicked', async () => {
        renderWithProviders(<StockInForm onSave={mockOnSave} onCancel={mockOnCancel} />);
        
        // Thêm 1 dòng để có tổng cộng 2 dòng
        fireEvent.click(screen.getByTestId('add-item-button'));
        
        await waitFor(() => {
            expect(screen.getAllByPlaceholderText(TEXTS.LABELS.PRODUCT_NAME).length).toBe(2);
        });

        // Tìm tất cả các nút xóa
        const deleteButtons = screen.getAllByTestId('delete-item-button');
        // Nhấn xóa dòng thứ 2
        fireEvent.click(deleteButtons[1]);

        // Số lượng dòng quay lại là 1
        await waitFor(() => {
            expect(screen.getAllByPlaceholderText(TEXTS.LABELS.PRODUCT_NAME).length).toBe(1);
        });
    });

    it('should call onCancel when Cancel button is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<StockInForm onSave={mockOnSave} onCancel={mockOnCancel} />);
        
        const cancelButton = screen.getByText(TEXTS.BUTTONS.CANCEL);
        await user.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });
});
