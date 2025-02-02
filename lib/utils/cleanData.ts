import type {
  CleanSession,
  CleanUser,
  SessionWithUser,
  UserWithSessions,
} from "@/types/models";
import type { Session, User } from "@prisma/client";

/**
 * Returns a "clean" version of the user by removing sensitive fields.
 *
 * @param user - The user object from the database.
 * @returns The user object without the password.
 */
export function cleanUser(user: User): CleanUser {
  const { password, ...cleanedUser } = user;
  return cleanedUser;
}

/**
 * Returns a "clean" version of the session by removing sensitive fields.
 *
 * @param session - The session object from the database.
 * @returns The session object without token and csrfSecret.
 */
export function cleanSession(session: Session): CleanSession {
  const { token, csrfSecret, ...cleanedSession } = session;
  return cleanedSession;
}

/**
 * Cleans a session and its associated user.
 *
 * @param session - The session object that includes a user.
 * @returns The session with the user cleaned.
 */
export function cleanSessionWithUser(
  session: Session & { user: User },
): SessionWithUser {
  return {
    ...cleanSession(session),
    user: cleanUser(session.user),
  };
}

/**
 * Cleans a user and all its associated sessions.
 *
 * @param user - The user object that includes sessions.
 * @returns The user object with each session cleaned.
 */
export function cleanUserWithSessions(
  user: User & { sessions: Session[] },
): UserWithSessions {
  return {
    ...cleanUser(user),
    sessions: user.sessions.map(cleanSession),
  };
}
