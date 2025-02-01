import { NextResponse } from "next/server";
import { VerificationType } from "@prisma/client";
import { markEmailVerified } from "@/lib/auth/user";
import { consumeVerificationToken } from "@/lib/auth/verification";

/**
 * Verifies user email with the given token.
 * GET /api/auth/email/verify?token=xxx
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
      VerificationType.EMAIL_VERIFICATION
    );
    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    await markEmailVerified(verification.userId);

    return NextResponse.redirect(new URL("/sign-in?verified=true", url));
  } catch (err) {
    console.error("EMAIL-VERIFY:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed." },
      { status: 500 }
    );
  }
}
