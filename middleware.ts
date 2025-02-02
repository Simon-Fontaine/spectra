import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { getSessionFromRawCookie } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware to check if a user is authenticated.
 * Protects routes that require authentication.
 */
export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  const isPasswordRoute =
    pathname === "/reset-password" || pathname === "/forgot-password";
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  const cookieHeader = request.headers.get("cookie") || "";
  const session = await getSessionFromRawCookie(cookieHeader);

  // Create a response object to update cookies if needed.
  const response = NextResponse.next();

  // If a session exists, refresh the cookie expiration.
  const sessionCookie = request.cookies.get("session_token")?.value;
  if (session && sessionCookie) {
    // Refresh the session cookie:
    response.cookies.set("session_token", sessionCookie, {
      httpOnly: true,
      secure: APP_CONFIG_PRIVATE.APP_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * APP_CONFIG_PRIVATE.SESSION_EXPIRATION_MINUTES,
      domain: APP_CONFIG_PRIVATE.APP_PROD
        ? APP_CONFIG_PUBLIC.APP_DOMAIN
        : undefined,
    });

    // Also refresh the CSRF token cookie:
    if (session.csrfSecret !== null) {
      response.cookies.set("csrf_token", session.csrfSecret, {
        httpOnly: false,
        secure: APP_CONFIG_PRIVATE.APP_PROD,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * APP_CONFIG_PRIVATE.CSRF_EXPIRATION_MINUTES,
        domain: APP_CONFIG_PRIVATE.APP_PROD
          ? APP_CONFIG_PUBLIC.APP_DOMAIN
          : undefined,
      });
    }
  }

  if (!session) {
    if (isProtectedRoute && !isAuthRoute && !isPasswordRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return response;
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isAdmin = session.user.roles.includes(Role.ADMIN);
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
