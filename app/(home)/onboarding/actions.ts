"use server";

import { createClient } from "@/utils/supabase/server";
import type { Profile } from "@/utils/profile";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";

function validateOnboardingForm(
  username: string,
  password: string,
  confirmPassword: string,
  ow_role: string
) {
  if (
    !username?.trim() ||
    !password?.trim() ||
    !confirmPassword?.trim() ||
    !ow_role
  ) {
    throw new Error("All fields are required");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
}

export async function createOnboardingAction(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const ow_role = formData.get("ow_role") as Profile["ow_role"];

  try {
    validateOnboardingForm(username, password, confirmPassword, ow_role);

    const { data: existingUser } = await supabase
      .from("profile")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Username is already taken");
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    });
    if (passwordError) {
      throw new Error(passwordError.message);
    }

    const { error: profileError } = await supabase.from("profile").insert({
      username,
      ow_role,
      onboarding_completed: true,
    });

    if (profileError) {
      throw new Error(profileError.message);
    }

    redirect("/dashboard");
  } catch (err) {
    console.error("Onboarding error:", err);
    encodedRedirect(
      "error",
      "/onboarding",
      err instanceof Error ? err.message : "Failed to complete onboarding"
    );
  }
}
