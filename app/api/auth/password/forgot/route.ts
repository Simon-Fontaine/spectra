import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { createVerificationToken } from "@/lib/auth/verification";
import { resend } from "@/lib/email/resend";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { cleanIpAddress } from "@/lib/utils/requestDetails";
import { VerificationType } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

/**
 * Rate limit: 3 forgot-password attempts per 60s per IP.
 */
const forgotPasswordRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "60 s"),
  prefix: "forgot_password_rate_limit",
});

/**
 * Sends a password-reset link if the email exists.
 * POST /api/auth/password/forgot
 */
export async function POST(request: Request) {
  try {
    const ip = cleanIpAddress(request.headers.get("x-forwarded-for"));
    const { success } = await forgotPasswordRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many attempts." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond with success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If that email is recognized, a link was sent.",
      });
    }

    const token = await createVerificationToken(
      user.id,
      VerificationType.PASSWORD_RESET,
      1,
    );
    const resetUrl = `${APP_CONFIG_PUBLIC.APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
      to: email,
      subject: "Reset your password",
      text: `Forgot password? Reset here: ${resetUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: "If that email is recognized, a link was sent.",
    });
  } catch (err) {
    console.error("FORGOT-PASSWORD:", err);
    return NextResponse.json(
      { success: false, error: "Request failed." },
      { status: 500 },
    );
  }
}
