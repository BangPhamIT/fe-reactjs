import { describe, it, expect, beforeEach } from 'vitest';
import ModalStore from '../store/ModalStore';

describe('ModalStore', () => {
    let modalStore: ModalStore;

    beforeEach(() => {
        modalStore = new ModalStore();
    });

    it('should show a modal', () => {
        modalStore.showModal({ title: 'Test Modal', content: 'Hello' });
        expect(modalStore.instances.length).toBe(1);
        expect(modalStore.instances[0].title).toBe('Test Modal');
    });

    it('should hide a modal', () => {
        modalStore.showModal({ title: 'Modal 1' });
        modalStore.hideModal();
        expect(modalStore.instances.length).toBe(0);
    });

    it('should handle error modal deduplication', () => {
        // Lần đầu hiện lỗi
        modalStore.showAlertModal({ type: 'error', content: 'Error 1' });
        expect(modalStore.instances.length).toBe(1);
        expect(modalStore.hasErrorModal).toBe(true);

        // Lần thứ hai hiện lỗi khi lỗi cũ chưa đóng -> không hiện thêm
        modalStore.showAlertModal({ type: 'error', content: 'Error 2' });
        expect(modalStore.instances.length).toBe(1);
        expect(modalStore.instances[0].content?.toString()).not.toContain('Error 2');
    });

    it('should reset error flag when modal is hidden', () => {
        modalStore.showAlertModal({ type: 'error', content: 'Error' });
        modalStore.hideModal();
        expect(modalStore.hasErrorModal).toBe(false);
    });
});
