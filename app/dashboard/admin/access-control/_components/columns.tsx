"use client";

import { formatDate } from "@/lib/utils";
// import { UserRowActions } from "./row-actions";
import { Invitation } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFilterField } from "@/types/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { InvitationRowActions } from "./row-actions";

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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
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
