import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { TestChart } from "@/components/test-chart";

export default async function DashboardTeamPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Team Overview</PageHeaderHeading>
        <PageHeaderDescription>
          Overview of your team's performance and activity. (fake data)
        </PageHeaderDescription>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border shadow bg-muted/80 backdrop-blur p-4 border-b border-border/40">
        <TestChart />
      </div>
    </div>
  );
}
