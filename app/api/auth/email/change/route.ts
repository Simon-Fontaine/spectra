import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { getSessionFromRawCookie } from "@/lib/auth/session";
import { createVerificationToken } from "@/lib/auth/verification";
import { resend } from "@/lib/email/resend";
import prisma from "@/lib/prisma";
import { VerificationType } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Requests an email change by sending a confirmation link to the new email.
 * POST /api/auth/email/change
 */
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const session = await getSessionFromRawCookie(cookieHeader);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const newEmail = formData.get("newEmail")?.toString();
    if (!newEmail) {
      return NextResponse.json(
        { success: false, error: "Missing newEmail." },
        { status: 400 },
      );
    }

    const foundEmail = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (foundEmail) {
      return NextResponse.json(
        { success: false, error: "Email in use." },
        { status: 400 },
      );
    }

    const token = await createVerificationToken(
      session.userId,
      VerificationType.EMAIL_CHANGE,
      24,
    );

    // Store the newEmail temporarily on the Verification record
    await prisma.verification.update({
      where: { token },
      data: { newEmail },
    });

    const verifyUrl = `${APP_CONFIG_PUBLIC.APP_URL}/api/auth/email/change/confirm?token=${token}`;
    await resend.emails.send({
      from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
      to: newEmail,
      subject: "Confirm new email",
      text: `Click here to confirm: ${verifyUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: "If that email is valid, a link was sent.",
    });
  } catch (err) {
    console.error("EMAIL-CHANGE:", err);
    return NextResponse.json(
      { success: false, error: "Request failed." },
      { status: 500 },
    );
  }
}
