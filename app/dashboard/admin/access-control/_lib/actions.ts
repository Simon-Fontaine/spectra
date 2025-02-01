"use server";

import { z } from "zod";
import { resend } from "@/lib/email/resend";
import { revalidatePath } from "next/cache";
import { getEmailSchema, inviteUserSchema } from "@/lib/zod";
import { ActionError, adminActionClient } from "@/lib/safe-action";
import prisma from "@/lib/prisma";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";

export const handleInviteUser = adminActionClient
  .metadata({ actionName: "handleInviteUser" })
  .schema(inviteUserSchema)
  .action(
    async ({ parsedInput: { email, expiresAt }, ctx }) => {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ActionError(
          "A user with this email address is already registered. Please use a different email address."
        );
      }

      const existingInvite = await prisma.invitation.findUnique({
        where: { email },
      });

      if (existingInvite) {
        throw new ActionError(
          "An invitation was already sent to this email. Please check your inbox or try again later."
        );
      }

      await prisma.invitation.create({
        data: {
          email,
          expiresAt,
          inviterId: ctx.session.user.id,
        },
      });

      await resend.emails.send({
        from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
        to: email,
        subject: `You've been invited to join ${APP_CONFIG_PUBLIC.APP_NAME}`,
        text: `You've been invited to join ${APP_CONFIG_PUBLIC.APP_NAME}. Click on the following link to create your account: ${APP_CONFIG_PUBLIC.APP_URL}/signup`,
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
    }
  );

const revokeInvitationSchema = z.object({
  email: getEmailSchema(),
});

export const handleRevokeInvitation = adminActionClient
  .metadata({
    actionName: "handleRevokeInvitation",
  })
  .schema(revokeInvitationSchema)
  .action(
    async ({ parsedInput: { email } }) => {
      const deletedInvitation = await prisma.invitation.delete({
        where: { email },
      });

      if (!deletedInvitation) {
        throw new ActionError("No invitations found with the provided email.");
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
    }
  );
