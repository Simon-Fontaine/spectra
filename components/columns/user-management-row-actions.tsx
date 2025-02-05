"use client";

import { handleUpdateUserRole } from "@/actions/admin-management";
import { handleDeleteUser } from "@/actions/user-management";
import LoadingButton from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRoleIcon, sanitizeString } from "@/lib/utils/table";
import type { CleanUser } from "@/types/models";
import { Role } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { EllipsisIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";

export function UserRowActions({ row }: { row: Row<CleanUser> }) {
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute: executeUpdateRole, isPending: isUpdateRolePending } =
    useAction(handleUpdateUserRole, {
      onExecute: () => {
        toastRef.current = toast.loading("Updating user role...");
      },
      onSuccess: ({ data }) => {
        toast.success(data?.message, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
      onError: ({ error }) => {
        const { serverError, validationErrors } = error;

        let errorMessage =
          serverError || "Something went wrong. Please try again later.";

        if (validationErrors?.formErrors) {
          errorMessage = Object.values(validationErrors.formErrors).join(", ");
        }

        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    });

  const { execute: executeDeleteUser, isPending: isDeleteUserPending } =
    useAction(handleDeleteUser, {
      onExecute: () => {
        toastRef.current = toast.loading("Deleting account...");
      },
      onSuccess: ({ data }) => {
        toast.success(data?.message, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
      onError: ({ error }) => {
        const { serverError, validationErrors } = error;

        let errorMessage =
          serverError || "Something went wrong. Please try again later.";

        if (validationErrors?.formErrors) {
          errorMessage = Object.values(validationErrors.formErrors).join(", ");
        }

        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    });

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <EllipsisIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <Link
              className="cursor-pointer"
              href={`/dashboard/admin/user-management/${row.original.id}`}
            >
              <PencilIcon /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <UserIcon /> Roles
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {Object.values(Role).map((label) => {
                const Icon = getRoleIcon(label);

                return (
                  <DropdownMenuCheckboxItem
                    key={label}
                    checked={row.original.roles.includes(label)}
                    disabled={isUpdateRolePending}
                    onCheckedChange={() => {
                      executeUpdateRole({
                        userId: row.original.id,
                        role: label,
                      });
                    }}
                  >
                    <Icon
                      className="mr-2 size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {sanitizeString(label)}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={isDeleteUserPending}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete their
            account and remove all related data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              size="sm"
              type="button"
              variant="destructive"
              pendingText="Deleting Account..."
              pending={isDeleteUserPending}
              onClick={() => {
                executeDeleteUser({ userId: row.original.id });
              }}
            >
              Continue
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
