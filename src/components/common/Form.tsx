import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { 
    TextField, 
    FormControl, 
    FormHelperText, 
    InputLabel, 
    Select, 
    MenuItem 
} from '@mui/material';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

interface FormFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    disable?: boolean;
    multiline?: boolean;
    rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder = '', 
    className = '', 
    disable = false, 
    multiline = false, 
    rows = 1 
}) => {
    return (
        <Field name={name}>
            {({ field, meta }: FieldProps) => (
                <FormControl 
                    fullWidth 
                    error={!!meta.touched && !!meta.error} 
                    className={cn(className)}
                    sx={{ mb: 1 }}
                >
                    <TextField
                        {...field}
                        disabled={disable}
                        label={label}
                        type={type}
                        multiline={multiline}
                        rows={multiline ? rows : 1}
                        placeholder={placeholder}
                        variant="outlined"
                        fullWidth
                        error={!!meta.touched && !!meta.error}
                        InputLabelProps={{
                            shrink: type === 'date' || (field.value !== undefined && field.value !== '' && field.value !== null)
                        }}
                        size="small"
                        sx={{
                            '& .MuiInputBase-root': {
                                height: multiline ? 'auto' : 40,
                                fontSize: '0.875rem'
                            },
                            '& .MuiInputLabel-root': {
                                transform: 'translate(14px, 10px) scale(1)',
                                '&.MuiInputLabel-shrink': {
                                    transform: 'translate(14px, -9px) scale(0.75)',
                                }
                            }
                        }}
                    />
                    {meta.touched && meta.error && (
                        <FormHelperText sx={{ m: 0, fontSize: '0.7rem' }}>
                            {meta.error}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        </Field>
    );
};

export const FormNumericField: React.FC<FormFieldProps> = ({
    name,
    label,
    placeholder = '',
    className = '',
    disable = false,
}) => {
    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps) => {
                const displayValue = formatCurrency(field.value);
                
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    const numericValue = parseInt(rawValue, 10);
                    form.setFieldValue(name, isNaN(numericValue) ? 0 : numericValue);
                };

                return (
                    <FormControl 
                        fullWidth 
                        error={!!meta.touched && !!meta.error} 
                        className={cn(className)}
                        sx={{ mb: 1 }}
                    >
                        <TextField
                            value={displayValue === '0' && !field.value ? '' : displayValue}
                            onChange={handleChange}
                            disabled={disable}
                            label={label}
                            placeholder={placeholder}
                            variant="outlined"
                            fullWidth
                            error={!!meta.touched && !!meta.error}
                            InputLabelProps={{
                                shrink: field.value !== undefined && field.value !== '' && field.value !== null && field.value !== 0
                            }}
                            size="small"
                            sx={{
                                '& .MuiInputBase-root': { height: 40, fontSize: '0.875rem' },
                                '& .MuiInputLabel-root': {
                                    transform: 'translate(14px, 10px) scale(1)',
                                    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' }
                                }
                            }}
                        />
                        {meta.touched && meta.error && (
                            <FormHelperText sx={{ m: 0, fontSize: '0.7rem' }}>
                                {meta.error}
                            </FormHelperText>
                        )}
                    </FormControl>
                );
            }}
        </Field>
    );
};

interface FormSelectProps extends FormFieldProps {
    options: { value: any; label: string }[];
    onChange?: (value: any, form: any) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    name,
    label,
    options,
    className = '',
    disable = false,
    onChange
}) => {
    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps) => (
                <FormControl 
                    fullWidth 
                    error={!!meta.touched && !!meta.error} 
                    className={cn(className)}
                    sx={{ mb: 1 }}
                    size="small"
                >
                    <InputLabel 
                        id={`${name}-label`} 
                        shrink={field.value !== undefined && field.value !== '' && field.value !== null}
                        sx={{ 
                            transform: 'translate(14px, 10px) scale(1)',
                            '&.MuiInputLabel-shrink': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            }
                        }}
                    >
                        {label}
                    </InputLabel>
                    <Select
                        {...field}
                        labelId={`${name}-label`}
                        label={label}
                        disabled={disable}
                        onChange={(event) => {
                            const value = event.target.value;
                            form.setFieldValue(name, value);
                            if (onChange) {
                                onChange(value, form);
                            }
                        }}
                        sx={{
                            height: 40,
                            fontSize: '0.875rem'
                        }}
                    >
                        <MenuItem value=""><em>-- Chọn {label} --</em></MenuItem>
                        {options.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                    {meta.touched && meta.error && (
                        <FormHelperText sx={{ m: 0, fontSize: '0.7rem' }}>
                            {meta.error}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        </Field>
    );
};

export const Form: React.FC<{ children: React.ReactNode; onSubmit: any; className?: string }> = ({ 
    children, 
    onSubmit, 
    className 
}) => {
    return <form className={cn(className)} onSubmit={onSubmit}>{children}</form>;
};
