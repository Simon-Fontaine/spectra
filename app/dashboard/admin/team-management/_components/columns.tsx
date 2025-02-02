"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getSpecialtyIcon, sanitizeString } from "@/lib/utils/table";
import type { DataTableFilterField } from "@/types/data-table";
import type { CleanUser } from "@/types/models";
import { Specialty } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { TeamMemberRowActions } from "./row-actions";

export const filterFields: DataTableFilterField<CleanUser>[] = [
  {
    id: "username",
    label: "Username",
    placeholder: "Filter usernames...",
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate font-medium">
          {row.getValue("username")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "battletag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Battle Tag" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate">
          {row.getValue("battletag") || "-"}
        </div>
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
        (role) => role === row.original.specialty,
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
    accessorKey: "isSubstitute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Substitute" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.isSubstitute ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <TeamMemberRowActions row={row} />,
    size: 40,
  },
];
