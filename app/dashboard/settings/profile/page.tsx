import { PageHeaderHeading } from "@/components/page-header";

export default async function DashboardSettingsProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeaderHeading>Update Your Profile</PageHeaderHeading>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
