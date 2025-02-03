import { updateUserPassword } from "@/lib/auth/user";
import { consumeVerificationToken } from "@/lib/auth/verification";
import { NextResponse } from "next/server";

/**
 * Resets the user's password if token is valid.
 * POST /api/auth/password/reset
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = formData.get("token")?.toString();
    const newPassword = formData.get("newPassword")?.toString();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Missing fields." },
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

    await updateUserPassword(verification.userId, newPassword);

    return NextResponse.json({ success: true, message: "Password updated." });
  } catch (err) {
    console.error("RESET-PASSWORD:", err);
    return NextResponse.json(
      { success: false, error: "Reset failed." },
      { status: 500 },
    );
  }
}
