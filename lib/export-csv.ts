import type { Table } from "@tanstack/react-table";

export interface ExportTableToCSVOptions<TData> {
  filename?: string;
  excludeColumns?: (keyof TData | "select" | "actions")[];
  onlySelected?: boolean;
  chunkSize?: number;
  onProgress?: (progress: number) => void;
}

export async function exportTableToCSV<TData>(
  table: Table<TData>,
  options: ExportTableToCSVOptions<TData> = {},
): Promise<void> {
  const {
    filename = "table",
    excludeColumns = [],
    onlySelected = false,
    chunkSize = 200,
    onProgress,
  } = options;

  const headers = table
    .getAllLeafColumns()
    .map((col) => col.id)
    .filter(
      (id) =>
        !excludeColumns.includes(id as keyof TData | "select" | "actions"),
    );

  if (headers.length === 0) {
    onProgress?.(1);
    return;
  }

  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows;

  if (rows.length === 0) {
    onProgress?.(1);
    return;
  }

  const total = rows.length;
  const headerLine = headers.join(",");
  const bodyLines: string[] = [];

  function escapeForCsv(value: unknown): string {
    if (value == null) return "";
    const strValue = typeof value === "string" ? value : String(value);
    return `"${strValue.replace(/"/g, '""')}"`;
  }

  for (let start = 0; start < total; start += chunkSize) {
    const end = Math.min(start + chunkSize, total);
    const slice = rows.slice(start, end);

    for (const row of slice) {
      const line = headers
        .map((header) => {
          const cellValue = row.getValue(header);
          return escapeForCsv(cellValue);
        })
        .join(",");
      bodyLines.push(line);
    }

    onProgress?.(end / total);

    await new Promise((r) => setTimeout(r, 0));
  }

  const csv = [headerLine, ...bodyLines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  onProgress?.(1);
}
