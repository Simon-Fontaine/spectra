"use server";

import prisma from "@/lib/prisma";
import { ActionError, adminActionClient } from "@/lib/safe-action";
import { getSpecialtySchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error updating user substitute status:", error);
      },
    },
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
        message: "User specialty updated successfully.",
      };
    },
    {
      async onSuccess() {
        revalidatePath("/dashboard/admin/user-management");
      },
      async onError({ error }) {
        console.error("Error updating user specialty:", error);
      },
    },
  );
