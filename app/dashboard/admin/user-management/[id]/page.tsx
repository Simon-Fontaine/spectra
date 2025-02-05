import { UserEditForms } from "@/components/forms/useredit-form";
import { PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { cleanUserWithSessions } from "@/lib/utils/cleanData";
import Link from "next/link";

interface DashboardUserEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardUserEditPage(
  props: DashboardUserEditPageProps,
) {
  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: { sessions: true },
  });

  if (!user) {
    return (
      <main className="flex h-full items-center justify-center">
        <div className="grid max-w-md gap-4 text-center">
          <Card className="bg-destructive ">
            <CardHeader>
              <CardTitle className="text-destructive-foreground">
                Oops! We couldn't find the user you're looking for.
              </CardTitle>
              <CardDescription className="text-destructive-foreground">
                Please try refreshing the page or contact support if the issue
                persists
              </CardDescription>
            </CardHeader>
          </Card>

          <Button asChild>
            <Link className="w-full" href="/dashboard/admin/user-management">
              Go Back
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const cleanedUser = cleanUserWithSessions(user);
  const username = cleanedUser.displayName || cleanedUser.username;

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>Manage {username}'s Account</PageHeaderHeading>

      <UserEditForms user={cleanedUser} />
    </div>
  );
}
