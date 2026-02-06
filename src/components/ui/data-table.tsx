"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    Row,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
    pageCount?: number
    pagination?: {
        pageIndex: number
        pageSize: number
    }
    onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
    renderMobileCard?: (row: Row<TData>) => React.ReactNode
    columnVisibility?: any
    onColumnVisibilityChange?: (updater: any) => void
    sorting?: any
    onSortingChange?: (updater: any) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    pageCount,
    pagination,
    onPaginationChange,
    renderMobileCard,
    columnVisibility = {},
    onColumnVisibilityChange,
    sorting,
    onSortingChange,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pageCount,
        manualSorting: true,
        state: {
            pagination,
            columnVisibility,
            sorting,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function' && pagination) {
                onPaginationChange?.(updater(pagination))
            }
        },
        onColumnVisibilityChange: onColumnVisibilityChange,
        onSortingChange: onSortingChange,
    })

    return (
        <div className="space-y-4">
            <div className="hidden md:block rounded-md border min-w-0 w-full overflow-hidden">
                <Table className="min-w-max">
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={isLoading ? "opacity-50 transition-opacity" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            <span>Memuat...</span>
                                        </div>
                                    ) : (
                                        "Tidak ada hasil."
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <div key={row.id} className={isLoading ? "opacity-50 transition-opacity" : ""}>
                            {renderMobileCard ? renderMobileCard(row) : (
                                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 space-y-2 overflow-hidden">
                                    {row.getVisibleCells().map((cell) => {
                                        const header = cell.column.columnDef.header;
                                        const headerText = typeof header === 'string' ? header : cell.column.id;

                                        // Skip actions column in default card view
                                        if (cell.column.id === 'actions') {
                                            return (
                                                <div key={cell.id} className="pt-2 border-t">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={cell.id} className="flex justify-between items-start gap-2">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
                                                    {headerText}:
                                                </span>
                                                <span className="text-sm text-gray-900 dark:text-gray-100 text-right break-words overflow-hidden">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span>Memuat...</span>
                            </div>
                        ) : (
                            "Tidak ada hasil."
                        )}
                    </div>
                )}
            </div>

            {pagination && pageCount !== undefined && pageCount > 0 && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Halaman {pagination.pageIndex + 1} dari {pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
