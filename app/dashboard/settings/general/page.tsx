import { UserEditForms } from "@/components/forms/useredit-form";
import { PageHeaderHeading } from "@/components/page-header";
import { getSession } from "@/lib/auth/get-session";
import prisma from "@/lib/prisma";
import { cleanUserWithSessions } from "@/lib/utils/cleanData";

interface DashboardSettingsGeneralPageProps {
  searchParams: Promise<{ emailUpdated: string }>;
}

export default async function DashboardSettingsGeneralPage(
  props: DashboardSettingsGeneralPageProps,
) {
  const { emailUpdated } = await props.searchParams;
  const isEmailUpdated = emailUpdated === "true";

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

      {isEmailUpdated && (
        <div className="rounded-xl border bg-green-100 p-4 text-green-800 shadow">
          Your email has been updated successfully!
        </div>
      )}

      <UserEditForms user={cleanedUser} />
    </div>
  );
}
