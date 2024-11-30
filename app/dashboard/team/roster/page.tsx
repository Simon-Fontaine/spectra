import { createClient } from "@/utils/supabase/server";
import { TeamRoster } from "@/components/team-roster";
import {
  PageHeaderHeading,
  PageHeaderDescription,
} from "@/components/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Roster",
  description: "View all team members and their roles",
};

export default async function TeamRosterPage() {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("profile")
    .select("id, username, avatar_url, ow_role, is_substitute, app_role")
    .order("username");

  if (error) {
    console.error("Error fetching team members:", error);
    return <div>Error loading team roster</div>;
  }

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
