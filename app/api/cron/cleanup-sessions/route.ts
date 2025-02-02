import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (
      request.headers.get("Authorization") !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

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
      { status: 500 },
    );
  }
}
