import { Session, User } from "@prisma/client";

export type CleanSession = Omit<Session, "token" | "csrfSecret">;
export type CleanUser = Omit<User, "password">;

export interface SessionWithUser extends CleanSession {
  user: CleanUser;
}

export interface UserWithSessions extends CleanUser {
  sessions: CleanSession[];
}
