import { observer } from 'mobx-react-lite';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { rootStore } from '@/store';

export default observer(function Modals() {
    const { modalStore: { instances, hideModal } } = rootStore;

    return (
        <>
            {instances.map((modal, index) => (
                <Dialog
                    key={modal.id ?? index}
                    open={true}
                    onClose={() => modal.closeWhenOutside && hideModal(modal.id)}
                    fullWidth
                    maxWidth={modal.width || "lg"}
                >
                    <DialogTitle>
                        <Typography variant="h6" className={modal.titleClassName}>
                            {modal.title}
                        </Typography>
                        {modal.showCloseIcon && (
                            <IconButton
                                aria-label="close"
                                onClick={() => hideModal(modal.id)}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </DialogTitle>
                    <DialogContent dividers>
                        {modal.description && (
                            <Typography className="mb-4">{modal.description}</Typography>
                        )}
                        {modal.content}
                    </DialogContent>
                    {(modal.footer || modal.cancelButton || modal.saveButton) && (
                        <DialogActions>
                            {modal.footer ? (
                                modal.footer
                            ) : (
                                <div className="flex gap-2 p-2">
                                    {modal.cancelButton && (
                                        <Button
                                            onClick={() => modal.onCancel ? modal.onCancel() : hideModal(modal.id)}
                                        >
                                            {modal.cancelButton}
                                        </Button>
                                    )}
                                    {modal.saveButton && (
                                        <Button
                                            onClick={() => modal.onSave && modal.onSave()}
                                            variant="contained"
                                            color="primary"
                                        >
                                            {modal.saveButton}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </DialogActions>
                    )}
                </Dialog>
            ))}
        </>
    );
});
