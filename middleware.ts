import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRawCookie } from "@/lib/auth/session";
import { Role } from "@prisma/client";

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

  if (!session) {
    if (isProtectedRoute && !isAuthRoute && !isPasswordRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isAdmin = session.user.roles.includes(Role.ADMIN);
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
