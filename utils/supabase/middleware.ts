import { Database } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getUserData } from "../profile";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const userData = await getUserData();
    const user = userData?.user;
    const profile = userData?.profile;

    const path = request.nextUrl.pathname;

    // Middleware logic for authentication and authorization
    const isProtectedPath =
      path.startsWith("/dashboard") || path === "/onboarding";
    if (!user && isProtectedPath) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (path.startsWith("/dashboard/admin")) {
      if (!profile || profile.app_role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (path === "/onboarding") {
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return response;
    }

    if (path.startsWith("/dashboard")) {
      if (!profile) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      if (!profile.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    if (path === "/sign-in" || path === "/sign-up") {
      if (user && profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (user && !profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
};
