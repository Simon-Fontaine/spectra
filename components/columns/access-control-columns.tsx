"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import type { DataTableFilterField } from "@/types/data-table";
import type { Invitation } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { InvitationRowActions } from "./access-control-row-actions";

export const filterFields: DataTableFilterField<Invitation>[] = [
  {
    id: "email",
    label: "Email",
    placeholder: "Filter emails...",
  },
];

export const columns: ColumnDef<Invitation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate font-medium">
          {row.getValue("email")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "inviterId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inviter ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate font-medium">
          {row.getValue("inviterId")}
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ cell }) =>
      formatDate(cell.getValue() as Date, {
        hour: "numeric",
        minute: "numeric",
      }),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) =>
      formatDate(cell.getValue() as Date, {
        hour: "numeric",
        minute: "numeric",
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => <InvitationRowActions email={row.original.email} />,
    size: 40,
  },
];
