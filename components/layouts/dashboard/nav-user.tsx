"use client";

import { useSidebar } from "@/components/ui/sidebar";
import type { Profile } from "@/utils/profile";
import { UserMenu } from "@/components/user-menu";

export function NavUser({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const { isMobile } = useSidebar();

  return (
    <UserMenu
      profile={profile}
      email={email}
      variant="sidebar"
      side={isMobile ? "bottom" : "right"}
      align="end"
    />
  );
}
