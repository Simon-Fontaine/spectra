import { Announcement } from "@/components/announcement";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function Index() {
  return (
    <div className="relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>We are {siteConfig.name}</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/roster" className="group">
              Learn more
              <Icons.chevronRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
    </div>
  );
}
