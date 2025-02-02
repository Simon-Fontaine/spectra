import { consumeVerificationToken } from "@/lib/auth/verification";
import prisma from "@/lib/prisma";
import { VerificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided." },
        { status: 400 },
      );
    }

    const verification = await consumeVerificationToken(
      token,
      VerificationType.EMAIL_CHANGE,
    );
    if (!verification) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 400 },
      );
    }

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
  } catch (err) {
    console.error("EMAIL-CHANGE-CONFIRM:", err);
    return NextResponse.json(
      { success: false, error: "Confirmation failed." },
      { status: 500 },
    );
  }
}
