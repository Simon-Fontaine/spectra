import { getSessionFromToken } from "@/lib/auth/session";
import type { SessionWithUser } from "@/types/models";
import { cookies } from "next/headers";

/**
 * Retrieves a session from the 'session_token' cookie if present.
 * This is for server components. Also triggers sliding expiration internally.
 *
 * @returns The session object or null if none is found or expired.
 */
export async function getSession(): Promise<SessionWithUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_token");
  if (!sessionCookie?.value) return null;

  const session = await getSessionFromToken(sessionCookie.value);

  if (!session) return null;

  // Clean up the session before sending
  const { token, csrfSecret, user, ...sessionRest } = session;
  const { password, ...userRest } = user;

  const cleanedSession = {
    ...sessionRest,
    user: userRest,
  };

  return cleanedSession;
}
