import { Database } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getProfile } from "../profile";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Get current user and profile
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const profile = await getProfile();

    // Get the current path
    const path = request.nextUrl.pathname;

    // Handle onboarding route
    if (path === "/onboarding") {
      // If user is not logged in, redirect to sign-in
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // If user has completed onboarding, redirect to dashboard
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // If user is logged in but doesn't have a profile, allow access to onboarding
      if (user && !profile) {
        return response;
      }
    }

    // Handle dashboard routes
    if (path.startsWith("/dashboard")) {
      // If user is not logged in, redirect to sign-in
      if (!user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // If user doesn't have a profile, redirect to onboarding
      if (!profile) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // If onboarding is not completed, redirect to onboarding
      if (!profile.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    // Handle authentication routes (sign-in, sign-up)
    if (path === "/sign-in" || path === "/sign-up") {
      // If user is logged in and has completed onboarding, redirect to dashboard
      if (user && profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // If user is logged in but hasn't completed onboarding, redirect to onboarding
      if (user && !profile?.onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // If you are here, a Supabase client could not be created!
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
