import Link from "next/link";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-4 py-6 md:h-24 md:flex-row md:items-center md:justify-between md:py-0">
        <p className="text-balance text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {APP_CONFIG_PUBLIC.APP_NAME}. All
          rights reserved.
        </p>

        <nav className="flex items-center justify-center gap-4 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground text-muted-foreground underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
