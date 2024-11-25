"use client";

import { signOutAction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Profile } from "@/utils/profile";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Shield,
} from "lucide-react";
import Link from "next/link";

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
  email: string;
  className?: string;
}

const UserInfo = ({ profile, email, className }: UserInfoProps) => (
  <div className={cn("grid flex-1 text-left text-sm leading-tight", className)}>
    <span className="truncate font-semibold">{profile.username}</span>
    <span className="truncate text-xs text-muted-foreground">{email}</span>
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

interface UserMenuProps {
  profile: Profile;
  email: string;
  variant?: "default" | "sidebar";
  side?: "bottom" | "right";
  align?: "start" | "end";
}

export function UserMenu({
  profile,
  email,
  variant = "default",
  side = "bottom",
  align = "end",
}: UserMenuProps) {
  const isSidebar = variant === "sidebar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className={cn(
            "group relative gap-2",
            isSidebar
              ? "h-auto px-2 py-2 w-full justify-start hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
              : "hover:bg-accent/80 px-2 py-2"
          )}
        >
          <UserAvatar profile={profile} />
          <UserInfo profile={profile} email={email} />
          <ChevronsUpDown className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={side}
        align={align}
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 p-2">
            <UserAvatar profile={profile} />
            <UserInfo profile={profile} email={email} />
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
