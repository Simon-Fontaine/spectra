import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { Redis } from "@upstash/redis";

/**
 * A Redis client instance configured via Upstash and environment variables.
 */
export const redis = new Redis({
  url: APP_CONFIG_PRIVATE.KV_URL,
  token: APP_CONFIG_PRIVATE.KV_REST_API_TOKEN,
});
