import Link from "next/link";
import { APP_SOCIALS } from "@/config/config-ui";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/layouts/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AppDesktopNav } from "@/components/layouts/navigation/app-desktop-nav";
import { AppMobileNav } from "@/components/layouts/navigation/app-mobile-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4">
        <AppDesktopNav />
        <AppMobileNav />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-0.5">
            {APP_SOCIALS.map((social, index) =>
              social.url && !social.disabled ? (
                <Button
                  asChild
                  key={index}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 px-0"
                >
                  <Link href={social.url} target="_blank" rel="noreferrer">
                    {social.icon ? (
                      <social.icon className="size-4" />
                    ) : (
                      social.name
                    )}
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ) : null
            )}
            <ThemeSwitcher />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
