import prismaEdge from "@/lib/dbEdge";
import { sha256Hash, randomHex } from "@/lib/utils/hash";
import { APP_CONFIG_PRIVATE } from "@/lib/config.private";

interface CreateSessionOptions {
  sessionExpiresInMinutes?: number;
}

/**
 * Creates a session in the database for a user.
 * We store only a single random token for the session, plus a CSRF secret.
 * Supports a fixed default expiration (e.g., 15 minutes).
 *
 * @param userId - The ID of the user
 * @param ipAddress - Request IP
 * @param userAgent - Request user agent
 * @param device - Device type
 * @param location - Approx location
 * @param options - sessionExpiresInMinutes override
 */
export async function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string,
  device: string,
  location: string,
  {
    sessionExpiresInMinutes = APP_CONFIG_PRIVATE.SESSION_EXPIRATION_MINUTES,
  }: CreateSessionOptions = {}
): Promise<{
  rawSessionToken: string;
  csrfSecret: string;
}> {
  const rawSessionToken = randomHex(32);
  const hashedSessionToken = await sha256Hash(rawSessionToken);

  const csrfSecret = randomHex(16);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionExpiresInMinutes * 60_000);

  await prismaEdge.session.create({
    data: {
      userId,
      token: hashedSessionToken,
      expiresAt,
      csrfSecret,
      ipAddress,
      userAgent,
      device,
      location,
    },
  });

  return { rawSessionToken, csrfSecret };
}

/**
 * Retrieves a session by its raw token.
 * If it's expired, we delete it and return null.
 * If it's valid, we do "sliding expiration" by extending `expiresAt`.
 *
 * @param rawToken - The raw session token from cookie
 * @returns The session (with user) or null
 */
export async function getSessionFromToken(rawToken: string) {
  const hashedToken = await sha256Hash(rawToken);

  const session = await prismaEdge.session.findUnique({
    where: { token: hashedToken },
    include: { user: true },
  });
  if (!session) return null;

  // Check expiration
  if (session.expiresAt < new Date()) {
    // Session expired, remove from DB
    await prismaEdge.session.delete({ where: { token: hashedToken } });
    return null;
  }

  // Sliding expiration: update expiresAt to now + X minutes
  const newExpires = new Date(
    Date.now() + APP_CONFIG_PRIVATE.SESSION_EXPIRATION_MINUTES * 60_000
  );

  await prismaEdge.session.update({
    where: { id: session.id },
    data: { expiresAt: newExpires },
  });

  return session;
}

/**
 * Helper to parse the "session_token" out of a raw cookie header,
 * then fetch the session from DB. Returns null if missing or invalid.
 */
export async function getSessionFromRawCookie(cookieHeader: string) {
  // For safety, parse out "session_token" from the cookie
  const sessionCookie = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("session_token="));

  if (!sessionCookie) return null;
  const rawToken = sessionCookie.split("=")[1];
  if (!rawToken) return null;

  const session = await getSessionFromToken(rawToken);
  return session;
}

/**
 * Deletes a session by its raw token.
 */
export async function deleteSession(rawToken: string) {
  const hashedToken = await sha256Hash(rawToken);
  await prismaEdge.session.delete({ where: { token: hashedToken } });
}

/**
 * Validates the CSRF token by comparing the client-supplied token
 * against the stored token in the session.
 *
 * @param rawSessionToken - The raw session token
 * @param clientCSRF - The raw CSRF token from client
 * @returns True if valid, false otherwise
 */
export async function validateCSRF(
  rawSessionToken: string,
  clientCSRF: string | null
) {
  if (!rawSessionToken || !clientCSRF) return false;

  const session = await getSessionFromToken(rawSessionToken);
  if (!session) return false;
  if (!session.csrfSecret) return false;

  return session.csrfSecret === clientCSRF;
}
