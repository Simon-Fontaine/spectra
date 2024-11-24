"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navigationConfig } from "@/config/navigation";
import { Icons } from "@/components/icons";

export function NavigationMobile() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="!size-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Navigation links</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            <Link href="/" onClick={() => setOpen(false)} className="text-base">
              Home
            </Link>
            {navigationConfig.map((item, index) =>
              item.href && !item.disabled ? (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-base"
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
