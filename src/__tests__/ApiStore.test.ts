import { describe, it, expect, beforeEach, vi } from 'vitest';
import ApiStore from '../store/ApiStore';
import { MESSAGES } from '@/configs/messages';

describe('ApiStore', () => {
    let apiStore: ApiStore;
    let mockModalStore: any;
    let mockRootStore: any;

    beforeEach(() => {
        // Mock ModalStore
        mockModalStore = {
            showAlertModal: vi.fn()
        };
        
        // Mock RootStore chứa ModalStore
        mockRootStore = {
            modalStore: mockModalStore
        };

        // Ẩn log lỗi khi chạy test
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});

        apiStore = new ApiStore(mockRootStore);
    });

    describe('handlerGeneralResponseError', () => {
        it('should show error modal for 500 status', () => {
            const mockErrorResponse = {
                status: 500,
                data: { message: 'Internal Server Error' }
            };

            try {
                apiStore.handlerGeneralResponseError(mockErrorResponse);
            } catch (e) {
                // Mong đợi error được ném ra tiếp
            }

            expect(mockModalStore.showAlertModal).toHaveBeenCalledWith({
                type: 'error',
                content: MESSAGES.ERROR.SYSTEM_500
            });
        });

        it('should show custom message for other error statuses', () => {
            const mockErrorResponse = {
                status: 400,
                data: { message: 'Invalid data' }
            };

            try {
                apiStore.handlerGeneralResponseError(mockErrorResponse);
            } catch (e) {}

            expect(mockModalStore.showAlertModal).toHaveBeenCalledWith({
                type: 'error',
                content: 'Invalid data'
            });
        });

        it('should show network error message when no response status', () => {
            const mockError = new Error('Network Error');
            
            try {
                apiStore.handlerGeneralResponseError(mockError);
            } catch (e) {}

            expect(mockModalStore.showAlertModal).toHaveBeenCalledWith({
                type: 'error',
                content: MESSAGES.ERROR.NETWORK_ERROR
            });
        });
    });

    describe('call method', () => {
        it('should manage loading state during API call', async () => {
            const mockPromise = Promise.resolve('success');
            
            const callPromise = apiStore.call(mockPromise);
            expect(apiStore.isLoading).toBe(true);
            
            await callPromise;
            expect(apiStore.isLoading).toBe(false);
        });

        it('should hide loading even if API fails', async () => {
            const mockPromise = Promise.reject({ response: { status: 500 } });
            
            try {
                await apiStore.call(mockPromise);
            } catch (e) {}
            
            expect(apiStore.isLoading).toBe(false);
        });
    });
});
