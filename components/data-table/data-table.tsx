"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  TableState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import { DownloadIcon } from "lucide-react";
import LoadingButton from "../loading-button";
import { exportTableToCSV } from "@/lib/export-csv";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableFilterField } from "@/types/data-table";
import { getCommonPinningStyles } from "@/lib/utils/table";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterFields?: DataTableFilterField<TData>[];
  initialState?: Partial<TableState>;
  filename?: string;
  excludeColumns?: (keyof TData | "select" | "actions")[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterFields,
  initialState,
  filename = "table",
  excludeColumns = ["select", "actions"],
  children,
}: DataTableProps<TData, TValue> & { children?: React.ReactNode }) {
  const [rowSelection, setRowSelection] = React.useState(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );

  const [progress, setProgress] = React.useState(0);
  const [isExporting, setIsExporting] = React.useState(false);

  async function handleExport(table: TableType<TData>) {
    const rowsCount = table.getRowModel().rows.length;

    setIsExporting(true);
    setProgress(0);

    try {
      await exportTableToCSV(table, {
        filename,
        excludeColumns,
        onlySelected: false,
        chunkSize: rowsCount / 100,
        onProgress: (ratio) => {
          setProgress(Math.floor(ratio * 100));
        },
      });

      toast.success(`${rowsCount} row(s) exported successfully.`);
    } catch (err) {
      console.error("Export CSV Error:", err);
      toast.error("Failed to export users.");
    } finally {
      setIsExporting(false);
    }
  }

  const table = useReactTable({
    data,
    columns,
    initialState,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="grid w-full space-y-2.5 overflow-auto">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <div className="flex items-center gap-2">
          {children}
          <LoadingButton
            variant="outline"
            size="sm"
            type="button"
            pendingText="Exporting"
            pending={isExporting}
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExport(table)}
            className="hidden sm:flex"
          >
            <DownloadIcon className="size-4" aria-hidden="true" />
            Export
          </LoadingButton>
        </div>
      </DataTableToolbar>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
      {isExporting && <Progress value={progress} />}
    </div>
  );
}
