"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SessionWithUser } from "@/types/models";
import {
  BellIcon,
  ChevronsUpDownIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LogOutIcon,
  Settings2Icon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface NavUserProps {
  session: SessionWithUser;
  isMobile?: boolean;
  variant?: "sidebar" | "header";
}

export function UserMenu({
  session,
  isMobile = false,
  variant = "sidebar",
}: NavUserProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastIdRef = useRef<string | number | undefined>(undefined);

  const { user } = session;
  const username = user.displayName || user.username;

  async function handleSignOut() {
    toastIdRef.current = toast.loading("Signing you out...");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to sign out.");
      }

      toast.success("Signed out successfully.", {
        id: toastIdRef.current,
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      toast.error(message, { id: toastIdRef.current });
    } finally {
      toastIdRef.current = undefined;
      setLoading(false);
    }
  }

  /**
   * Common trigger content
   */
  const menuTriggerContent = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatarUrl || undefined} alt={username} />
        <AvatarFallback className="rounded-lg">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{username}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
      <ChevronsUpDownIcon className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-180" />
    </>
  );

  /**
   * Common dropdown content
   */
  const menuContent = (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side={variant === "sidebar" ? (isMobile ? "bottom" : "right") : "bottom"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatarUrl || undefined} alt={username} />
            <AvatarFallback className="rounded-lg">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{username}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {variant === "header" && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/dashboard">
                <LayoutDashboardIcon className="mr-2" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings/general">
            <Settings2Icon className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings/profile">
            <User2Icon className="mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/settings/notifications">
            <BellIcon className="mr-2" />
            Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleSignOut}
        disabled={loading}
        className="cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2Icon className="animate-spin mr-2" />
            Signing out...
          </>
        ) : (
          <>
            <LogOutIcon className="mr-2" />
            Sign Out
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  if (variant === "sidebar") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {menuTriggerContent}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            {menuContent}
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="group relative gap-2 px-2 py-2 hover:bg-accent/80"
        >
          {menuTriggerContent}
        </Button>
      </DropdownMenuTrigger>
      {menuContent}
    </DropdownMenu>
  );
}
