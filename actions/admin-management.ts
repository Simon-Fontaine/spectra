"use server";

import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import SpectraAdminInvitationEmail from "@/lib/email/admin-user-invitation";
import { resend } from "@/lib/email/resend";
import prisma from "@/lib/prisma";
import { ActionError, adminActionClient } from "@/lib/safe-action";
import { formatDate } from "@/lib/utils";
import {
  getEmailSchema,
  getRoleSchema,
  getSpecialtySchema,
  inviteUserSchema,
} from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * ---------------------------------------------------------------------------
 * 1. Update User Role
 * ---------------------------------------------------------------------------
 */
const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: getRoleSchema(),
});

export const handleUpdateUserRole = adminActionClient
  .metadata({ actionName: "handleUpdateUserRole" })
  .schema(updateUserRoleSchema)
  .action(
    async ({ parsedInput: { userId, role } }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      // Toggle the role: remove it if already present, otherwise add it.
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
        message: "User role updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user role:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 2. Update User Substitute Status
 * ---------------------------------------------------------------------------
 */
const updateUserSubstituteSchema = z.object({
  userId: z.string(),
  isSubstitute: z.boolean(),
});

export const handleUpdateUserSubstitute = adminActionClient
  .metadata({ actionName: "handleUpdateUserSubstitute" })
  .schema(updateUserSubstituteSchema)
  .action(
    async ({ parsedInput: { userId, isSubstitute } }) => {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new ActionError("No user found with the provided ID.");
      }

      await prisma.user.update({
        where: { id: userId },
        data: { isSubstitute },
      });

      return {
        success: true,
        message: "User substitute status updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user substitute status:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 3. Update User Specialty
 * ---------------------------------------------------------------------------
 */
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
        message: "User specialty updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard");
      },
      async onError({ error }) {
        console.error("Error updating user specialty:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 4. Invite User
 * ---------------------------------------------------------------------------
 */
export const handleInviteUser = adminActionClient
  .metadata({ actionName: "handleInviteUser" })
  .schema(inviteUserSchema)
  .action(
    async ({ parsedInput: { email, expiresAt }, ctx }) => {
      // Check if a user with the provided email already exists.
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new ActionError(
          "A user with this email address is already registered. Please use a different email address.",
        );
      }

      // Check if an invitation has already been sent.
      const existingInvite = await prisma.invitation.findUnique({
        where: { email },
      });
      if (existingInvite) {
        throw new ActionError(
          "An invitation was already sent to this email. Please check your inbox or try again later.",
        );
      }

      // Create the invitation.
      await prisma.invitation.create({
        data: {
          email,
          expiresAt,
          inviterId: ctx.session.user.id,
        },
      });

      // Send the invitation email.
      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: email,
        subject: `You've been invited to join ${APP_CONFIG_PUBLIC.APP_NAME}`,
        react: SpectraAdminInvitationEmail({
          invitedEmail: email,
          adminEmail: ctx.session.user.email,
          inviteLink: `${APP_CONFIG_PUBLIC.APP_URL}/sign-up`,
          expirationDate: formatDate(expiresAt, {
            hour: "numeric",
            minute: "numeric",
          }),
        }),
      });

      return {
        success: true,
        message: `Invitation sent successfully to ${email}.`,
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/access-control");
      },
      async onError({ error }) {
        console.error("Error inviting user:", error);
      },
    },
  );

/**
 * ---------------------------------------------------------------------------
 * 5. Revoke Invitation
 * ---------------------------------------------------------------------------
 */
const revokeInvitationSchema = z.object({
  email: getEmailSchema(),
});

export const handleRevokeInvitation = adminActionClient
  .metadata({ actionName: "handleRevokeInvitation" })
  .schema(revokeInvitationSchema)
  .action(
    async ({ parsedInput: { email } }) => {
      const deletedInvitation = await prisma.invitation.delete({
        where: { email },
      });

      if (!deletedInvitation) {
        throw new ActionError("No invitation found with the provided email.");
      }

      return {
        success: true,
        message: "The invitation has been revoked successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/access-control");
      },
      async onError({ error }) {
        console.error("Error revoking invitation:", error);
      },
    },
  );
