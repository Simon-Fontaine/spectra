import { deleteSession, validateCSRF } from "@/lib/auth/session";
import { NextResponse } from "next/server";

/**
 * Logs out a user by deleting session & clearing cookies.
 * POST /api/auth/logout
 */
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, error: "No cookies." },
        { status: 401 },
      );
    }

    // Extract session token
    const sessionCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("session_token="));
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "No session token." },
        { status: 401 },
      );
    }
    const rawToken = sessionCookie.split("=")[1];

    // Extract CSRF token
    const csrfCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("csrf_token="));
    const rawCSRF = csrfCookie ? csrfCookie.split("=")[1] : null;

    // Validate CSRF
    const valid = await validateCSRF(rawToken, rawCSRF);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "CSRF check failed." },
        { status: 403 },
      );
    }

    // Delete session
    await deleteSession(rawToken);

    // Clear cookies
    const res = NextResponse.json({ success: true });
    res.cookies.set("session_token", "", { maxAge: 0 });
    res.cookies.set("csrf_token", "", { maxAge: 0 });
    return res;
  } catch (err) {
    console.error("LOGOUT:", err);
    return NextResponse.json(
      { success: false, error: "Logout failed." },
      { status: 500 },
    );
  }
}
