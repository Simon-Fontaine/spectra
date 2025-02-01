import type { LucideIcon } from "lucide-react";

export interface AppSocialItem {
  name: string;
  url: string;
  disabled: boolean;
  icon: React.ElementType;
}

export interface AppNavigationItem {
  title: string;
  href: string;
  disabled: boolean;
  external: boolean;
  icon?: React.ElementType;
}

export interface DashboardNavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface DashboardNavigationGroup {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items: DashboardNavigationItem[];
}
