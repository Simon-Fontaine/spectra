import { UserEditForms } from "@/components/forms/useredit-form";
import { PageHeaderHeading } from "@/components/page-header";
import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/prisma";
import { cleanUserWithSessions } from "@/lib/utils/cleanData";

export default async function DashboardSettingsGeneralPage() {
  const session = await getSession();
  if (!session) {
    return <div>Not logged in</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    include: { sessions: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const cleanedUser = cleanUserWithSessions(user);
  const username = cleanedUser.displayName || cleanedUser.username;

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>General settings, {username}!</PageHeaderHeading>

      <UserEditForms user={cleanedUser} />
    </div>
  );
}
