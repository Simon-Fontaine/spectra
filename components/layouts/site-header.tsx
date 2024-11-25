import Link from "next/link";
import AuthButton from "../auth-buttons";

import { NavigationDesktop } from "@/components/layouts/navigation/desktop";
import { NavigationMobile } from "@/components/layouts/navigation/mobile";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import { socialsConfig } from "@/config/socials";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4">
        <NavigationDesktop />
        <NavigationMobile />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-0.5">
            {socialsConfig.map((social, index) =>
              social.url && !social.disabled ? (
                <Button
                  variant="ghost"
                  size="icon"
                  key={index}
                  className="h-8 w-8 px-0"
                >
                  <Link href={social.url} target="_blank" rel="noreferrer">
                    {social.icon ? (
                      <social.icon className="h-4 w-4" />
                    ) : (
                      social.name
                    )}
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ) : null
            )}
            <ModeSwitcher />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
