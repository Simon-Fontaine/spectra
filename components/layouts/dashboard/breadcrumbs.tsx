"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname.startsWith("/dashboard")) return null;

  const segments = pathname
    .replace(/^\/dashboard\/?/, "")
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean);

  const generateUrl = (index: number) => {
    if (index === -1) return "/dashboard";
    return `/dashboard/${segments.slice(0, index + 1).join("/")}`;
  };

  const formatSegment = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => (
          <React.Fragment key={segment}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={generateUrl(index)}>
                  {formatSegment(segment)}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
