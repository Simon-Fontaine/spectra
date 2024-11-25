import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { getProfile } from "@/utils/profile";
import { UserMenu } from "./user-menu";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="hover:bg-accent/80 transition-colors"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  const profile = await getProfile();

  if (!profile)
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="hover:bg-accent/80 transition-colors"
      >
        <Link href="/onboarding">Complete Onboarding</Link>
      </Button>
    );

  return <UserMenu profile={profile} email={user.email || ""} />;
}
