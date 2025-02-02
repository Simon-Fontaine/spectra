import { getSessionFromToken } from "@/lib/auth/session";
import { cleanSessionWithUser } from "@/lib/utils/cleanData";
import { NextResponse } from "next/server";

/**
 * Returns the current session (if any).
 * GET /api/auth/session
 */
export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return NextResponse.json({ session: null });
  }

  const sessionCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("session_token="));

  if (!sessionCookie) {
    return NextResponse.json({ session: null });
  }

  const rawToken = sessionCookie.split("=")[1];
  const session = await getSessionFromToken(rawToken);

  if (!session) {
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({ session: cleanSessionWithUser(session) });
}
