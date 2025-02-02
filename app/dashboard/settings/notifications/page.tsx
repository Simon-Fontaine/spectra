import { PageHeaderHeading } from "@/components/page-header";

export default async function DashboardSettingsNotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeaderHeading>Update Your Notifications</PageHeaderHeading>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
