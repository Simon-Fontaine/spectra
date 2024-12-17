import {
  Users2,
  CalendarDays,
  UserCog,
  Shield,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { Profile } from "@/utils/profile";

interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavConfig {
  navMain: NavItem[];
  navSecondary: NavItem[];
}

export function getDashboardConfig(
  profile: Profile,
  pathname: string
): NavConfig {
  const isAdmin = profile.app_role === "admin";
  const isActive = (url: string) => pathname.startsWith(url);

  return {
    navMain: [
      {
        title: "Team",
        url: "/dashboard/team",
        isActive: isActive("/dashboard/team"),
        icon: Users2,
        items: [
          {
            title: "Replays",
            url: "/dashboard/team/replays",
          },
          {
            title: "Roster",
            url: "/dashboard/team/roster",
          },
        ],
      },

      {
        title: "Schedule",
        url: "/dashboard/schedule",
        isActive: isActive("/dashboard/schedule"),
        icon: CalendarDays,
        items: [
          {
            title: "Practice",
            url: "/dashboard/schedule/practice",
          },
          {
            title: "Matches",
            url: "/dashboard/schedule/matches",
          },
          {
            title: "Events",
            url: "/dashboard/schedule/events",
          },
        ],
      },

      ...(isAdmin
        ? [
            {
              title: "Admin",
              url: "/dashboard/admin",
              isActive: isActive("/dashboard/admin"),
              icon: Shield,
              items: [
                {
                  title: "User Management",
                  url: "/dashboard/admin/users",
                },
                {
                  title: "Team Settings",
                  url: "/dashboard/admin/settings",
                },
                {
                  title: "Access Control",
                  url: "/dashboard/admin/access",
                },
              ],
            },
          ]
        : []),
      {
        title: "Profile",
        url: "/dashboard/profile",
        isActive: isActive("/dashboard/profile"),
        icon: UserCog,
        items: [
          {
            title: "Settings",
            url: "/dashboard/profile/settings",
          },
          {
            title: "Notifications",
            url: "/dashboard/profile/notifications",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Help",
        url: "mailto:help@owspectra.com",
        icon: HelpCircle,
      },
    ],
  };
}

export interface ActiveNavState {
  main?: string;
  sub?: string;
}
