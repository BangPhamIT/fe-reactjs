import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';

interface TableProps {
    data: any[];
    columns: MRT_ColumnDef<any>[];
    enablePagination?: boolean;
    initialState?: any;
    onPaginationChange?: (updater: any) => void;
    pagination?: any;
    height?: string;
    rowCount?: number;
    isLoading?: boolean;
}

export default function Table({
    data = [],
    columns = [],
    enablePagination = false,
    initialState = {},
    onPaginationChange,
    pagination,
    height = '65vh',
    rowCount,
    isLoading
}: TableProps) {
    const columnsDef = useMemo(() => columns, [columns]);

    const table = useMaterialReactTable({
        columns: columnsDef,
        data,
        initialState,
        enablePagination,
        onPaginationChange,
        manualPagination: true,
        rowCount,
        state: {
            pagination,
            isLoading
        },
        muiTableContainerProps: { sx: { height } },
        enableColumnActions: false,
        enableSorting: false,
        enableTopToolbar: false,
        localization: {
            noRecordsToDisplay: 'Không có dữ liệu để hiển thị',
            rowsPerPage: 'Số dòng mỗi trang',
            of: 'của',
            results: 'kết quả',
            showHideColumns: 'Hiện/Ẩn cột',
            actions: 'Thao tác',
        } as any,
    });

    return <MaterialReactTable table={table} />;
}
