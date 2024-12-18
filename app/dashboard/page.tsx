import { requireProfile } from "@/utils/profile";
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to the dashboard. What would you like to do today?",
};

export default async function DashboardPage() {
  const userData = await requireProfile();
  const profile = userData.profile!;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Welcome, {profile.username}!</PageHeaderHeading>
        <PageHeaderDescription>
          What would you like to do today?
        </PageHeaderDescription>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
