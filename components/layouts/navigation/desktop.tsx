"use client";

import { Icons } from "@/components/icons";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationDesktop() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo width={40} height={40} />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        {navigationConfig.map((item, index) =>
          item.href && !item.disabled ? (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.endsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/80"
              )}
              target={item.external ? "_blank" : undefined}
              aria-label={item.title}
            >
              <div className="flex items-center gap-1">
                {item.icon ? (
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                ) : null}
                <span>{item.title}</span>
                {item.external ? <Icons.external className="h-4 w-4" /> : null}
              </div>
            </Link>
          ) : null
        )}
      </nav>
    </div>
  );
}
