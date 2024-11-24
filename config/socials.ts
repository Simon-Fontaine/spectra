import { Icons } from "@/components/icons";

type SocialsItem = {
  name: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled: boolean;
};

export const socialsConfig: SocialsItem[] = [
  {
    name: "Twitter",
    url: "https://twitter.com/",
    icon: Icons.twitter,
    disabled: false,
  },
];

export type SocialsConfig = typeof socialsConfig;
