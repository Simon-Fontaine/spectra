import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { TeamRoster } from "@/components/team-roster";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Roster",
  description: "View all team members and their roles",
};

export default async function TeamRosterPage() {
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
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Team Roster</PageHeaderHeading>
        <PageHeaderDescription>
          Meet our competitive Overwatch team members
        </PageHeaderDescription>
      </div>

      <TeamRoster members={members} />
    </div>
  );
}
