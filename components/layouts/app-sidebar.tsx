"use client";

import * as React from "react";
import { NavMain } from "@/components/layouts/dashboard/nav-main";
import { NavSecondary } from "@/components/layouts/dashboard/nav-secondary";
import { NavUser } from "@/components/layouts/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icons } from "../icons";
import { siteConfig } from "@/config/site";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/utils/profile";
import { getDashboardConfig } from "@/config/dashboard";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
  profile: Profile;
}

export function AppSidebar({ user, profile, ...props }: AppSidebarProps) {
  if (!user || !profile) return null;

  const dashboardConfig = getDashboardConfig(profile);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Icons.logo width={40} height={40} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-xs">
                    {siteConfig.description}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardConfig.navMain} />
        <NavSecondary
          items={dashboardConfig.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={profile} email={user.email || ""} />
      </SidebarFooter>
    </Sidebar>
  );
}
