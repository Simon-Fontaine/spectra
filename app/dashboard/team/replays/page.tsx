import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import UploadReplayScreenshot from "@/components/upload-replay-screenshot";
import ReplayHistory from "@/components/replay-history";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/utils/profile";
import { Metadata } from "next";
import _ from "lodash";

export const metadata: Metadata = {
  title: "Replays",
  description:
    "Upload a screenshot of your match history to extract replay codes",
};

export default async function DashboardTeamReplayPage() {
  const supabase = await createClient();
  const profile = await requireProfile();

  // Fetch the replays and maps with all necessary relationships
  const { data: replaysData, error: replaysError } = await supabase
    .from("replays")
    .select("*")
    .order("created_at", { ascending: false });

  if (replaysError) {
    console.error("Failed to fetch replays:", replaysError);
  }

  const map_names = _.uniqBy(replaysData, "map_name").map((replay) => ({
    id: replay.map_name,
    name: replay.map_name,
  }));

  const map_modes = _.uniqBy(replaysData, "map_mode").map((replay) => ({
    id: replay.map_mode,
    name: replay.map_mode,
  }));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Replays History</PageHeaderHeading>
        <PageHeaderDescription>
          Upload a screenshot of your match history to extract replay codes
        </PageHeaderDescription>
      </div>
      <UploadReplayScreenshot />
      <ReplayHistory
        replays={replaysData || []}
        map_names={map_names}
        map_modes={map_modes}
        profile={profile}
      />
    </div>
  );
}
