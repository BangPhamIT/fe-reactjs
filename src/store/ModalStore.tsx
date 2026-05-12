import { action, makeAutoObservable, observable } from 'mobx';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { ErrorOutline, CheckCircleOutline, InfoOutlined, HelpOutline } from '@mui/icons-material';
import { MESSAGES } from '@/configs/messages';
import { TEXTS } from '@/configs/texts';

export default class ModalStore {
    instances: ModalInstance[] = [];
    hasErrorModal = false;

    constructor() {
        makeAutoObservable(this, {
            instances: observable,
            hasErrorModal: observable,
            showModal: action.bound,
            hideModal: action.bound,
            hideAllModals: action.bound,
            showAlertModal: action.bound,
        });
    }

    showModal(options: Partial<ModalInstance>) {
        const instance = new ModalInstance(options);
        this.instances.push(instance);
    }

    hideModal(id?: string) {
        const removingInstance = id
            ? this.instances.find(ins => ins.id === id)
            : this.instances[this.instances.length - 1];
        if (removingInstance?.isErrorModal) {
            this.hasErrorModal = false;
        }
        if (id) {
            this.instances = this.instances.filter(ins => ins.id !== id);
        } else {
            this.instances.splice(-1, 1);
        }
    }

    hideAllModals() {
        this.instances = [];
        this.hasErrorModal = false;
    }

    showAlertModal(options: { 
        type?: 'error' | 'success' | 'info' | 'confirm'; 
        title?: string; 
        content: string;
        saveButton?: string;
        cancelButton?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }) {
        const { 
            type = 'info', 
            title, 
            content, 
            onConfirm, 
            onCancel,
            saveButton = TEXTS.BUTTONS.CONFIRM,
            cancelButton 
        } = options;
        
        let icon = <InfoOutlined color="info" sx={{ fontSize: 60, mb: 2 }} />;
        let titleColor = 'info.main';
        
        if (type === 'error') {
            icon = <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />;
            titleColor = 'error.main';
        } else if (type === 'success') {
            icon = <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />;
            titleColor = 'success.main';
        } else if (type === 'confirm') {
            icon = <HelpOutline color="warning" sx={{ fontSize: 60, mb: 2 }} />;
            titleColor = 'warning.main';
        }

        if (type === 'error' && this.hasErrorModal) return;
        if (type === 'error') this.hasErrorModal = true;

        this.showModal({
            title: title || (type === 'confirm' ? MESSAGES.CONFIRM.GENERAL_TITLE : MESSAGES.TITLE.NOTIFICATION),
            isErrorModal: type === 'error',
            showCloseIcon: true,
            content: (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    {icon}
                    <Typography variant="h6" sx={{ color: titleColor, mb: 1, fontWeight: 'bold' }}>
                        {type === 'confirm' ? MESSAGES.CONFIRM.GENERAL_CONTENT : (type === 'error' ? MESSAGES.TITLE.ERROR_OCCURRED : MESSAGES.TITLE.SYSTEM_INFO)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {content}
                    </Typography>
                </Box>
            ),
            cancelButton: cancelButton,
            onCancel: () => {
                this.hideModal();
                onCancel?.();
            },
            saveButton: type === 'error' ? undefined : saveButton,
            onSave: () => {
                this.hideModal();
                onConfirm?.();
            },
            width: 'sm'
        });
    }
}

export class ModalInstance {
    id?: string;
    title?: string;
    titleClassName?: string;
    description?: string;
    showCloseIcon?: boolean;
    content?: React.ReactNode;
    contentClassName?: string;
    closeWhenOutside?: boolean;
    footer?: React.ReactNode;
    cancelButton?: React.ReactNode;
    onCancel?: Function;
    saveButton?: React.ReactNode;
    onSave?: Function;
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isErrorModal?: boolean;

    constructor(options: Partial<ModalInstance> = {}) {
        this.id = options.id || Math.random().toString(36).substring(7);
        this.title = options.title;
        this.titleClassName = options.titleClassName;
        this.description = options.description;
        this.showCloseIcon = options.showCloseIcon ?? true;
        this.content = options.content;
        this.contentClassName = options.contentClassName;
        this.closeWhenOutside = options.closeWhenOutside ?? false;
        this.footer = options.footer;
        this.cancelButton = options.cancelButton;
        this.onCancel = options.onCancel;
        this.saveButton = options.saveButton;
        this.onSave = options.onSave;
        this.width = options.width || 'lg';
        this.isErrorModal = options.isErrorModal ?? false;
    }
}
