"use server";

import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { resend } from "@/lib/email/resend";
import prisma from "@/lib/prisma";
import { ActionError, adminOrSelfActionClient } from "@/lib/safe-action";
import {
  getDisplayNameSchema,
  getEmailSchema,
  getUsernameSchema,
} from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

/**
 * ---------------------------------------------------------------------------
 * 1. Update Display Name Action
 * ---------------------------------------------------------------------------
 */
const updateUserDisplayNameSchema = z.object({
  userId: z.string(),
  displayName: getDisplayNameSchema(),
});

export const handleUserDisplayNameUpdate = adminOrSelfActionClient
  .metadata({ actionName: "handleUserNameUpdate" })
  .schema(updateUserDisplayNameSchema)
  .action(
    async ({ parsedInput: { userId, displayName }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prisma.user.update({
        where: { id: userId },
        data: { displayName },
      });

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        await resend.emails.send({
          from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
          to: existingUser.email,
          subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was updated by an admin`,
          text: `Your account display name was updated by an admin. Your new display name is: ${displayName}`,
        });
        return {
          success: true,
          message: "User display name updated successfully.",
        };
      }
      return {
        success: true,
        message: "Your display name has been updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user display name:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 2. Update Username Action
 * ---------------------------------------------------------------------------
 */
const updateUserUsernameSchema = z.object({
  userId: z.string(),
  username: getUsernameSchema(),
});

export const handleUserUsernameUpdate = adminOrSelfActionClient
  .metadata({ actionName: "handleUserUsernameUpdate" })
  .schema(updateUserUsernameSchema)
  .action(
    async ({ parsedInput: { userId, username }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const existingUsernameUser = await prisma.user.findFirst({
        where: { username },
      });
      if (existingUsernameUser) {
        throw new ActionError("User username already exists.");
      }

      await prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        await resend.emails.send({
          from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
          to: existingUser.email,
          subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was updated by an admin`,
          text: `Your account username was updated by an admin. Your new username is: ${username}`,
        });
        return {
          success: true,
          message: "User username updated successfully.",
        };
      }
      return {
        success: true,
        message: "Your username has been updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user username:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 3. Update Email Action
 * ---------------------------------------------------------------------------
 */
const updateUserEmailSchema = z.object({
  userId: z.string(),
  email: getEmailSchema(),
});

export const handleUserEmailUpdate = adminOrSelfActionClient
  .metadata({ actionName: "handleUserEmailUpdate" })
  .schema(updateUserEmailSchema)
  .action(
    async ({ parsedInput: { userId, email }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        const existingEmailUser = await prisma.user.findFirst({
          where: { email },
        });
        if (existingEmailUser) {
          throw new ActionError("User email already exists.");
        }

        await prisma.user.update({
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
          message: "User email updated successfully.",
        };
      }

      const formData = new FormData();
      formData.append("newEmail", email);

      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();

      const response = await fetch(
        `${APP_CONFIG_PUBLIC.APP_URL}/api/auth/email/change`,
        {
          method: "POST",
          headers: {
            cookie: cookieHeader,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new ActionError("Failed to send email verification.");
      }

      return {
        success: true,
        message: "If that email is valid, a link was sent.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user email:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 4. Revoke a Single Session Action
 * ---------------------------------------------------------------------------
 */
const revokeUserSessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
});

export const handleRevokeSession = adminOrSelfActionClient
  .metadata({ actionName: "handleDeleteUserSession" })
  .schema(revokeUserSessionSchema)
  .action(
    async ({ parsedInput: { userId, sessionId }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prisma.session.delete({
        where: { id: sessionId },
      });

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        await resend.emails.send({
          from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
          to: existingUser.email,
          subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} session was revoked by an admin`,
          text: "A session on your account was revoked by an admin.",
        });
        return {
          success: true,
          message: "User session revoked successfully.",
        };
      }
      return {
        success: true,
        message: "Your session has been revoked successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error revoking user session:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 5. Bulk Revoke Sessions Action
 * ---------------------------------------------------------------------------
 */
const bulkRevokeUserSessionsSchema = z.object({
  userId: z.string(),
  sessionIds: z.array(z.string()),
});

export const handleBulkRevokeSessions = adminOrSelfActionClient
  .metadata({ actionName: "handleDeleteAllUserSessions" })
  .schema(bulkRevokeUserSessionsSchema)
  .action(
    async ({ parsedInput: { userId, sessionIds }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const { count } = await prisma.session.deleteMany({
        where: {
          id: { in: sessionIds },
        },
      });

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        await resend.emails.send({
          from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
          to: existingUser.email,
          subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} sessions were revoked by an admin`,
          text: `${count} session(s) on your account were revoked by an admin.`,
        });
        return {
          success: true,
          message: `${count} user sessions revoked successfully.`,
        };
      }
      return {
        success: true,
        message: "Your sessions have been revoked successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error revoking user sessions:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 6. Delete User Action
 * ---------------------------------------------------------------------------
 */
const deleteUserSchema = z.object({
  userId: z.string(),
});

export const handleDeleteUser = adminOrSelfActionClient
  .metadata({ actionName: "handleDeleteUser" })
  .schema(deleteUserSchema)
  .action(
    async ({ parsedInput: { userId }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      if (!deletedUser) {
        throw new ActionError("No users deleted with the provided ID.");
      }

      const isAdminAction = ctx.session.user.id !== userId;
      if (isAdminAction) {
        await resend.emails.send({
          from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
          to: deletedUser.email,
          subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was deleted by an admin`,
          text: "Your account was deleted by an admin.",
        });
        return {
          success: true,
          message: "User deleted successfully.",
        };
      }

      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: deletedUser.email,
        subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was deleted`,
        text: "Your account was deleted.",
      });

      return {
        success: true,
        message: "Your account has been deleted successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error deleting user:", error);
      },
    },
  );
