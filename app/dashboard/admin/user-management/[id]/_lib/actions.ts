"use server";

import {
  getEmailSchema,
  getDisplayNameSchema,
  getUsernameSchema,
} from "@/lib/zod";
import { z } from "zod";
import prismaEdge from "@/lib/dbEdge";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/email/resend";
import { APP_CONFIG_PUBLIC } from "@/lib/config.public";
import { ActionError, adminActionClient } from "@/lib/safe-action";

const updateUserNameSchema = z.object({
  userId: z.string(),
  displayName: getDisplayNameSchema(),
});

export const handleUserNameUpdate = adminActionClient
  .metadata({ actionName: "handleUserNameUpdate" })
  .schema(updateUserNameSchema)
  .action(
    async ({ parsedInput: { userId, displayName } }) => {
      const existingUser = await prismaEdge.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prismaEdge.user.update({
        where: { id: userId },
        data: { displayName },
      });

      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: existingUser.email,
        subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was updated by an admin`,
        text: `Your account display name was updated by an admin. Your new display name is: ${displayName}`,
      });

      return {
        success: true,
        message: `User name updated successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user name:", error);
      },
    }
  );

const updateUserUsernameSchema = z.object({
  userId: z.string(),
  username: getUsernameSchema(),
});

export const handleUserUsernameUpdate = adminActionClient
  .metadata({ actionName: "handleUserUsernameUpdate" })
  .schema(updateUserUsernameSchema)
  .action(
    async ({ parsedInput: { userId, username } }) => {
      const existingUser = await prismaEdge.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const exitingUsernameUser = await prismaEdge.user.findFirst({
        where: { username },
      });

      if (exitingUsernameUser) {
        throw new ActionError("User username already exists.");
      }

      await prismaEdge.user.update({
        where: { id: userId },
        data: { username },
      });

      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: existingUser.email,
        subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was updated by an admin`,
        text: `Your account username was updated by an admin. Your new username is: ${username}`,
      });

      return {
        success: true,
        message: `User username updated successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user name:", error);
      },
    }
  );

const updateUserEmailSchema = z.object({
  userId: z.string(),
  email: getEmailSchema(),
});

export const handleUserEmailUpdate = adminActionClient
  .metadata({ actionName: "handleUserEmailUpdate" })
  .schema(updateUserEmailSchema)
  .action(
    async ({ parsedInput: { userId, email } }) => {
      const existingUser = await prismaEdge.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const exitingEmailUser = await prismaEdge.user.findFirst({
        where: { email },
      });

      if (exitingEmailUser) {
        throw new ActionError("User email already exists.");
      }

      await prismaEdge.user.update({
        where: { id: userId },
        data: { email },
      });

      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: existingUser.email,
        subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was updated by an admin`,
        text: `Your account email was updated by an admin. Your new email is: ${email}`,
      });

      return {
        success: true,
        message: `User email updated successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user email:", error);
      },
    }
  );

const revokeUserSessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

export const handleRevokeSession = adminActionClient
  .metadata({ actionName: "handleDeleteUserSession" })
  .schema(revokeUserSessionSchema)
  .action(
    async ({ parsedInput: { userId, sessionId } }) => {
      const existingUser = await prismaEdge.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prismaEdge.session.delete({
        where: { id: sessionId },
      });

      return {
        success: true,
        message: `User session revoked successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error revoking user session:", error);
      },
    }
  );

const bulkRevokeUserSessionsSchema = z.object({
  userId: z.string(),
  sessionIds: z.array(z.string()),
});

export const handleBulkRevokeSessions = adminActionClient
  .metadata({ actionName: "handleDeleteAllUserSessions" })
  .schema(bulkRevokeUserSessionsSchema)
  .action(
    async ({ parsedInput: { userId, sessionIds } }) => {
      const existingUser = await prismaEdge.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const { count } = await prismaEdge.session.deleteMany({
        where: {
          id: {
            in: sessionIds,
          },
        },
      });

      return {
        success: true,
        message: `${count} user sessions revoked successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error revoking user sessions:", error);
      },
    }
  );
