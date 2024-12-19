import { createClient } from "@/utils/supabase/server";
import { type Database } from "@/lib/database.types";
import { redirect } from "next/navigation";

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

export async function getUserData(): Promise<{
  user: any;
  profile: Profile | null;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return { user, profile: null };
  }

  return { user, profile };
}

export async function isAdmin(): Promise<boolean> {
  const userData = await getUserData();
  return userData?.profile?.app_role === "admin";
}

export async function requireProfile() {
  const userData = await getUserData();

  if (!userData) {
    return redirect("/sign-in");
  }

  if (!userData.profile) {
    return redirect("/onboarding");
  }

  return userData;
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return redirect("/sign-in");
  }

  return true;
}
