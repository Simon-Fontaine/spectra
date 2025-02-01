import Link from "next/link";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/get-session";

export default async function AuthButton() {
  const session = await getSession();

  if (!session)
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );

  return <UserMenu session={session} variant="header" />;
}
