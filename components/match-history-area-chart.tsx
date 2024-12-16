"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MatchHistoryType = {
  date: string;
  victory: number;
  defeat: number;
  draw: number;
}[];

interface ExtendedChartConfig extends ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    fillId: string;
    varName: string;
  };
}

const chartConfig = {
  victory: {
    label: "Victory",
    color: "hsl(var(--chart-2))",
    fillId: "fillVictory",
    varName: "--color-victory",
  },
  defeat: {
    label: "Defeat",
    color: "hsl(var(--chart-1))",
    fillId: "fillDefeat",
    varName: "--color-defeat",
  },
  draw: {
    label: "Draw",
    color: "hsl(var(--chart-4))",
    fillId: "fillDraw",
    varName: "--color-draw",
  },
} satisfies ExtendedChartConfig;

const TIME_RANGE_LABELS: Record<string, string> = {
  "90d": "3 months",
  "30d": "30 days",
  "7d": "7 days",
};

function getLabelForTimeRange(range: string): string {
  return TIME_RANGE_LABELS[range] || "3 months";
}

function createLinearGradient(id: string, varName: string) {
  return (
    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={`var(${varName})`} stopOpacity={0.8} />
      <stop offset="95%" stopColor={`var(${varName})`} stopOpacity={0.1} />
    </linearGradient>
  );
}

export function MatchHistoryAreaChart({
  chartData,
}: {
  chartData: MatchHistoryType;
}) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date();
    let daysToSubtract: number;

    switch (timeRange) {
      case "30d":
        daysToSubtract = 30;
        break;
      case "7d":
        daysToSubtract = 7;
        break;
      default:
        daysToSubtract = 90;
        break;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData
      .filter((item) => {
        const date = new Date(item.date);
        return date >= startDate && date <= referenceDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData, timeRange]);

  const timeLabel = getLabelForTimeRange(timeRange);

  if (filteredData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
          <CardDescription>No matches in this period.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Match History</CardTitle>
          <CardDescription>
            Showing your last {timeLabel} of match history.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select a time range"
          >
            <SelectValue placeholder={`Last ${timeLabel}`} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {Object.values(chartConfig).map((cfg) =>
                createLinearGradient(cfg.fillId, cfg.varName)
              )}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="victory"
              type="natural"
              fill={`url(#${chartConfig.victory.fillId})`}
              stroke={`var(${chartConfig.victory.varName})`}
            />
            <Area
              dataKey="defeat"
              type="natural"
              fill={`url(#${chartConfig.defeat.fillId})`}
              stroke={`var(${chartConfig.defeat.varName})`}
            />
            <Area
              dataKey="draw"
              type="natural"
              fill={`url(#${chartConfig.draw.fillId})`}
              stroke={`var(${chartConfig.draw.varName})`}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
