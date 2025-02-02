import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import { createSession } from "@/lib/auth/session";
import { verifyUser } from "@/lib/auth/user";
import { redis } from "@/lib/redis";
import {
  cleanIpAddress,
  cleanUserAgent,
  getDeviceType,
  getLocationFromIp,
} from "@/lib/utils/requestDetails";
import { signInSchema } from "@/lib/zod";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

/**
 * Rate limit: 5 login attempts per 60s per IP.
 */
const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "login_rate_limit",
});

/**
 * Logs in a user, sets session & CSRF cookies.
 * POST /api/auth/login
 */
export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = cleanIpAddress(request.headers.get("x-forwarded-for"));
    const { success } = await loginRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many attempts." },
        { status: 429 },
      );
    }

    // Parse form data
    const formData = await request.formData();
    const parsed = signInSchema.safeParse({
      usernameOrEmail: formData.get("usernameOrEmail"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message },
        { status: 400 },
      );
    }

    // Verify credentials
    const { usernameOrEmail, password } = parsed.data;
    const user = await verifyUser(usernameOrEmail, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 },
      );
    }
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Email not verified. Check your inbox.",
        },
        { status: 401 },
      );
    }

    // Gather request details
    const ua = cleanUserAgent(request.headers.get("user-agent"));
    const device = getDeviceType(ua);
    const geo = await getLocationFromIp(ip);
    const location = `${geo.city}, ${geo.subdivision}, ${geo.country}`;

    // Create session
    const { rawSessionToken, csrfSecret } = await createSession(
      user.id,
      ip,
      ua,
      device,
      location,
      {
        sessionExpiresInMinutes: APP_CONFIG_PRIVATE.SESSION_EXPIRATION_MINUTES,
      },
    );

    // Prepare response
    const res = NextResponse.json({ success: true });

    // Set cookies
    res.cookies.set("session_token", rawSessionToken, {
      httpOnly: true,
      secure: APP_CONFIG_PRIVATE.APP_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * APP_CONFIG_PRIVATE.SESSION_EXPIRATION_MINUTES,
      domain: APP_CONFIG_PRIVATE.APP_PROD
        ? APP_CONFIG_PUBLIC.APP_DOMAIN
        : undefined,
    });

    res.cookies.set("csrf_token", csrfSecret, {
      httpOnly: false,
      secure: APP_CONFIG_PRIVATE.APP_PROD,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * APP_CONFIG_PRIVATE.CSRF_EXPIRATION_MINUTES,
      domain: APP_CONFIG_PRIVATE.APP_PROD
        ? APP_CONFIG_PUBLIC.APP_DOMAIN
        : undefined,
    });

    return res;
  } catch (err) {
    console.error("LOGIN:", err);
    return NextResponse.json(
      { success: false, error: "Login failed." },
      { status: 500 },
    );
  }
}
