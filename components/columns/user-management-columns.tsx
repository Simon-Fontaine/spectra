"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { getRoleIcon, sanitizeString } from "@/lib/utils/table";
import type { DataTableFilterField } from "@/types/data-table";
import type { CleanUser } from "@/types/models";
import { Role } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { UserRowActions } from "./user-management-row-actions";

export const filterFields: DataTableFilterField<CleanUser>[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "Filter usernames...",
  },
  {
    id: "roles",
    label: "Roles",
    options: Object.values(Role).map((role) => ({
      label: sanitizeString(role),
      value: role,
      icon: getRoleIcon(role),
    })),
  },
];

export const columns: ColumnDef<CleanUser>[] = [
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
      <DataTableColumnHeader className="ml-2" column={column} title="Email" />
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate">
          {row.getValue("username")}
        </div>
      );
    },
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate">
          {row.getValue("displayName") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
    cell: ({ row }) => {
      const roles = row.getValue("roles") as Role[];
      const roleString = roles.map((role) => sanitizeString(role)).join(", ");

      return <div className="flex w-[100px] items-center">{roleString}</div>;
    },
    filterFn: (row, id, value) => {
      return value.some((role: Role) =>
        (row.getValue(id) as Role[]).includes(role),
      );
    },
  },
  {
    accessorKey: "isEmailVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Verified" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.isEmailVerified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => formatDate(cell.getValue() as Date),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions row={row} />,
    size: 40,
  },
];
