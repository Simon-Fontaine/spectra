import { createClient } from "@/utils/supabase/server";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Metadata } from "next";
import { MatchHistoryAreaChart } from "@/components/match-history-area-chart";
import { StatCards } from "@/components/stat-cards";
import { Database } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Team Overview",
  description: "Analytics and insights from your team's match history.",
};

type Replay = Database["public"]["Tables"]["replays"]["Row"];

interface Stats {
  totalReplays: number;
  victories: number;
  defeats: number;
  draws: number;
  overallWinRate: number;
  gameModeWinRates: { mode: string; winRate: number; total: number }[];
}

/**
 * Calculates aggregate statistics from a list of replays.
 */
function calculateStats(replays: Replay[]): Stats {
  // Aggregate stats
  const { totalReplays, victory, defeat, draw, gameModes } = replays.reduce(
    (acc, replay) => {
      acc.totalReplays += 1;

      const resultKey = replay.result.toLowerCase() as
        | "victory"
        | "defeat"
        | "draw";
      acc[resultKey] += 1;

      if (!acc.gameModes[replay.map_mode]) {
        acc.gameModes[replay.map_mode] = { total: 0, victories: 0 };
      }

      acc.gameModes[replay.map_mode].total += 1;
      if (replay.result === "Victory") {
        acc.gameModes[replay.map_mode].victories += 1;
      }

      return acc;
    },
    {
      totalReplays: 0,
      victory: 0,
      defeat: 0,
      draw: 0,
      gameModes: {} as Record<string, { total: number; victories: number }>,
    }
  );

  const overallWinRate =
    totalReplays > 0 ? Number(((victory / totalReplays) * 100).toFixed(1)) : 0;

  const gameModeWinRates = Object.entries(gameModes)
    .map(([mode, data]) => ({
      mode,
      winRate:
        data.total > 0
          ? Number(((data.victories / data.total) * 100).toFixed(1))
          : 0,
      total: data.total,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totalReplays,
    victories: victory,
    defeats: defeat,
    draws: draw,
    overallWinRate,
    gameModeWinRates,
  };
}

/**
 * Prepares the replay history data for the area chart.
 */
function prepareMatchHistory(replays: Replay[]) {
  const historyMap = replays.reduce(
    (acc, replay) => {
      const date = new Date(replay.created_at).toISOString().split("T")[0];
      const resultKey = replay.result.toLowerCase() as
        | "victory"
        | "defeat"
        | "draw";

      if (!acc[date]) {
        acc[date] = { date, victory: 0, defeat: 0, draw: 0 };
      }

      acc[date][resultKey] += 1;

      return acc;
    },
    {} as Record<
      string,
      { date: string; victory: number; defeat: number; draw: number }
    >
  );

  return Object.values(historyMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export default async function DashboardTeamPage() {
  const supabase = await createClient();

  const { data: replays, error } = await supabase
    .from("replays")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching replays:", error);
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <section>
          <PageHeaderHeading>Team Overview</PageHeaderHeading>
          <PageHeaderDescription>
            There was an error loading the team analytics.
          </PageHeaderDescription>
        </section>
      </div>
    );
  }

  if (!replays || replays.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <section>
          <PageHeaderHeading>Team Overview</PageHeaderHeading>
          <PageHeaderDescription>
            No match data found. Upload your first replay to start tracking your
            team's performance.
          </PageHeaderDescription>
        </section>
      </div>
    );
  }

  const stats = calculateStats(replays);
  const replaysHistoryArray = prepareMatchHistory(replays);

  return (
    <div className="flex flex-1 flex-col gap-8 p-4">
      <section>
        <PageHeaderHeading>Team Overview</PageHeaderHeading>
        <PageHeaderDescription>
          Analytics and insights from your team's match history.
        </PageHeaderDescription>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        <StatCards stats={stats} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Match History</h2>
        <MatchHistoryAreaChart chartData={replaysHistoryArray} />
      </section>
    </div>
  );
}
