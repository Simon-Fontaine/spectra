import { z } from "zod";

const privateEnvSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  PULSE_API_KEY: z.string(),
  KV_REST_API_TOKEN: z.string(),
  KV_REST_API_URL: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
  RESEND_API_KEY: z.string(),
  MAXMIND_CLIENT_ID: z.string(),
  MAXMIND_LICENSE_KEY: z.string(),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
  JWT_AUDIENCE: z.string(),
  SESSION_EXPIRATION_MINUTES: z.string().transform((val) => Number(val)),
  CSRF_EXPIRATION_MINUTES: z.string().transform((val) => Number(val)),
  REGISTRATION_ENABLED: z.string().transform((val) => val === "true"),
  REGISTRATION_INVITE_ONLY: z.string().transform((val) => val === "true"),
});

const parsedPrivateEnv = privateEnvSchema.safeParse(process.env);
if (!parsedPrivateEnv.success) {
  console.error(
    "❌ Invalid private environment variables",
    parsedPrivateEnv.error.format(),
  );
  throw new Error("Invalid private environment variables");
}

const privateEnv = parsedPrivateEnv.data;

export const APP_CONFIG_PRIVATE = {
  APP_PROD: privateEnv.NODE_ENV === "production",
  DATABASE_URL: privateEnv.DATABASE_URL,
  PULSE_API_KEY: privateEnv.PULSE_API_KEY,
  KV_REST_API_TOKEN: privateEnv.KV_REST_API_TOKEN,
  KV_REST_API_URL: privateEnv.KV_REST_API_URL,
  BLOB_READ_WRITE_TOKEN: privateEnv.BLOB_READ_WRITE_TOKEN,
  RESEND_API_KEY: privateEnv.RESEND_API_KEY,
  MAXMIND_CLIENT_ID: privateEnv.MAXMIND_CLIENT_ID,
  MAXMIND_LICENSE_KEY: privateEnv.MAXMIND_LICENSE_KEY,
  JWT_SECRET: privateEnv.JWT_SECRET,
  JWT_ISSUER: privateEnv.JWT_ISSUER,
  JWT_AUDIENCE: privateEnv.JWT_AUDIENCE,
  SESSION_EXPIRATION_MINUTES: privateEnv.SESSION_EXPIRATION_MINUTES,
  CSRF_EXPIRATION_MINUTES: privateEnv.CSRF_EXPIRATION_MINUTES,
  REGISTRATION_ENABLED: privateEnv.REGISTRATION_ENABLED,
  REGISTRATION_INVITE_ONLY: privateEnv.REGISTRATION_INVITE_ONLY,
};
