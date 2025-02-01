import { z } from "zod";
import {
  createMiddleware,
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { getSession } from "./auth/get-session";
import { Role } from "@prisma/client";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) return e.message;

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({ actionName: z.string() });
  },
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  return result;
});

export const adminMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await getSession();
  if (!session) throw new ActionError("Please sign in to continue.");
  if (!session.user.roles.includes(Role.ADMIN))
    throw new ActionError(
      "You do not have the required permissions to perform this action."
    );

  return next({ ctx: { session } });
});

export const adminOrSelfMiddleware = createMiddleware().define(
  async ({ next, clientInput }) => {
    const { userId } = clientInput as { userId: string };
    if (!userId)
      throw new ActionError("'userId' parameter is missing in the request.");

    const session = await getSession();
    if (!session) throw new ActionError("Please sign in to continue.");

    if (session.user.roles.includes(Role.ADMIN) || session.user.id === userId)
      return next({ ctx: { session } });

    throw new ActionError(
      "You do not have the required permissions to perform this action."
    );
  }
);

export const adminActionClient = actionClient.use(adminMiddleware);
export const adminOrSelfActionClient = actionClient.use(adminOrSelfMiddleware);
