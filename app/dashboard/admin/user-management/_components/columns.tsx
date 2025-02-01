"use client";

import {
  getRoleIcon,
  getSpecialtyIcon,
  sanitizeString,
} from "@/lib/utils/table";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "./row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Role, Specialty } from "@prisma/client";
import { DataTableFilterField } from "@/types/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CleanUser } from "@/types/models";

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
  {
    id: "specialty",
    label: "Specialty",
    options: Object.values(Specialty).map((specialty) => ({
      label: sanitizeString(specialty),
      value: specialty,
      icon: getSpecialtyIcon(specialty),
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
        (row.getValue(id) as Role[]).includes(role)
      );
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty" />
    ),
    cell: ({ row }) => {
      const role = Object.values(Specialty).find(
        (role) => role === row.original.specialty
      );

      if (!role) return null;

      const Icon = getSpecialtyIcon(role);

      return (
        <div className="flex w-[6.25rem] items-center">
          <Icon
            className="mr-2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="capitalize">{sanitizeString(role)}</span>
        </div>
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
