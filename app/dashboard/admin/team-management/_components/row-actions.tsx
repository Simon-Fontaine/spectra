"use client";

import { getSpecialtyIcon, sanitizeString } from "@/lib/utils/table";
import {
  EllipsisIcon,
  ShieldHalfIcon,
  UserCheckIcon,
  UserMinusIcon,
  UserXIcon,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import {
  handleUpdateUserSpecialty,
  handleUpdateUserSubstitute,
} from "../_lib/actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CleanUser } from "@/types/models";
import { Specialty } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import { useAction } from "next-safe-action/hooks";

export function TeamMemberRowActions({ row }: { row: Row<CleanUser> }) {
  const toastRef = useRef<string | number | undefined>(undefined);

  const {
    execute: executeUpdateSubstitute,
    isPending: isUpdateSubstitutePending,
  } = useAction(handleUpdateUserSubstitute, {
    onExecute: () => {
      toastRef.current = toast.loading("Updating user substitute status...");
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

  const {
    execute: executeUpdateSpecialty,
    isPending: isUpdateSpecialtyPending,
  } = useAction(handleUpdateUserSpecialty, {
    onExecute: () => {
      toastRef.current = toast.loading("Updating user specialty...");
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <UserMinusIcon /> Substitute
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={String(row.original.isSubstitute)}
              onValueChange={(value) => {
                const boolValue = value === "true";
                if (boolValue === row.original.isSubstitute) return;

                executeUpdateSubstitute({
                  userId: row.original.id,
                  isSubstitute: boolValue,
                });
              }}
            >
              <DropdownMenuRadioItem
                value="true"
                className="cursor-pointer"
                disabled={isUpdateSubstitutePending}
              >
                <UserCheckIcon
                  className="mr-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                Yes
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="false"
                className="cursor-pointer"
                disabled={isUpdateSubstitutePending}
              >
                <UserXIcon
                  className="mr-2 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                No
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <ShieldHalfIcon /> Specialty
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={row.original.specialty}
              onValueChange={(value) => {
                if (value === row.original.specialty) return;

                executeUpdateSpecialty({
                  userId: row.original.id,
                  specialty: value as Specialty,
                });
              }}
            >
              {Object.values(Specialty).map((label) => {
                const Icon = getSpecialtyIcon(label);

                return (
                  <DropdownMenuRadioItem
                    key={label}
                    value={label}
                    className="cursor-pointer capitalize"
                    disabled={isUpdateSpecialtyPending}
                  >
                    <Icon
                      className="mr-2 size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {sanitizeString(label)}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
