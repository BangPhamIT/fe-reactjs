import React, { useEffect, useMemo } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, FormField, FormSelect, FormNumericField } from '@/components/common/Form';
import { 
    Button, 
    Typography, 
    IconButton, 
    Grid2 as Grid, 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Divider
} from '@mui/material';
import { Add as PlusIcon, Delete as TrashIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { rootStore } from '@/store';
import { POSITIONS } from '@/configs/const';
import { formatCurrency, numberPriceToWordsInVnd } from '@/utils/format';
import { toast } from 'react-toastify';
import { isEqual } from 'lodash';
import { TEXTS } from '@/configs/texts';
import { MESSAGES } from '@/configs/messages';

export const validateSchema = yup.object().shape({
    receiptNumber: yup.string().max(50, TEXTS.VALIDATION.MAX_50).required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.RECEIPT_NUMBER.toLowerCase()}`),
    receiptDate: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.RECEIPT_DATE.toLowerCase()}`),
    companyName: yup.string().max(255, TEXTS.VALIDATION.MAX_255),
    departmentName: yup.string().max(255, TEXTS.VALIDATION.MAX_255),
    warehouseId: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.WAREHOUSE.toLowerCase()}`),
    delivererName: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.DELIVERER.toLowerCase()}`),
    receiverId: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.RECEIVER.toLowerCase()}`),
    creatorId: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.CREATOR.toLowerCase()}`),
    warehouseKeeperId: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.KEEPER.toLowerCase()}`),
    chiefAccountantId: yup.string().required(`${TEXTS.VALIDATION.REQUIRED} ${TEXTS.LABELS.ACCOUNTANT.toLowerCase()}`),
    referenceType: yup.string().max(255, TEXTS.VALIDATION.MAX_255),
    referenceNumber: yup.string().max(255, TEXTS.VALIDATION.MAX_255),
    referenceDate: yup.string().nullable(),
    referenceIssuer: yup.string().max(255, TEXTS.VALIDATION.MAX_255),
    items: yup.array().of(
        yup.object().shape({
            productName: yup.string().required(TEXTS.VALIDATION.PRODUCT_NAME_REQ),
            quantityDocument: yup.number().typeError(TEXTS.VALIDATION.NUMBER_ERROR).min(0, TEXTS.VALIDATION.MIN_0).required(TEXTS.VALIDATION.REQUIRED),
            quantityActual: yup.number().typeError(TEXTS.VALIDATION.NUMBER_ERROR).min(0, TEXTS.VALIDATION.MIN_0).required(TEXTS.VALIDATION.REQUIRED),
            unitPrice: yup.number().typeError(TEXTS.VALIDATION.NUMBER_ERROR).min(0, TEXTS.VALIDATION.MIN_0).required(TEXTS.VALIDATION.REQUIRED),
        })
    ).min(1, TEXTS.VALIDATION.MIN_1_ITEM),
});

interface StockInFormProps {
    initialData?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}

const StockInForm: React.FC<StockInFormProps> = observer(({ initialData, onSave, onCancel }) => {
    const { employeeStore, warehouseStore, stockInStore } = rootStore;

    useEffect(() => {
        employeeStore.fetchEmployees();
        warehouseStore.fetchWarehouses();
    }, [employeeStore, warehouseStore]);

    const getEmployeeOptions = (positionId?: number) => {
        const list = positionId 
            ? employeeStore.employees.filter(emp => emp.position === positionId)
            : employeeStore.employees;
            
        return list.map(emp => ({
            value: emp.id,
            label: `${emp.fullName} (${emp.employeeCode})`
        }));
    };

    const warehouseOptions = warehouseStore.warehouses.map(w => ({
        value: w.id,
        label: `${w.name} (${w.warehouseCode})`
    }));

    const accountantOptions = useMemo(() => getEmployeeOptions(POSITIONS.ACCOUNTANT), [employeeStore.employees]);
    const keeperOptions = useMemo(() => getEmployeeOptions(POSITIONS.WAREHOUSE_KEEPER), [employeeStore.employees]);
    const allInternalOptions = useMemo(() => getEmployeeOptions(), [employeeStore.employees]);

    const sanitizeData = (values: any) => stockInStore.sanitizeData(values);

    const defaultValues = useMemo(() => {
        const base = initialData || {
            receiptNumber: `PNK-`,
            receiptDate: new Date().toISOString().split('T')[0],
            companyName: '',
            departmentName: '',
            warehouseId: '',
            warehouseLocation: '',
            delivererName: '',
            receiverId: '',
            creatorId: '',
            debtAccount: '',
            creditAccount: '',
            warehouseKeeperId: '',
            chiefAccountantId: '',
            note: '',
            referenceType: '',
            referenceNumber: '',
            referenceDate: null,
            referenceIssuer: '',
            items: [{ productName: '', productCode: '', unit: '', quantityDocument: 0, quantityActual: 0, unitPrice: 0 }],
            totalAmount: 0,
        };

        let location = base.warehouseLocation || '';
        if (base.warehouseId && warehouseStore.warehouses.length > 0) {
            const warehouse = warehouseStore.warehouses.find(w => w.id === base.warehouseId);
            if (warehouse) {
                location = warehouse.location || '';
            }
        }

        if (initialData) {
            if (initialData.receiptDate) {
                base.receiptDate = initialData.receiptDate.split('T')[0];
            }
            if (initialData.referenceDate) {
                base.referenceDate = initialData.referenceDate.split('T')[0];
            }
        }

        return { ...base, warehouseLocation: location };
    }, [initialData, warehouseStore.warehouses]);

    return (
        <Formik
            initialValues={defaultValues}
            validationSchema={validateSchema}
            enableReinitialize={true}
            onSubmit={(values) => {
                const submitData = sanitizeData(values);

                if (initialData) {
                    const originalSanitized = sanitizeData(initialData);
                    if (isEqual(submitData, originalSanitized)) {
                        toast.info(MESSAGES.INFO.NO_CHANGES);
                        onCancel();
                        return;
                    }
                }

                onSave({
                    ...submitData,
                    totalAmountInWords: numberPriceToWordsInVnd(submitData.totalAmount)
                });
            }}
        >
            {({ values, handleSubmit, setFieldValue, errors }) => {
                const currentTotal = values.items.reduce((sum: number, item: any) => sum + (Number(item.quantityActual || 0) * Number(item.unitPrice || 0)), 0);

                return (
                    <Form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[85vh]">
                        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                            {TEXTS.STOCK_IN.FORM_HEADER}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={1}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormField name="receiptNumber" label={`${TEXTS.LABELS.RECEIPT_NUMBER} *`} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormField name="receiptDate" label={`${TEXTS.LABELS.RECEIPT_DATE} *`} type="date" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormField name="companyName" label={TEXTS.LABELS.COMPANY} />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormField name="departmentName" label={TEXTS.LABELS.DEPARTMENT} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormField name="delivererName" label={`${TEXTS.LABELS.DELIVERER} *`} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormSelect name="receiverId" label={`${TEXTS.LABELS.RECEIVER} *`} options={allInternalOptions} />
                            </Grid>

                            {/* Reference Documents Row */}
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="referenceType" label={TEXTS.LABELS.REFERENCE_TYPE} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="referenceNumber" label={TEXTS.LABELS.REFERENCE_NUMBER} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="referenceDate" label={TEXTS.LABELS.REFERENCE_DATE} type="date" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="referenceIssuer" label={TEXTS.LABELS.REFERENCE_ISSUER} />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="debtAccount" label={TEXTS.LABELS.DEBT_ACCOUNT} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="creditAccount" label={TEXTS.LABELS.CREDIT_ACCOUNT} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormSelect 
                                    name="warehouseId" 
                                    label={`${TEXTS.LABELS.WAREHOUSE} *`} 
                                    options={warehouseOptions}
                                    onChange={(value, form) => {
                                        const selectedWarehouse = warehouseStore.warehouses.find(w => w.id === value);
                                        if (selectedWarehouse) {
                                            form.setFieldValue('warehouseLocation', selectedWarehouse.location || '');
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="warehouseLocation" label={TEXTS.LABELS.WAREHOUSE_LOCATION} disable />
                            </Grid>

                            <Grid size={12}>
                                <Paper variant="outlined" sx={{ p: 1, bgcolor: '#fcfcfc', borderStyle: 'dashed' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" color="secondary">
                                            {TEXTS.STOCK_IN.ITEM_LIST_TITLE}
                                        </Typography>
                                        <Button
                                            startIcon={<PlusIcon />}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                const newItems = [...values.items, { productName: '', productCode: '', unit: '', quantityDocument: 0, quantityActual: 0, unitPrice: 0 }];
                                                setFieldValue('items', newItems);
                                            }}
                                            data-testid="add-item-button"
                                        >
                                            {TEXTS.STOCK_IN.ADD_ITEM}
                                        </Button>
                                    </Box>

                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: '#f0f2f5' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.PRODUCT_CODE}</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.PRODUCT_NAME} *</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.UNIT}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.QTY_DOC}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.QTY_ACTUAL}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{TEXTS.LABELS.PRICE}</TableCell>
                                                    <TableCell align="center"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {values.items.map((_item: any, index: number) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell sx={{ py: 1, px: 0.5 }}>
                                                            <FormField name={`items.${index}.productCode`} label="" placeholder="" />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1, px: 0.5 }} width="25%">
                                                            <FormField 
                                                                name={`items.${index}.productName`} 
                                                                label="" 
                                                                placeholder={TEXTS.LABELS.PRODUCT_NAME} 
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1, px: 0.5 }} width="10%">
                                                            <FormField name={`items.${index}.unit`} label="" placeholder="" />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1, px: 0.5 }}>
                                                            <FormNumericField name={`items.${index}.quantityDocument`} label="" />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1, px: 0.5 }}>
                                                            <FormNumericField name={`items.${index}.quantityActual`} label="" />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1, px: 0.5 }}>
                                                            <FormNumericField name={`items.${index}.unitPrice`} label="" />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton 
                                                                size="small"
                                                                color="error" 
                                                                onClick={() => {
                                                                    if (values.items.length > 1) {
                                                                        const newItems = values.items.filter((_: any, i: number) => i !== index);
                                                                        setFieldValue('items', newItems);
                                                                    }
                                                                }}
                                                                data-testid="delete-item-button"
                                                            >
                                                                <TrashIcon fontSize="inherit" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    
                                    {typeof errors.items === 'string' && (
                                        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            {errors.items}
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>

                            {/* THÀNH TIỀN BOX MOVED OUTSIDE PAPER */}
                            <Grid size={12}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    bgcolor: '#1a237e', 
                                    color: 'white', 
                                    p: 2, 
                                    borderRadius: 1,
                                    boxShadow: 2,
                                    mb: 1
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <Typography variant="subtitle1" sx={{ letterSpacing: 1 }}>{TEXTS.STOCK_IN.TOTAL_LABEL}</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(currentTotal)} VNĐ
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', textAlign: 'right' }}>
                                        {TEXTS.STOCK_IN.TOTAL_WORDS} {numberPriceToWordsInVnd(currentTotal)}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormSelect name="creatorId" label={`${TEXTS.LABELS.CREATOR} *`} options={allInternalOptions} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormSelect name="warehouseKeeperId" label={`${TEXTS.LABELS.KEEPER} *`} options={keeperOptions} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormSelect name="chiefAccountantId" label={`${TEXTS.LABELS.ACCOUNTANT} *`} options={accountantOptions} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormField name="note" label={TEXTS.LABELS.NOTE} />
                            </Grid>

                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, pb: 1 }}>
                                <Button onClick={onCancel} variant="text" color="inherit" sx={{ px: 4 }}>{TEXTS.BUTTONS.CANCEL}</Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    size="large" 
                                    sx={{ px: 6, fontWeight: 'bold' }}
                                >
                                    {TEXTS.BUTTONS.SAVE}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
});

export default StockInForm;
