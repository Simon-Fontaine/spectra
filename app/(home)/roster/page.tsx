import { createClient } from "@/utils/supabase/server";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { Announcement } from "@/components/announcement";
import { TeamRoster } from "@/components/team-roster";

export const metadata: Metadata = {
  title: "Team Roster",
  description: `Meet the competitive Overwatch roster of ${siteConfig.name}`,
};

export default async function RosterPage() {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profile")
    .select(
      "id, username, display_name, avatar_url, ow_role, is_substitute, app_role"
    )
    .order("username");

  if (error) {
    console.error("Error fetching team members:", error);
    return <div>Error loading team roster</div>;
  }
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
        <TeamRoster members={members || []} />
      </div>
    </div>
  );
}
