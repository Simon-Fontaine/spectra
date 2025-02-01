"use client";

import {
  DASHBOARD_MAIN_NAVIGATION,
  DASHBOARD_ADMIN_NAVIGATION,
  DASHBOARD_SECONDARY_NAVIGATION,
} from "@/lib/config-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Role } from "@prisma/client";
import { ComponentProps } from "react";
import { SessionWithUser } from "@/types/models";
import { UserMenu } from "@/components/layouts/user-menu";
import { NavMain } from "@/components/layouts/dashboard/nav-main";
import { NavAdmin } from "@/components/layouts/dashboard/nav-admin";
import { NavHeader } from "@/components/layouts/dashboard/nav-header";
import { NavSecondary } from "@/components/layouts/dashboard/nav-secondary";

export function AppSidebar({
  session,
  ...props
}: ComponentProps<typeof Sidebar> & { session: SessionWithUser }) {
  const role = session.user.roles;
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={DASHBOARD_MAIN_NAVIGATION} />
        {role.includes(Role.ADMIN) && (
          <NavAdmin items={DASHBOARD_ADMIN_NAVIGATION} />
        )}
        <NavSecondary items={DASHBOARD_SECONDARY_NAVIGATION} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu session={session} variant="sidebar" isMobile={isMobile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
