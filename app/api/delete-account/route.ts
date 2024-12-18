import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to delete your account" },
      { status: 401 }
    );
  }

  const userId = user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.avatar_url) {
    const fileName = profile.avatar_url.split("/avatars/")[1];

    if (fileName) {
      const { error: avatarDeleteError } = await supabase.storage
        .from("avatars")
        .remove([fileName]);
      if (avatarDeleteError) {
        console.error("Failed to delete avatar:", avatarDeleteError);
      }
    }
  }

  const { data: replays, error: replaysError } = await supabase
    .from("replays")
    .select("*")
    .eq("uploaded_by", userId);

  if (replaysError) {
    console.error("Error fetching replays:", replaysError);
  } else if (replays && replays.length > 0) {
    for (const replay of replays) {
      if (replay.uploaded_image_url) {
        const fileName = replay.uploaded_image_url.split("/images/")[1];

        if (fileName) {
          const { error: replayImageDeleteError } = await supabase.storage
            .from("images")
            .remove([fileName]);

          if (replayImageDeleteError) {
            console.error(
              `Failed to delete replay image ${fileName}:`,
              replayImageDeleteError
            );
          }
        }
      }
    }
  }

  const { error: authDeleteError } =
    await supabase.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    console.error("Failed to delete user:", authDeleteError);
    return NextResponse.json(
      { error: "Failed to delete user from auth" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
