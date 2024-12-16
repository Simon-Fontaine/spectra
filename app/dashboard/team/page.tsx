import { createClient } from "@/utils/supabase/server";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Metadata } from "next";
import { MatchHistoryAreaChart } from "@/components/match-history-area-chart";
import { StatCards } from "@/components/stat-cards";

export const metadata: Metadata = {
  title: "Team Overview",
  description: "Analytics and insights from your team's match history.",
};

const calculateStats = (replays: any[]) => {
  // Use reduce to calculate all stats in a single pass
  const stats = replays.reduce(
    (acc, replay) => {
      // Update total counts
      acc.totalReplays++;
      acc[replay.result.toLowerCase()]++;

      // Get the game mode
      const gameMode = replay.map.game_mode.name;
      if (!acc.gameModes[gameMode]) {
        acc.gameModes[gameMode] = { total: 0, victories: 0 };
      }
      acc.gameModes[gameMode].total++;
      if (replay.result === "Victory") {
        acc.gameModes[gameMode].victories++;
      }

      return acc;
    },
    {
      totalReplays: 0,
      victory: 0,
      defeat: 0,
      draw: 0,
      gameModes: {},
    }
  );

  // Calculate win rates
  const overallWinRate =
    stats.totalReplays > 0
      ? ((stats.victory / stats.totalReplays) * 100).toFixed(1)
      : 0;

  const gameModeWinRates = Object.entries(stats.gameModes).map(
    ([mode, data]: [string, any]) => ({
      mode,
      winRate:
        data.total > 0 ? ((data.victories / data.total) * 100).toFixed(1) : 0,
      total: data.total,
    })
  ) as { mode: string; winRate: number; total: number }[];

  // Sort game modes by total matches
  gameModeWinRates.sort((a, b) => b.total - a.total);

  return {
    totalReplays: Number(stats.totalReplays),
    victories: Number(stats.victory),
    defeats: Number(stats.defeat),
    draws: Number(stats.draw),
    overallWinRate: Number(overallWinRate),
    gameModeWinRates: gameModeWinRates,
  };
};

export default async function DashboardTeamPage() {
  const supabase = await createClient();

  // Fetch the replays with map and game mode data
  const { data: replays, error } = await supabase
    .from("replays")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching replays:", error);
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <PageHeaderHeading>Team Overview</PageHeaderHeading>
          <PageHeaderDescription>
            There was an error loading the team analytics.
          </PageHeaderDescription>
        </div>
      </div>
    );
  }

  const stats = calculateStats(replays);

  // Calculate match history data for the chart
  type ReplayHistoryType = Record<
    string,
    { date: string; victory: number; defeat: number; draw: number }
  >;

  const replaysHistory = replays.reduce((acc, replay) => {
    const date = new Date(replay.created_at).toISOString().split("T")[0];
    const result = replay.result;
    const key = result.toLowerCase() as "victory" | "defeat" | "draw";

    if (!acc[date]) {
      acc[date] = { date, victory: 0, defeat: 0, draw: 0 };
    }

    acc[date][key] += 1;

    return acc;
  }, {} as ReplayHistoryType);

  const replaysHistoryArray = Object.values(replaysHistory).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Team Overview</PageHeaderHeading>
        <PageHeaderDescription>
          Analytics and insights from your team's match history.
        </PageHeaderDescription>
      </div>

      <div className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {/* Quick Stats */}
        <StatCards stats={stats} />

        {/* Charts */}
        <div className="md:col-span-2 lg:col-span-3">
          <MatchHistoryAreaChart chartData={replaysHistoryArray} />
        </div>
      </div>
    </div>
  );
}
