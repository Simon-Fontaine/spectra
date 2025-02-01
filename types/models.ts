import { Session, User } from "@prisma/client";

export interface SessionWithUser extends Session {
  user: User;
}

export interface UserWithSessions extends User {
  sessions: Session[];
}
