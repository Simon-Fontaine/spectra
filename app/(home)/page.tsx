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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VideoIcon } from "lucide-react";

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

      <div className="container py-6">
        <Card className="overflow-hidden border-2 bg-background/60 shadow-xl backdrop-blur">
          <CardHeader className="space-y-2 border-b bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <VideoIcon className="h-4 w-4" />
              <p className="text-sm font-medium">Latest Video</p>
            </div>
            <CardTitle className="text-2xl">SPECTRA Roster Reveal</CardTitle>
            <CardDescription className="text-base">
              Meet the players who will be representing us in the upcoming
              season
            </CardDescription>
          </CardHeader>
          <CardContent className="aspect-video p-0">
            <div className="relative h-0 w-full pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/Ji4bltE3nus"
                title="SPECTRA Roster Reveal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
