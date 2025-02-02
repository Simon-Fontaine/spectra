"use client";

import { DataTable } from "@/components/data-table/data-table";
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import {
  getDisplayNameSchema,
  getEmailSchema,
  getUsernameSchema,
} from "@/lib/zod";
import type { UserWithSessions } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { handleDeleteUser } from "../../_lib/actions";
import {
  handleUserEmailUpdate,
  handleUserNameUpdate,
  handleUserUsernameUpdate,
} from "../_lib/actions";
import { columns, filterFields } from "./columns";

const updateDisplayNameSchema = z.object({
  displayName: getDisplayNameSchema(),
});

const updateUsernameSchema = z.object({
  username: getUsernameSchema(),
});

const updateEmailSchema = z.object({
  email: getEmailSchema(),
});

export function UserEditForms({ user }: { user: UserWithSessions }) {
  const toastRef = useRef<string | number | undefined>(undefined);

  /* ------------------------
   * Display Name Section
   * ------------------------*/
  const updateNameForm = useForm<z.infer<typeof updateDisplayNameSchema>>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: {
      displayName: user.displayName || undefined,
    },
  });

  const { execute: executeUpdateName, isPending: isUpdateNamePending } =
    useAction(handleUserNameUpdate, {
      onExecute: () => {
        toastRef.current = toast.loading("Updating user name...");
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

  const onUpdateName = async (
    values: z.infer<typeof updateDisplayNameSchema>,
  ) => {
    executeUpdateName({
      userId: user.id,
      displayName: values.displayName,
    });
  };

  /* ------------------------
   * Username Section
   * ------------------------*/
  const updateUsernameForm = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: user.username,
    },
  });

  const { execute: executeUpdateUsername, isPending: isUpdateUsernamePending } =
    useAction(handleUserUsernameUpdate, {
      onExecute: () => {
        toastRef.current = toast.loading("Updating user username...");
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

  const onUpdateUsername = async (
    values: z.infer<typeof updateUsernameSchema>,
  ) => {
    executeUpdateUsername({
      userId: user.id,
      username: values.username,
    });
  };

  /* ------------------------
   * Email Section
   * ------------------------*/
  const updateEmailForm = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const { execute: executeUpdateEmail, isPending: isUpdateEmailPending } =
    useAction(handleUserEmailUpdate, {
      onExecute: () => {
        toastRef.current = toast.loading("Updating user email...");
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

  const onUpdateEmail = async (values: z.infer<typeof updateEmailSchema>) => {
    executeUpdateEmail({
      userId: user.id,
      email: values.email,
    });
  };

  /* ------------------------
   * Delete Account Section
   * ------------------------*/
  const { execute: executeDeleteAccount, isPending: isDeleteAccountPending } =
    useAction(handleDeleteUser, {
      onExecute: () => {
        toastRef.current = toast.loading("Deleting user account...");
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
    <>
      {/* Display Name Section */}
      <Card className="bg-muted/50">
        <Form {...updateNameForm}>
          <form onSubmit={updateNameForm.handleSubmit(onUpdateName)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={updateNameForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Display Name
                    </FormLabel>
                    <FormDescription>
                      Enter their full name or display name.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="md:max-w-sm"
                        placeholder={user.displayName || user.username}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 min-h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use 48 characters maximum.
              </p>
              <LoadingButton
                size="sm"
                pendingText="Saving..."
                pending={isUpdateNamePending}
                disabled={
                  user.displayName === updateNameForm.getValues().displayName
                }
              >
                Save
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Username Section */}
      <Card className="bg-muted/50">
        <Form {...updateUsernameForm}>
          <form onSubmit={updateUsernameForm.handleSubmit(onUpdateUsername)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={updateUsernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Username
                    </FormLabel>
                    <FormDescription>
                      This is their URL namespace within the app.
                    </FormDescription>
                    <FormControl>
                      <div className="inline-flex w-full md:max-w-sm">
                        <div className="bg-muted text-muted-foreground border border-muted rounded-l-md flex items-center px-3">
                          <span className="text-sm font-medium">
                            {APP_CONFIG_PUBLIC.APP_URL.replace(
                              /https?:\/\//g,
                              "",
                            )}
                            /players/
                          </span>
                        </div>
                        <Input
                          className="rounded-none rounded-r-md"
                          placeholder={user.username}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 min-h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use 48 characters maximum.
              </p>
              <LoadingButton
                size="sm"
                pendingText="Saving..."
                pending={isUpdateUsernamePending}
                disabled={
                  user.username === updateUsernameForm.getValues().username
                }
              >
                Save
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Email Section */}
      <Card className="bg-muted/50">
        <Form {...updateEmailForm}>
          <form onSubmit={updateEmailForm.handleSubmit(onUpdateEmail)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={updateEmailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Email
                    </FormLabel>
                    <FormDescription>
                      Their email address is used for login and notifications.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="md:max-w-sm"
                        placeholder={user.email}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 min-h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use a valid email address.
              </p>
              <LoadingButton
                size="sm"
                pendingText="Saving..."
                pending={isUpdateEmailPending}
                disabled={user.email === updateEmailForm.getValues().email}
              >
                Save
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Sessions Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage their active sessions and sign out from other devices.
          </p>
          <DataTable
            data={user.sessions}
            columns={columns}
            filterFields={filterFields}
            initialState={{
              columnPinning: { right: ["actions"] },
              sorting: [{ id: "createdAt", desc: true }],
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="bg-muted/50 border border-destructive">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-destructive">
              Delete Account
            </h2>
            <p className="text-sm">
              Permanently remove their account and all its contents. This action
              is irreversible.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-destructive bg-destructive/10 py-3 min-h-12">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <LoadingButton
                size="sm"
                type="button"
                variant="destructive"
                pendingText="Deleting Account..."
                pending={isDeleteAccountPending}
              >
                Delete Account
              </LoadingButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  their account and remove all related data from our servers.
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
                    pending={isDeleteAccountPending}
                    onClick={() => {
                      executeDeleteAccount({
                        userId: user.id,
                      });
                    }}
                  >
                    Continue
                  </LoadingButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  );
}
