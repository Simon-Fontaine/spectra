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

interface ProfileSettingsProps {
  profile: Database["public"]["Tables"]["profile"]["Row"];
}

export default function ProfileSettingsPage({ profile }: ProfileSettingsProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [display_name, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [avatar_url, setAvatarUrl] = useState(profile.avatar_url);
  const { toast } = useToast();

  async function updateProfile({
    display_name,
    username,
    avatar_url,
  }: {
    display_name: string | null;
    username: string;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

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

      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            error.message ||
            "An unknown error occurred. Please try again later.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "An unknown error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    console.log("Deleting account...");
  }

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      {/* Page Title */}
      <PageHeaderHeading>Account Settings</PageHeaderHeading>

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
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Please use 32 characters maximum.
          </p>
          <Button
            size="sm"
            onClick={() =>
              updateProfile({ display_name, username, avatar_url })
            }
            disabled={loading}
          >
            Save
          </Button>
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
        </CardContent>
        <CardFooter className="flex justify-between border-t py-3">
          <p className="text-sm text-muted-foreground">
            Please use 48 characters maximum.
          </p>
          <Button
            size="sm"
            onClick={() =>
              updateProfile({ display_name, username, avatar_url })
            }
            disabled={loading}
          >
            Save
          </Button>
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
            </p>{" "}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-destructive bg-destructive/10 py-3">
          <Button size="sm" variant="destructive" onClick={handleDeleteAccount}>
            Delete Personal Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
