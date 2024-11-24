type NavigationItem = {
  title: string;
  href: string;
  disabled: boolean;
  external: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const navigationConfig: NavigationItem[] = [
  {
    title: "Roster",
    href: "/roster",
    disabled: false,
    external: false,
  },
  {
    title: "Calendar",
    href: "/calendar",
    disabled: false,
    external: false,
  },
  {
    title: "News",
    href: "/news",
    disabled: false,
    external: false,
  },
  {
    title: "Roster Reveal",
    href: "https://www.youtube.com/",
    disabled: false,
    external: true,
  },
];

export type NavigationConfig = typeof navigationConfig;
