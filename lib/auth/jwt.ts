import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { APP_CONFIG_PRIVATE } from "@/config/config.private";

/**
 * Secret key for signing/verifying JWT tokens (from env).
 * ISSUER and AUDIENCE should also be set via environment variables for better security.
 */
const secretKey = new TextEncoder().encode(APP_CONFIG_PRIVATE.JWT_SECRET);
const JWT_EXPIRATION = "7d";

/**
 * Creates a JWT with a specified payload, using HS256 and a 7-day expiration.
 *
 * @param payload - The JWT payload with additional jti (JWT ID).
 * @returns A signed JWT token as a string.
 */
export async function createJWT(payload: JWTPayload & { jti: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(APP_CONFIG_PRIVATE.JWT_ISSUER)
    .setAudience(APP_CONFIG_PRIVATE.JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secretKey);
}

/**
 * Verifies a JWT, ensuring the correct issuer and audience.
 *
 * @param token - The raw JWT string to verify.
 * @returns The decoded payload, or null if verification fails.
 */
export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: APP_CONFIG_PRIVATE.JWT_ISSUER,
      audience: APP_CONFIG_PRIVATE.JWT_AUDIENCE,
    });
    return payload;
  } catch (err) {
    console.error("JWT verification error", err);
    return null;
  }
}
