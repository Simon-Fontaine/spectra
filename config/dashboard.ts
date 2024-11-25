// config/dashboard.ts
import {
  Users2,
  Trophy,
  CalendarDays,
  UserCog,
  ScrollText,
  Swords,
  MessagesSquare,
  Shield,
  Bell,
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
          ...(isAdmin
            ? [
                {
                  title: "Invite Player",
                  url: "/dashboard/team/invite",
                },
              ]
            : []),
        ],
      },
      {
        title: "Tournaments",
        url: "/dashboard/tournaments",
        icon: Trophy,
        items: [
          {
            title: "Upcoming",
            url: "/dashboard/tournaments/upcoming",
          },
          {
            title: "Past",
            url: "/dashboard/tournaments/past",
          },
          {
            title: "Results",
            url: "/dashboard/tournaments/results",
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
      {
        title: "Strategy",
        url: "/dashboard/strategy",
        icon: Swords,
        items: [
          {
            title: "Team Comps",
            url: "/dashboard/strategy/comps",
          },
          {
            title: "Map Guides",
            url: "/dashboard/strategy/maps",
          },
          {
            title: "VOD Reviews",
            url: "/dashboard/strategy/vods",
          },
        ],
      },
      {
        title: "Communication",
        url: "/dashboard/communication",
        icon: MessagesSquare,
        items: [
          {
            title: "Announcements",
            url: "/dashboard/communication/announcements",
          },
          {
            title: "Team Chat",
            url: "/dashboard/communication/chat",
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
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  };
}

// Helper type for active state tracking
export interface ActiveNavState {
  main?: string;
  sub?: string;
}
