import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getProfile } from "@/utils/profile";
import type { Profile } from "@/utils/profile";
import { User } from "@supabase/supabase-js";

interface UserAvatarProps {
  profile: Profile;
  className?: string;
}

const UserAvatar = ({ profile, className }: UserAvatarProps) => (
  <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
    <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
    <AvatarFallback className="rounded-lg">
      {profile.username.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

interface UserInfoProps {
  profile: Profile;
  user: User;
  className?: string;
}

const UserInfo = ({ profile, user, className }: UserInfoProps) => (
  <div className={cn("grid flex-1 text-left text-sm leading-tight", className)}>
    <span className="truncate font-semibold">{profile.username}</span>
    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
  </div>
);

interface MenuItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MenuItem = ({ icon, children, className }: MenuItemProps) => (
  <DropdownMenuItem className={cn("gap-2", className)}>
    {icon}
    {children}
  </DropdownMenuItem>
);

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="hover:bg-accent/80 transition-colors"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  const profile = await getProfile();

  if (!profile)
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="hover:bg-accent/80 transition-colors"
      >
        <Link href="/onboarding">Complete Onboarding</Link>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="group relative h-auto gap-2 px-2 py-2 hover:bg-accent/80 data-[state=open]:bg-accent"
        >
          <UserAvatar profile={profile} />
          <UserInfo profile={profile} user={user} />
          <ChevronsUpDown className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 p-2">
            <UserAvatar profile={profile} />
            <UserInfo profile={profile} user={user} />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItem
            icon={<BadgeCheck className="size-4" />}
            className="hover:bg-accent/80"
          >
            <Link href="/dashboard/profile/settings" className="w-full">
              Account
            </Link>
          </MenuItem>
          <MenuItem
            icon={<LayoutDashboard className="size-4" />}
            className="hover:bg-accent/80"
          >
            <Link href="/dashboard" className="w-full">
              Dashboard
            </Link>
          </MenuItem>
          {profile.app_role === "admin" && (
            <MenuItem
              icon={<Shield className="size-4" />}
              className="hover:bg-accent/80"
            >
              <Link href="/dashboard/admin" className="w-full">
                Admin Panel
              </Link>
            </MenuItem>
          )}
          <MenuItem
            icon={<Bell className="size-4" />}
            className="hover:bg-accent/80"
          >
            <Link
              href="/dashboard/communication/announcements"
              className="w-full"
            >
              Announcements
            </Link>
          </MenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <form action={signOutAction} className="w-full">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-2 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
