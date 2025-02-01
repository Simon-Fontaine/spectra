"use client";

import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string(),
  NEXT_PUBLIC_APP_DOMAIN: z.string(),
  NEXT_PUBLIC_APP_EMAIL: z.string().email(),
  NEXT_PUBLIC_APP_HELP_EMAIL: z.string().email(),
  NEXT_PUBLIC_VERCEL_URL: z.string().url().optional(),
});

const parsedPublicEnv = publicEnvSchema.safeParse(process.env);
if (!parsedPublicEnv.success) {
  console.error(
    "❌ Invalid public environment variables",
    parsedPublicEnv.error.format()
  );
  throw new Error("Invalid public environment variables");
}

const publicEnv = parsedPublicEnv.data;

export const APP_CONFIG_PUBLIC = {
  APP_NAME: publicEnv.NEXT_PUBLIC_APP_NAME,
  APP_DESCRIPTION: publicEnv.NEXT_PUBLIC_APP_DESCRIPTION,
  APP_DOMAIN: publicEnv.NEXT_PUBLIC_APP_DOMAIN,
  APP_EMAIL: publicEnv.NEXT_PUBLIC_APP_EMAIL,
  APP_HELP_EMAIL: publicEnv.NEXT_PUBLIC_APP_HELP_EMAIL,
  APP_URL: publicEnv.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
  APP_OG_IMAGE: `${
    publicEnv.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
  }/images/og.png`,
};
