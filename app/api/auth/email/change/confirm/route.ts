import { consumeVerificationToken } from "@/lib/auth/verification";
import prisma from "@/lib/prisma";
import { VerificationType } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Confirms the user's new email.
 * GET /api/auth/email/change/confirm?token=xxx
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

    const verification = await consumeVerificationToken(
      token,
      VerificationType.EMAIL_CHANGE,
    );
    if (!verification || !verification.newEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: verification.userId },
      data: { email: verification.newEmail },
    });

    return NextResponse.redirect(
      new URL("/dashboard/settings/general?emailUpdated=true", url),
    );
  } catch (err) {
    console.error("EMAIL-CHANGE-CONFIRM:", err);
    return NextResponse.json(
      { success: false, error: "Confirmation failed." },
      { status: 500 },
    );
  }
}
