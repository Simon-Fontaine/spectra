import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.count} expired sessions.`,
    });
  } catch (error) {
    console.error("CRON CLEANUP ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clean up sessions" },
      { status: 500 }
    );
  }
}
