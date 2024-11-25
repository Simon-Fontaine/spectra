import {
  Users2,
  Trophy,
  CalendarDays,
  UserCog,
  Swords,
  MessagesSquare,
  Shield,
  HelpCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Profile } from "@/utils/profile";

interface NavItem {
  title: string;
  url: string;
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

export function getDashboardConfig(profile: Profile): NavConfig {
  const isAdmin = profile.app_role === "admin";

  return {
    navMain: [
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users2,
        items: [
          {
            title: "Roster",
            url: "/dashboard/team/roster",
          },
          {
            title: "Substitutes",
            url: "/dashboard/team/substitutes",
          },
        ],
      },

      {
        title: "Schedule",
        url: "/dashboard/schedule",
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
        url: "/dashboard/help",
        icon: HelpCircle,
      },
    ],
  };
}

export interface ActiveNavState {
  main?: string;
  sub?: string;
}
