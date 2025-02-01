import { cookies } from "next/headers";
import { getSessionFromToken } from "@/lib/auth/session";

/**
 * Retrieves a session from the 'session_token' cookie if present.
 * This is for server components. Also triggers sliding expiration internally.
 *
 * @returns The session object or null if none is found or expired.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_token");
  if (!sessionCookie?.value) return null;

  const session = await getSessionFromToken(sessionCookie.value);
  return session;
}
