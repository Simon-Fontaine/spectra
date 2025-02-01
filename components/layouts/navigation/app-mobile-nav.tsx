"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { APP_NAVIGATION } from "@/config/config-ui";
import { ExternalLinkIcon, MenuIcon } from "lucide-react";

export function AppMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon />
          <span className="sr-only">Toggle Navigation Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <DrawerDescription>Site navigation links</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-base"
            >
              Home
            </Link>
            {APP_NAVIGATION.map((item, index) =>
              item.href && !item.disabled ? (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base"
                  target={item.external ? "_blank" : undefined}
                  aria-label={item.title}
                >
                  <div className="flex items-center gap-1">
                    {item.icon ? (
                      <item.icon className="size-4" aria-hidden="true" />
                    ) : null}
                    <span>{item.title}</span>
                    {item.external ? (
                      <ExternalLinkIcon className="size-4" />
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
