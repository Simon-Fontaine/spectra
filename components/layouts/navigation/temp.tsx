"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavigationMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden">
          <Icons.menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetHeader className="sr-only">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Icons.logo width={40} height={40} onClick={() => setOpen(false)} />
          {navigationConfig.map((item, index) =>
            item.href && !item.disabled ? (
              <Link
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-2.5",
                  pathname.endsWith(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                target={item.external ? "_blank" : undefined}
                aria-label={item.title}
              >
                <div className="flex items-center gap-1">
                  {item.icon ? (
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                  <span>{item.title}</span>
                  {item.external ? (
                    <Icons.external className="h-4 w-4" />
                  ) : null}
                </div>
              </Link>
            ) : null
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
