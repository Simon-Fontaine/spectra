import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-border/40 dark:border-border">
      <div className="mx-auto w-full border-border/40 min-[1800px]:max-w-[1536px] min-[1800px]:border-x dark:border-border">
        <AppHeader />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}
