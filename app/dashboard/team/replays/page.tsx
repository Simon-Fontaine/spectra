import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import UploadReplayScreenshot from "@/components/upload-replay-screenshot";
import ReplayHistory from "@/components/replay-history";
import { createClient } from "@/utils/supabase/server";
import { requireProfile } from "@/utils/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Replays",
  description:
    "Upload a screenshot of your match history to extract replay codes",
};

export default async function DashboardTeamReplayPage() {
  const supabase = await createClient();
  const profile = await requireProfile();

  // Fetch the replays and maps
  const { data: replaysData, error: replaysError } = await supabase
    .from("replay_codes")
    .select(
      `
      *,
      map:maps!map_id(
        id,
        name,
        game_mode:game_modes!game_mode_id(name)
      )
    `
    )
    .order("created_at", { ascending: false });

  const { data: mapsData, error: mapsError } = await supabase
    .from("maps")
    .select(
      `
      id,
      name,
      game_mode:game_modes!game_mode_id(name)
    `
    )
    .eq("is_active", true);

  if (replaysError || mapsError) {
    console.error("Error fetching data:", replaysError || mapsError);
    return <div>Error loading data</div>;
  }

  // Transform the data as needed
  const replays = replaysData.map((replay) => ({
    ...replay,
    map: {
      id: (replay.map as any).id,
      name: (replay.map as any).name,
      game_mode: {
        name: (replay.map as any).game_mode.name,
      },
    },
  }));

  const maps = mapsData.map((map) => ({
    id: map.id,
    name: map.name,
    game_mode: {
      name: (map.game_mode as any).name,
    },
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
      <ReplayHistory replays={replays} maps={maps} profile={profile} />
    </div>
  );
}
