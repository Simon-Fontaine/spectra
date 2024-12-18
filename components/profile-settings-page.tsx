"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeaderHeading } from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { Database } from "@/lib/database.types";
import { createClient } from "@/utils/supabase/client";
import AvatarInput from "./avatar-input";
import { useToast } from "@/hooks/use-toast";
import PasswordInput from "./password-input";
import { FormMessage, Message } from "./form-message";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { Icons } from "./icons";
import { User } from "@supabase/supabase-js";

interface ProfileSettingsProps {
  profile: Database["public"]["Tables"]["profile"]["Row"];
  user: User;
  message: Message;
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

// Reusable button component
function ActionButton({
  loading,
  onClick,
  label,
  loadingLabel,
  variant = "default",
}: {
  loading: boolean;
  onClick: () => void;
  label: string;
  loadingLabel?: string;
  variant?:
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "default"
    | "link";
}) {
  return (
    <Button size="sm" onClick={onClick} disabled={loading} variant={variant}>
      {loading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : null}
      {loading ? (loadingLabel ?? label) : label}
    </Button>
  );
}

export default function ProfileSettingsPage({
  profile,
  user,
  message,
}: ProfileSettingsProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [display_name, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [avatar_url, setAvatarUrl] = useState(profile.avatar_url);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function updateProfile({
    display_name,
    username,
    avatar_url,
  }: {
    display_name: string | null;
    username: string;
    avatar_url: string | null;
  }) {
    setProfileError("");
    try {
      setProfileUpdateLoading(true);

      if (!username || username.trim().length === 0) {
        setProfileError("Username cannot be empty.");
        return;
      }

      if (profile.username !== username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("profile")
          .select("id")
          .eq("username", username)
          .maybeSingle();

        if (checkError) throw checkError;
        if (existingUser) {
          setProfileError("Username is already taken.");
          return;
        }
      }

      const { error } = await supabase
        .from("profile")
        .update({
          display_name: display_name || null,
          username,
          avatar_url,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      handleErrorToast(toast, error);
    } finally {
      setProfileUpdateLoading(false);
    }
  }

  async function updateEmail({ email }: { email: string | undefined }) {
    setEmailError("");
    try {
      setEmailUpdateLoading(true);

      if (!email || !email.includes("@")) {
        setEmailError("Please enter a valid email address.");
        return;
      }

      if (email === user.email) {
        setEmailError("This email is already in use.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ email });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "A verification email has been sent to your new email.",
      });
    } catch (error) {
      console.error("Failed to update email:", error);
      handleErrorToast(toast, error);
    } finally {
      setEmailUpdateLoading(false);
    }
  }

  async function updatePassword({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) {
    setPasswordError("");
    try {
      setPasswordUpdateLoading(true);

      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password,
      });

      if (passwordError) throw passwordError;

      toast({
        title: "Success!",
        description: "Password updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      handleErrorToast(toast, error);
    } finally {
      setPasswordUpdateLoading(false);
    }
  }

  async function handleDeleteAccount() {
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

      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      handleErrorToast(toast, error);
    } finally {
      setAccountDeleteLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      {/* Page Title */}
      <PageHeaderHeading>Account Settings</PageHeaderHeading>
      <FormMessage message={message} />

      {/* Avatar Section */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Avatar</h2>
            <div>
              <p className="text-sm">This is your avatar.</p>
              <p className="text-sm">
                Click on the avatar to upload a new one.
              </p>
            </div>
          </div>
          <div className="pl-4">
            <AvatarInput
              uid={profile.id}
              url={avatar_url}
              username={profile.username}
              size={80}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ display_name, username, avatar_url: url });
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t py-3 text-sm text-muted-foreground">
          <p>An avatar is optional but strongly recommended.</p>
        </CardFooter>
      </Card>

      {/* Display Name Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="display-name" className="text-2xl font-semibold">
              Display Name
            </Label>
            <p className="text-sm">Enter your full name or display name.</p>
          </div>
          <Input
            id="display-name"
            type="text"
            placeholder="Enter your display name"
            value={display_name || ""}
            onChange={(e) => setDisplayName(e.target.value)}
            className="max-w-sm"
          />
          {profileError && (
            <p className="text-sm text-red-600">{profileError}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Please use 32 characters maximum.
          </p>
          <ActionButton
            loading={profileUpdateLoading}
            onClick={() =>
              updateProfile({ display_name, username, avatar_url })
            }
            label="Save"
            loadingLabel="Saving..."
          />
        </CardFooter>
      </Card>

      {/* Username Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="text-2xl font-semibold">
              Username
            </Label>
            <p className="text-sm">
              This is your URL namespace within the app.
            </p>
          </div>
          <div className="inline-flex w-full max-w-sm">
            <div className="bg-muted text-muted-foreground border border-muted rounded-l-md flex items-center px-3">
              <span className="text-sm font-medium">
                {siteConfig.url.replace(/https?:\/\//g, "")}/players/
              </span>
            </div>
            <Input
              id="username"
              type="text"
              placeholder="your-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-none rounded-r-md"
            />
          </div>
          {profileError && (
            <p className="text-sm text-red-600">{profileError}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Please use 48 characters maximum.
          </p>
          <ActionButton
            loading={profileUpdateLoading}
            onClick={() =>
              updateProfile({ display_name, username, avatar_url })
            }
            label="Save"
            loadingLabel="Saving..."
          />
        </CardFooter>
      </Card>

      {/* Email Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-2xl font-semibold">
              Email
            </Label>
            <p className="text-sm">
              Your email address is used for login and notifications.
            </p>
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-sm"
          />
          {emailError && <p className="text-sm text-red-600">{emailError}</p>}
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Please use a valid email address.
          </p>
          <ActionButton
            loading={emailUpdateLoading}
            onClick={() => updateEmail({ email })}
            label="Save"
            loadingLabel="Saving..."
          />
        </CardFooter>
      </Card>

      {/* Password Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Password</h2>
            <p className="text-sm">
              Change your password to keep your account secure.
            </p>
          </div>
          <Label htmlFor="password">New Password</Label>
          <PasswordInput
            name="password"
            className="max-w-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <PasswordInput
            name="confirm-password"
            className="max-w-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Choose a strong, unique password to protect your account.
          </p>
          <ActionButton
            loading={passwordUpdateLoading}
            onClick={() => updatePassword({ password, confirmPassword })}
            label="Save"
            loadingLabel="Saving..."
          />
        </CardFooter>
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
        <CardFooter className="flex justify-end border-t border-destructive bg-destructive/10 py-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ActionButton
                loading={accountDeleteLoading}
                onClick={() => {}} // handled inside the dialog action
                label="Delete Account"
                loadingLabel="Deleting Account..."
                variant="destructive"
              />
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
                    loading={accountDeleteLoading}
                    onClick={handleDeleteAccount}
                    label="Delete Account"
                    loadingLabel="Deleting Account..."
                    variant="destructive"
                  />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
