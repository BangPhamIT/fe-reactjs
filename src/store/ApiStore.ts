import { action, makeObservable, observable } from 'mobx';
import type RootStore from './index';
import BaseStore from './BaseStore';
import { MESSAGES } from '@/configs/messages';

export interface CallApiOptions {
    handleErrorBySelf?: boolean,
    callbackError?: (response: any) => void,
    disableAlertError?: boolean,
    hideLoading?: boolean,
}

export default class ApiStore extends BaseStore {
    isLoading = false;

    constructor(rootStore: RootStore) {
        super(rootStore);
        makeObservable(this, {
            isLoading: observable,
            showLoading: action.bound,
            hideLoading: action.bound,
            handlerGeneralResponseError: action.bound,
            call: action.bound
        });
    }

    showLoading() {
        this.isLoading = true;
    }

    hideLoading() {
        this.isLoading = false;
    }

    handlerGeneralResponseError(
        response?: any,
        options: CallApiOptions = {}
    ) {
        const { handleErrorBySelf, callbackError, disableAlertError } = options;

        if (handleErrorBySelf || !response) {
            throw response;
        }

        const message = response.data?.message || response.message || MESSAGES.ERROR.GENERAL;

        if (response.status === 401 || response.status === 403) {
            console.warn(MESSAGES.ERROR.UNAUTHORIZED);
        } else if (response.status >= 500) {
            this.rootStore.modalStore.showAlertModal({
                type: 'error',
                content: MESSAGES.ERROR.SYSTEM_500
            });
        } else if (response.status) {
            if (!disableAlertError) {
                this.rootStore.modalStore.showAlertModal({
                    type: 'error',
                    content: message
                });
            }
            callbackError && callbackError(response);
        } else {
            this.rootStore.modalStore.showAlertModal({
                type: 'error',
                content: MESSAGES.ERROR.NETWORK_ERROR
            });
        }

        throw response;
    }

    async call(
        request: Promise<any>,
        options: CallApiOptions = {}
    ): Promise<any> {
        const { hideLoading } = options;
        if (!hideLoading) this.showLoading();

        try {
            const response = await request;
            return response;
        } catch (error: any) {
            return this.handlerGeneralResponseError(error.response || error, options);
        } finally {
            if (!hideLoading) this.hideLoading();
        }
    }
}
