"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Profile } from "@/utils/profile";
import { User } from "@supabase/supabase-js";
import { NotificationAlert, Message } from "@/components/form-message";
import { PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AvatarInput from "@/components/avatar-input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import PasswordInput from "./password-input";
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
} from "./ui/alert-dialog";
import { Icons } from "./icons";
import { ComponentProps, useState } from "react";
import { SubmitButton } from "./hook-form-submit-button";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ProfileSettingsProps {
  profile: Profile;
  user: User;
  message: Message;
}

const usernameSchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-z0-9_]{1,48}$/,
      "Username must be lowercase and contain only letters, numbers, and underscores"
    ),
});

const displayNameSchema = z.object({
  display_name: z
    .string()
    .regex(
      /^[a-zA-Z0-9_ ]{0,32}$/,
      "Display name must contain only letters, numbers, underscores, and spaces"
    ),
});

const emailSchema = z.object({
  email: z
    .string()
    .email("Email must be a valid email address (e.g. username@owspectra.com)"),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  pending?: boolean;
};

function ActionButton({
  children,
  onClick = () => {},
  pending = false,
  pendingText = "Submitting...",
  variant = "destructive",
}: Props) {
  return (
    <Button size="sm" onClick={onClick} disabled={pending} variant={variant}>
      {pending ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingText : children}
    </Button>
  );
}

function handleErrorToast(toast: any, error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "An unknown error occurred. Please try again later.";

  toast({
    variant: "destructive",
    title: "Error!",
    description: message,
  });
}

export default function ProfileSettingsPage({
  profile,
  user,
  message,
}: ProfileSettingsProps) {
  const supabase = createClient();

  const { toast } = useToast();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

  const usernameForm = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: profile.username,
    },
  });

  const displayNameForm = useForm<z.infer<typeof displayNameSchema>>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      display_name: profile.display_name ?? "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function handleAvatarUpload(url: string) {
    try {
      setUploading(true);

      const { error } = await supabase
        .from("profile")
        .update({ avatar_url: url })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      profile.avatar_url = url;

      toast({
        title: "Success!",
        description: "Avatar updated successfully.",
      });
    } catch (error) {
      handleErrorToast(toast, error);
    } finally {
      setUploading(false);
    }
  }

  async function handleUsernameSubmit(data: z.infer<typeof usernameSchema>) {
    const username = data.username;

    if (username === profile.username) {
      return;
    }

    const { data: existingUser, error: checkError } = await supabase
      .from("profile")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return usernameForm.setError("username", {
        message: "Username is already taken",
      });
    }

    const { error } = await supabase
      .from("profile")
      .update({ username })
      .eq("id", profile.id);

    if (error) {
      handleErrorToast(toast, error);
      return;
    }

    profile.username = username;
    toast({
      title: "Success!",
      description: "Username updated successfully.",
    });
  }

  async function handleDisplayNameSubmit(
    data: z.infer<typeof displayNameSchema>
  ) {
    const display_name = data.display_name;

    if (display_name === profile.display_name) {
      return;
    }

    const { error } = await supabase
      .from("profile")
      .update({ display_name })
      .eq("id", profile.id);

    if (error) {
      handleErrorToast(toast, error);
      return;
    }

    profile.display_name = display_name;
    toast({
      title: "Success!",
      description: "Display name updated successfully.",
    });
  }

  async function handleEmailSubmit(data: z.infer<typeof emailSchema>) {
    const email = data.email;

    if (email === user.email) {
      return;
    }

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      handleErrorToast(toast, error);
      return;
    }

    user.email = email;
    toast({
      title: "Success!",
      description: "A verification email has been sent to your new email.",
    });
  }

  async function handlePasswordSubmit(data: z.infer<typeof passwordSchema>) {
    const password = data.password;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      handleErrorToast(toast, error);
      return;
    }

    toast({
      title: "Success!",
      description: "Password updated successfully.",
    });
  }

  async function handleDeleteAccountSubmit() {
    try {
      setAccountDeleteLoading(true);

      const response = await fetch("/api/delete-account", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast({
        title: "Success!",
        description: "Account deleted successfully.",
      });

      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      handleErrorToast(toast, error);
    } finally {
      setAccountDeleteLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      {/* Page Title */}
      <PageHeaderHeading>Account Settings</PageHeaderHeading>
      <NotificationAlert message={message} />

      {/* Avatar Section */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Avatar</h2>
            <div>
              <p className="text-sm text-muted-foreground">
                This is your avatar.
              </p>
              <p className="text-sm text-muted-foreground">
                Click on the avatar to upload a new one.
              </p>
            </div>
          </div>
          <div className="pl-4">
            <AvatarInput
              uid={profile.id}
              url={profile.avatar_url}
              username={profile.username}
              uploading={uploading}
              setUploading={setUploading}
              onUpload={(url) => {
                handleAvatarUpload(url);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t py-3 text-sm text-muted-foreground h-12">
          <p>An avatar is optional but strongly recommended.</p>
        </CardFooter>
      </Card>

      {/* Display Name Section */}
      <Card className="bg-muted/50">
        <Form {...displayNameForm}>
          <form
            onSubmit={displayNameForm.handleSubmit(handleDisplayNameSubmit)}
          >
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={displayNameForm.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Display Name
                    </FormLabel>
                    <FormDescription>
                      Enter your full name or display name.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="md:max-w-sm"
                        placeholder={profile.display_name ?? profile.username}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use 32 characters maximum.
              </p>
              <SubmitButton
                size="sm"
                pendingText="Saving..."
                disabled={
                  profile.display_name ===
                  displayNameForm.getValues().display_name
                }
              >
                Save
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Username Section */}
      <Card className="bg-muted/50">
        <Form {...usernameForm}>
          <form onSubmit={usernameForm.handleSubmit(handleUsernameSubmit)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={usernameForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Username
                    </FormLabel>
                    <FormDescription>
                      This is your URL namespace within the app.
                    </FormDescription>
                    <FormControl>
                      <div className="inline-flex w-full md:max-w-sm">
                        <div className="bg-muted text-muted-foreground border border-muted rounded-l-md flex items-center px-3">
                          <span className="text-sm font-medium">
                            {siteConfig.url.replace(/https?:\/\//g, "")}
                            /players/
                          </span>
                        </div>
                        <Input
                          className="rounded-none rounded-r-md"
                          placeholder={profile.username}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use 48 characters maximum.
              </p>
              <SubmitButton
                size="sm"
                pendingText="Saving..."
                disabled={
                  profile.username === usernameForm.getValues().username
                }
              >
                Save
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Email Section */}
      <Card className="bg-muted/50">
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Email
                    </FormLabel>
                    <FormDescription>
                      Your email address is used for login and notifications.
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
            <CardFooter className="flex justify-between border-t py-3 h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Please use a valid email address.
              </p>
              <SubmitButton
                size="sm"
                pendingText="Saving..."
                disabled={user.email === emailForm.getValues().email}
              >
                Save
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Password Section */}
      <Card className="bg-muted/50">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <CardContent className="p-6 flex flex-col gap-2">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl font-semibold">
                      Password
                    </FormLabel>
                    <FormDescription>Enter your new password.</FormDescription>
                    <FormControl>
                      <PasswordInput
                        className="md:max-w-sm"
                        required={false}
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Confirm Password</FormLabel>
                    <FormDescription className="sr-only">
                      Confirm your new password.
                    </FormDescription>
                    <FormControl>
                      <PasswordInput
                        className="md:max-w-sm"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t py-3 h-12">
              <p className="text-sm text-muted-foreground pr-4">
                Choose a strong, unique password to protect your account.
              </p>
              <SubmitButton size="sm" pendingText="Saving...">
                Save
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Delete Account Section */}
      <Card className="bg-muted/50 border border-destructive">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-destructive">
              Delete Account
            </h2>
            <p className="text-sm">
              Permanently remove your account and all its contents. This action
              is irreversible.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-destructive bg-destructive/10 py-3 h-12">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ActionButton
                pending={accountDeleteLoading}
                pendingText="Deleting Account..."
                variant="destructive"
              >
                Delete Account
              </ActionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <ActionButton
                    pending={accountDeleteLoading}
                    onClick={handleDeleteAccountSubmit}
                    pendingText="Deleting Account..."
                    variant="destructive"
                  >
                    Delete Account
                  </ActionButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
