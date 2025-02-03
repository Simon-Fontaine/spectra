import { markEmailVerified } from "@/lib/auth/user";
import { consumeVerificationToken } from "@/lib/auth/verification";
import prisma from "@/lib/prisma";
import { VerificationType } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Confirms a verification token.
 * GET /api/auth/confirm
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token." },
        { status: 400 },
      );
    }

    const verification = await consumeVerificationToken(token);
    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 400 },
      );
    }

    switch (verification.type) {
      case VerificationType.ACCOUNT_DELETION: {
        await prisma.user.delete({ where: { id: verification.userId } });
        return NextResponse.redirect(
          new URL("/sign-in?accountDeleted=true", url),
        );
      }
      case VerificationType.EMAIL_VERIFICATION: {
        await markEmailVerified(verification.userId);
        return NextResponse.redirect(new URL("/sign-in?verified=true", url));
      }
      case VerificationType.EMAIL_CHANGE: {
        const user = await prisma.user.findUnique({
          where: { id: verification.userId },
        });

        if (!user) {
          return NextResponse.json(
            { success: false, error: "User not found." },
            { status: 404 },
          );
        }

        if (!user.pendingEmail) {
          return NextResponse.json(
            { success: false, error: "No pending email found." },
            { status: 400 },
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            email: user.pendingEmail,
            pendingEmail: null,
          },
        });

        return NextResponse.redirect(
          new URL("/dashboard/settings/general?emailUpdated=true", url),
        );
      }
      default:
        return NextResponse.json(
          { success: false, error: "Invalid verification type." },
          { status: 400 },
        );
    }
  } catch (err) {
    console.error("VERIFICATION-CONFIRM:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed." },
      { status: 500 },
    );
  }
}
