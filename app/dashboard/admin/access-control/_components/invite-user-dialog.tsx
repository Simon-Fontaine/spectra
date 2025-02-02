"use client";

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { inviteUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon, SendIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { handleInviteUser } from "../_lib/actions";

export function InviteUserDialog() {
  const toastRef = useRef<string | number | undefined>(undefined);

  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      expiresAt: undefined,
    },
  });

  const { execute: executeInviteUser, isPending: isInviteUserPending } =
    useAction(handleInviteUser, {
      onExecute: () => {
        toastRef.current = toast.loading("Sending an invitation...");
      },
      onSuccess: ({ data }) => {
        toast.success(data?.message, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        form.reset();
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

  const onSubmit = async (values: z.infer<typeof inviteUserSchema>) => {
    executeInviteUser(values);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="size-4" aria-hidden="true" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Fill out the fields below to send an invitation. When you're ready,
            click Invite to proceed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="text-right">Email Address</FormLabel>
                    <div className="col-span-4">
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="Enter a valid email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="text-right">
                      Invitation Expiration
                    </FormLabel>
                    <div className="col-span-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>
                                  Select an expiration date (optional)
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <LoadingButton
                  className="w-full"
                  pending={isInviteUserPending}
                  pendingText="Sending an invitation..."
                >
                  <SendIcon />
                  Send Invitation
                </LoadingButton>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
