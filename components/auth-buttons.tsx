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

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface UserAvatarProps {
  user: UserProfile;
  className?: string;
}

const UserAvatar = ({ user, className }: UserAvatarProps) => (
  <Avatar className={cn("h-8 w-8 rounded-lg", className)}>
    <AvatarImage src={user.avatar} alt={user.name} />
    <AvatarFallback className="rounded-lg">
      {user.name.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

interface UserInfoProps {
  user: UserProfile;
  className?: string;
}

const UserInfo = ({ user, className }: UserInfoProps) => (
  <div className={cn("grid flex-1 text-left text-sm leading-tight", className)}>
    <span className="truncate font-semibold">{user.name}</span>
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

  const userProfile: UserProfile = {
    name: "spectra",
    email: "m@example.com",
    avatar: "/images/default.png",
  };

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="ghost"
          className="group relative h-auto gap-2 px-2 py-2 hover:bg-accent/80 data-[state=open]:bg-accent"
        >
          <UserAvatar user={userProfile} />
          <UserInfo user={userProfile} />
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
            <UserAvatar user={userProfile} />
            <UserInfo user={userProfile} />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <MenuItem
            icon={<BadgeCheck className="size-4" />}
            className="hover:bg-accent/80"
          >
            <Link href="/account" className="w-full">
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
          <MenuItem
            icon={<Bell className="size-4" />}
            className="hover:bg-accent/80"
          >
            <Link href="/notifications" className="w-full">
              Notifications
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
