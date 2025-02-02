import { Announcement } from "@/components/announcement";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { ChevronRightIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>
          We are {APP_CONFIG_PUBLIC.APP_NAME}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {APP_CONFIG_PUBLIC.APP_DESCRIPTION}
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/roster" className="group">
              Learn more
              <ChevronRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </PageActions>
      </PageHeader>

      <div className="container py-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <VideoIcon className="h-4 w-4" />
              <p>Latest Video</p>
            </div>
            <CardTitle className="text-2xl">SPECTRA Roster Reveal</CardTitle>
            <CardDescription>
              Meet the players who will be representing us in the upcoming
              season
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-0 w-full pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/Ji4bltE3nus"
                title="SPECTRA Roster Reveal"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
