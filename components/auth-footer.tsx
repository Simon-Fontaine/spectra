import Link from "next/link";

interface AuthFooterProps {
  links: {
    name: string;
    href: string;
  }[];
}

export default function AuthFooter({ links }: AuthFooterProps) {
  return (
    <p className="flex flex-col gap-2 px-8 text-center text-sm text-muted-foreground">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-brand underline underline-offset-4"
        >
          {link.name}
        </Link>
      ))}
    </p>
  );
}
