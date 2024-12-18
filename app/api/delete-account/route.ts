import { createClient } from "@/utils/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response(
      JSON.stringify({ error: "You must be logged in to use this service" }),
      { status: 401 }
    );
  }
  return { user, supabase };
}

export async function POST(request: Request) {
  const { user, supabase } = await getAuthenticatedUser();

  supabase.auth.admin.deleteUser(user.id);

  return new Response(JSON.stringify({ success: true }));
}
