import { siteConfig } from "@/config/site";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <Link
    href={href}
    className="transition-colors hover:text-foreground text-muted-foreground underline-offset-4 hover:underline"
  >
    {children}
  </Link>
);

export function SiteFooter({ className }: { className?: string }) {
  const footerLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ];

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex flex-col gap-4 py-6 md:h-24 md:flex-row md:items-center md:justify-between md:py-0">
        <p className="text-balance text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
          reserved.
        </p>

        <nav className="flex items-center justify-center gap-4 text-sm">
          {footerLinks.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
