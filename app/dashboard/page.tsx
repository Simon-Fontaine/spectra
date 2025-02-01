import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { getSession } from "@/lib/auth/get-session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    return <div>Not logged in</div>;
  }

  const username = session.user.displayName || session.user.username;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
        <PageHeaderHeading>Welcome, {username}!</PageHeaderHeading>
        <PageHeaderDescription>
          What would you like to do today?
        </PageHeaderDescription>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
