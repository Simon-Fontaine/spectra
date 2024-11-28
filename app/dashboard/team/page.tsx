import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { TestingAreaChartInteractive } from "@/components/testing-area-chart-interactive";
import { TestingBarChart } from "@/components/testing-bar-chart";
import { TestingBarChartInteractive } from "@/components/testing-bar-chart-interactive";
import { TestingLineChart } from "@/components/testing-line-chart";
import { TestingRadarChart } from "@/components/testing-radar-chart";

export default async function DashboardTeamPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Team Overview</PageHeaderHeading>
        <PageHeaderDescription>
          Overview of your team's performance and activity. (fake data)
        </PageHeaderDescription>
      </div>
      <div className="grid flex-1 scroll-mt-20 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        <TestingBarChart />
        <TestingLineChart />
        <TestingRadarChart />
        <div className="md:col-span-2 lg:col-span-3">
          <TestingAreaChartInteractive />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <TestingBarChartInteractive />
        </div>
      </div>
    </div>
  );
}
