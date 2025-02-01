import Link from "next/link";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeaderHeading } from "@/components/page-header";
import { UserEditForms } from "./_components/useredit-form";

interface DashboardUserEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardUserEditPage(
  props: DashboardUserEditPageProps
) {
  const { id } = await props.params;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
    include: { sessions: true },
  });

  if (!user) {
    return (
      <main className="flex h-full items-center justify-center">
        <div className="max-w-md text-center grid gap-4">
          <Card className="bg-destructive ">
            <CardHeader>
              <CardTitle className="text-destructive-foreground">
                Oops! We couldn&apos;t find the user you&apos;re looking for.
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

  return (
    <div className="flex flex-1 flex-col gap-10 p-4">
      <PageHeaderHeading>
        Manage {user.username}&apos;s Account
      </PageHeaderHeading>

      <UserEditForms user={user} />
    </div>
  );
}
