"use server";

import prisma from "@/lib/prisma";
import { resend } from "@/lib/email/resend";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { ActionError, adminActionClient } from "@/lib/safe-action";
import { getRoleSchema, getSpecialtySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: getRoleSchema(),
});

export const handleUpdateUserRole = adminActionClient
  .metadata({ actionName: "handleUpdateUserRole" })
  .schema(updateUserRoleSchema)
  .action(
    async ({ parsedInput: { userId, role }, ctx }) => {
      if (ctx.session.user.id === userId) {
        throw new ActionError("You cannot update your own role.");
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      const existingRoles = existingUser.roles;
      const newRoles = existingRoles.includes(role)
        ? existingRoles.filter((r) => r !== role)
        : [...existingRoles, role];

      await prisma.user.update({
        where: { id: userId },
        data: { roles: newRoles },
      });

      return {
        success: true,
        message: `User role updated successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error updating user role:", error);
      },
    }
  );

const updateUserSpecialtySchema = z.object({
  userId: z.string(),
  specialty: getSpecialtySchema(),
});

export const handleUpdateUserSpecialty = adminActionClient
  .metadata({ actionName: "handleUpdateUserSpecialty" })
  .schema(updateUserSpecialtySchema)
  .action(
    async ({ parsedInput: { userId, specialty } }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prisma.user.update({
        where: { id: userId },
        data: { specialty },
      });

      return {
        success: true,
        message: `User specialty updated successfully.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error updating user specialty:", error);
      },
    }
  );

const deleteUserSchema = z.object({
  userId: z.string(),
});

export const handleDeleteUser = adminActionClient
  .metadata({ actionName: "handleDeleteUser" })
  .schema(deleteUserSchema)
  .action(
    async ({ parsedInput: { userId }, ctx }) => {
      if (ctx.session.user.id === userId) {
        throw new ActionError(
          "You cannot delete your own account. Please contact another administrator if needed."
        );
      }

      const deletedUser = await prisma.user.delete({
        where: { id: userId },
      });

      if (!deletedUser) {
        throw new ActionError("No users found with the provided ID.");
      }

      resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: deletedUser.email,
        subject: `Your ${APP_CONFIG_PUBLIC.APP_NAME} account was deleted by an admin`,
        text: `Your account was deleted by an admin. If you believe this was a mistake, please contact support at ${APP_CONFIG_PUBLIC.APP_HELP_EMAIL}.`,
      });

      return {
        success: true,
        message: "The user has been deleted successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error deleting user:", error);
      },
    }
  );
