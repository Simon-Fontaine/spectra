import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, Trophy, X, Minus, BarChart2, Activity } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div
              className={`text-xs ${
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                    ? "text-red-500"
                    : "text-yellow-500"
              }`}
            >
              {trendValue}
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

type StatsType = {
  totalReplays: number;
  victories: number;
  defeats: number;
  draws: number;
  overallWinRate: number;
  gameModeWinRates: {
    mode: string;
    winRate: number;
    total: number;
  }[];
};

export const StatCards = ({ stats }: { stats: StatsType }) => {
  const {
    totalReplays,
    victories,
    defeats,
    draws,
    overallWinRate,
    gameModeWinRates,
  } = stats;

  // Find the best performing game mode
  const bestGameMode = gameModeWinRates[0];

  return (
    <>
      <StatCard
        title="Total Matches"
        value={totalReplays}
        icon={Activity}
        description="All recorded matches"
      />
      <StatCard
        title="Overall Win Rate"
        value={`${overallWinRate}%`}
        icon={Percent}
        description={`${victories} wins, ${defeats} losses, ${draws} draws`}
        trend={overallWinRate >= 50 ? "up" : "down"}
        trendValue={`${victories} victories`}
      />
      <StatCard
        title="Most Played Mode"
        value={bestGameMode ? bestGameMode.mode : "N/A"}
        description={
          bestGameMode
            ? `${bestGameMode.total} matches played`
            : "No matches recorded"
        }
        icon={BarChart2}
        trend={bestGameMode?.winRate >= 50 ? "up" : "down"}
        trendValue={bestGameMode ? `${bestGameMode.winRate}% win rate` : ""}
      />
    </>
  );
};

export default StatCards;
