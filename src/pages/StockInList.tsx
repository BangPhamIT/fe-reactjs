import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '@/store';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Chip,
    Paper,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileDownload as DownloadIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import StockInForm from './dialogs/StockInForm';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-toastify';
import { MESSAGES } from '@/configs/messages';
import { TEXTS, MRT_VI } from '@/configs/texts';

const StockInList: React.FC = observer(() => {
    const { stockInStore, modalStore } = rootStore;

    useEffect(() => {
        stockInStore.fetchList();
    }, [stockInStore.paging]);

    const handleDelete = (id: string) => {
        modalStore.showAlertModal({
            type: 'confirm',
            title: MESSAGES.CONFIRM.DELETE_TITLE,
            content: MESSAGES.CONFIRM.DELETE_CONTENT,
            saveButton: TEXTS.BUTTONS.AGREE_DELETE,
            cancelButton: TEXTS.BUTTONS.CANCEL,
            onConfirm: async () => {
                await stockInStore.deleteReceipt(id);
                toast.success(MESSAGES.SUCCESS.DELETE);
            }
        });
    };

    const handleAdd = () => {
        modalStore.showModal({
            title: TEXTS.STOCK_IN.FORM_TITLE_CREATE,
            content: (
                <StockInForm
                    onSave={async (data) => {
                        await stockInStore.createReceipt(data);
                        modalStore.hideModal();
                        toast.success(MESSAGES.SUCCESS.CREATE);
                        stockInStore.fetchList();
                    }}
                    onCancel={() => modalStore.hideModal()}
                />
            ),
            width: 'xl'
        });
    };

    const handleEdit = async (id: string) => {
        const data = await stockInStore.fetchDetail(id);
        modalStore.showModal({
            title: TEXTS.STOCK_IN.FORM_TITLE_UPDATE,
            content: (
                <StockInForm
                    initialData={data}
                    onSave={async (updatedData) => {
                        await stockInStore.updateReceipt(id, updatedData);
                        modalStore.hideModal();
                        toast.success(MESSAGES.SUCCESS.UPDATE);
                        stockInStore.fetchList();
                    }}
                    onCancel={() => modalStore.hideModal()}
                />
            ),
            width: 'xl'
        });
    };

    const columns = React.useMemo<MRT_ColumnDef<any>[]>(() => [
        {
            accessorKey: 'receiptNumber',
            header: TEXTS.TABLE.RECEIPT_NUMBER,
            size: 100,
            Cell: ({ cell }) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {cell.getValue<string>()}
                </Typography>
            )
        },
        {
            accessorKey: 'receiptDate',
            header: TEXTS.TABLE.DATE,
            size: 120,
            Cell: ({ cell }) => (
                <Typography variant="body2">
                    {new Date(cell.getValue<string>()).toLocaleDateString('vi-VN')}
                </Typography>
            )
        },
        {
            accessorKey: 'delivererName',
            header: TEXTS.TABLE.DELIVERER,
            size: 150,
        },
        {
            accessorKey: 'warehouse.name',
            header: TEXTS.TABLE.WAREHOUSE,
            size: 150,
            Cell: ({ row }) => (
                <Chip
                    label={row.original.warehouse?.name || '---'}
                    size="small"
                    sx={{
                        borderRadius: '6px',
                        fontWeight: 600,
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        color: 'primary.main',
                        border: '1px solid rgba(25, 118, 210, 0.2)'
                    }}
                />
            )
        },
        {
            accessorKey: 'totalAmount',
            header: TEXTS.TABLE.TOTAL,
            size: 150,
            Cell: ({ cell }) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                    {formatCurrency(cell.getValue<number>())} đ
                </Typography>
            )
        },
        {
            id: 'actions',
            header: TEXTS.TABLE.ACTIONS,
            size: 50,
            enableSorting: false,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Sửa">
                        <IconButton size="small" sx={{ color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.05)' }} onClick={() => handleEdit(row.original.id)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton size="small" sx={{ color: 'error.main', bgcolor: 'rgba(211, 47, 47, 0.05)' }} onClick={() => handleDelete(row.original.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ], []);

    return (
        <Box sx={{ px: 4, pt: 3, pb: 2, bgcolor: '#f8fafc', height: '100%', minHeight: '600px', minWidth: '900px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, flexShrink: 0 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, letterSpacing: '-0.02em' }}>
                        {TEXTS.STOCK_IN.LIST_TITLE}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {TEXTS.STOCK_IN.LIST_SUBTITLE}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => stockInStore.fetchList()}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 700,
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                            '&:hover': { boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)' }
                        }}
                    >
                        {TEXTS.STOCK_IN.CREATE_NEW}
                    </Button>
                </Box>
            </Box>

            <Paper sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: 0
            }}>
                <MaterialReactTable
                    columns={columns}
                    data={stockInStore.list}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    enablePagination={true}
                    enableSorting={true}
                    enableBottomToolbar={true}
                    enableTopToolbar={true}
                    enableStickyHeader={true}
                    muiTablePaperProps={{
                        elevation: 0,
                        sx: {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }
                    }}
                    muiTableContainerProps={{
                        sx: {
                            flexGrow: 1,
                            overflow: 'auto',
                            minHeight: 0,
                        }
                    }}
                    muiBottomToolbarProps={{
                        sx: {
                            flexShrink: 0,
                            minHeight: '52px',
                            '& .MuiTablePagination-root': { overflow: 'hidden' }
                        }
                    }}
                    muiTopToolbarProps={{
                        sx: { flexShrink: 0, minHeight: '52px' }
                    }}
                    initialState={{ density: 'compact' }}
                    localization={MRT_VI}
                    muiTableHeadCellProps={{
                        sx: {
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            py: 2
                        }
                    }}
                    state={{
                        isLoading: stockInStore.isLoading,
                    }}
                    manualPagination
                    rowCount={stockInStore.totalRecord}
                    onPaginationChange={(updater) => {
                        const nextPaging = typeof updater === 'function' ? updater(stockInStore.paging as any) : updater;
                        stockInStore.setObservable('paging', nextPaging);
                    }}
                />
            </Paper>
        </Box>
    );
});

export default StockInList;
