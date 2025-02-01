import { Metadata } from "next";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import prisma from "@/lib/prisma";
import { TeamRoster } from "@/components/team-roster";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { Announcement } from "@/components/announcement";

export const metadata: Metadata = {
  title: "Team Roster",
  description: `Meet the competitive Overwatch roster of ${APP_CONFIG_PUBLIC.APP_NAME}`,
};

export default async function RosterPage() {
  const members = await prisma.user.findMany({
    omit: {
      email: true,
      password: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Our Roster</PageHeaderHeading>
        <PageHeaderDescription>
          Meet our competitive Overwatch team, a group of dedicated players
          striving for excellence in every match.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6">
        <TeamRoster members={members} />
      </div>
    </div>
  );
}
