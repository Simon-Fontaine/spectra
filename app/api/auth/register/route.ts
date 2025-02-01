import { NextResponse } from "next/server";
import { resend } from "@/lib/email/resend";
import { apiSignUpSchema } from "@/lib/zod";
import { VerificationType } from "@prisma/client";
import { APP_CONFIG_PUBLIC } from "@/lib/config.public";
import { APP_CONFIG_PRIVATE } from "@/lib/config.private";
import { consumeInvitation, registerUser } from "@/lib/auth/user";
import { createVerificationToken } from "@/lib/auth/verification";

/**
 * Registers a new user & sends email verification.
 * POST /api/auth/register
 */
export async function POST(request: Request) {
  try {
    if (!APP_CONFIG_PRIVATE.REGISTRATION_ENABLED) {
      return NextResponse.json(
        { success: false, error: "Registration are currently disabled." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const parsed = apiSignUpSchema.safeParse({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      displayName: formData.get("displayName") || undefined,
      avatarUrl: formData.get("avatarUrl") || undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message },
        { status: 400 }
      );
    }

    const { username, email, password, displayName, avatarUrl } = parsed.data;

    if (APP_CONFIG_PRIVATE.REGISTRATION_INVITE_ONLY) {
      if (!(await consumeInvitation(email)))
        return NextResponse.json(
          { success: false, error: "Registration is invite-only." },
          { status: 403 }
        );
    }

    const newUser = await registerUser({
      username,
      email,
      password,
      displayName,
      avatarUrl,
    });

    // Create email verification token
    const token = await createVerificationToken(
      newUser.id,
      VerificationType.EMAIL_VERIFICATION,
      24
    );
    const verifyUrl = `${APP_CONFIG_PUBLIC.APP_URL}/api/auth/email/verify?token=${token}`;

    // Send verification email
    await resend.emails.send({
      from: `${APP_CONFIG_PUBLIC.APP_NAME} <${APP_CONFIG_PUBLIC.APP_EMAIL}>`,
      to: email,
      subject: "Verify your email",
      text: `Thanks for registering, ${username}! Verify here: ${verifyUrl}`,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. Check your email.",
    });
  } catch (err) {
    console.error("REGISTER:", err);
    const message = err instanceof Error ? err.message : "Registration failed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
