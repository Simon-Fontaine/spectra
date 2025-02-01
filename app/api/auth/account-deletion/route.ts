import { NextResponse } from "next/server";
import { resend } from "@/lib/email/resend";
import { VerificationType } from "@prisma/client";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { getSessionFromRawCookie } from "@/lib/auth/session";
import { createVerificationToken } from "@/lib/auth/verification";

/**
 * Sends a confirmation email for account deletion.
 * POST /api/auth/account-deletion
 */
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const session = await getSessionFromRawCookie(cookieHeader);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const token = await createVerificationToken(
      session.userId,
      VerificationType.ACCOUNT_DELETION,
      24
    );

    const confirmUrl = `${APP_CONFIG_PUBLIC.APP_URL}/api/auth/account-deletion/confirm?token=${token}`;
    await resend.emails.send({
      from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
      to: session.user.email,
      subject: "Confirm Account Deletion",
      text: `Delete your account? Confirm here: ${confirmUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: "Check your inbox to confirm deletion.",
    });
  } catch (err) {
    console.error("ACCOUNT-DELETION:", err);
    return NextResponse.json(
      { success: false, error: "Request failed." },
      { status: 500 }
    );
  }
}
