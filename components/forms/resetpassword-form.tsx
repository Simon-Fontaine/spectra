"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import LoadingButton from "../loading-button";

export function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    toastIdRef.current = toast.loading("Resetting password...");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("newPassword", values.password);

      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Reset failed.");
      }

      toast.success("Password updated! Redirecting...", {
        id: toastIdRef.current,
      });

      router.push("/sign-in");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message, { id: toastIdRef.current });
    } finally {
      toastIdRef.current = undefined;
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPass ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="At least 8 characters"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass((prev) => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center"
                              aria-label="Toggle password visibility"
                            >
                              {showPass ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel className="sr-only">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPass ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Re-enter your password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPass((prev) => !prev)
                              }
                              className="absolute inset-y-0 right-3 flex items-center"
                              aria-label="Toggle confirm password visibility"
                            >
                              {showConfirmPass ? (
                                <EyeOffIcon className="h-4 w-4" />
                              ) : (
                                <EyeIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <LoadingButton
                  className="w-full"
                  pending={loading}
                  pendingText="Resetting..."
                >
                  Reset Password
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </p>
    </div>
  );
}
