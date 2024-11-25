import { createClient } from "@/utils/supabase/server";
import { type Database } from "@/lib/database.types";
import { redirect } from "next/navigation";

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function isAdmin() {
  const profile = await getProfile();
  return profile?.app_role === "admin";
}

export async function requireProfile() {
  const profile = await getProfile();
  if (!profile) {
    redirect("/sign-in");
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.app_role !== "admin") {
    redirect("/dashboard");
  }
  return profile;
}
