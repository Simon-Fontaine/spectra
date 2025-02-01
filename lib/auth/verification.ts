import { VerificationType } from "@prisma/client";
import { randomHex } from "@/lib/utils/hash";
import prisma from "@/lib/prisma";

/**
 * Creates a verification token for a user with a specified type (e.g., email verification).
 * The token expires after `expiresInHours`.
 *
 * @param userId - The ID of the user.
 * @param type - The type of verification (e.g., EMAIL_VERIFICATION).
 * @param expiresInHours - Expiration time in hours.
 * @returns The newly created token as a string.
 */
export async function createVerificationToken(
  userId: string,
  type: VerificationType,
  expiresInHours = 24
) {
  const token = randomHex(32);
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  await prisma.verification.create({
    data: {
      userId,
      token,
      type,
      expiresAt,
    },
  });

  return token;
}

/**
 * Consumes a verification token by marking it as used.
 * Returns the verification record or null if invalid/expired.
 *
 * @param token - The verification token.
 * @param type - The verification type for validation.
 */
export async function consumeVerificationToken(
  token: string,
  type: VerificationType
) {
  const verification = await prisma.verification.findFirst({
    where: {
      token,
      type,
      usedAt: null,
      expiresAt: { gte: new Date() },
    },
  });

  if (!verification) return null;

  // Mark token as used
  await prisma.verification.update({
    where: { id: verification.id },
    data: { usedAt: new Date() },
  });

  return verification;
}
