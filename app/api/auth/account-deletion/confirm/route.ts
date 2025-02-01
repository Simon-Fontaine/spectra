import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { VerificationType } from "@prisma/client";
import { consumeVerificationToken } from "@/lib/auth/verification";

/**
 * Confirms account deletion.
 * GET /api/auth/account-deletion/confirm?token=xxx
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token." },
        { status: 400 }
      );
    }

    const verification = await consumeVerificationToken(
      token,
      VerificationType.ACCOUNT_DELETION
    );
    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: verification.userId } });
    return NextResponse.redirect(new URL("/sign-in?accountDeleted=true", url));
  } catch (err) {
    console.error("ACCOUNT-DELETION-CONFIRM:", err);
    return NextResponse.json(
      { success: false, error: "Deletion failed." },
      { status: 500 }
    );
  }
}
