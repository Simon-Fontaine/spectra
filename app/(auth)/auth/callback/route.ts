import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (!token_hash || !type) {
    redirect("/error");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    console.error("Verification error:", error);
    redirect("/error");
  }

  // For invitations, redirect to onboarding
  if (type === "invite") {
    encodedRedirect(
      "success",
      `/onboarding`,
      "Welcome to the team! Please complete your profile!"
    );
  }

  // For password recovery, redirect to profile settings
  if (type === "recovery") {
    encodedRedirect(
      "success",
      `/dashboard/profile/settings`,
      "Choose a strong new password in the field below"
    );
  }

  // For email change, redirect to profile settings
  if (type === "email_change") {
    encodedRedirect(
      "success",
      "/dashboard/profile/settings",
      "Your email has been updated"
    );
  }

  // For other verifications (signup, etc)
  redirect("/dashboard");
}
