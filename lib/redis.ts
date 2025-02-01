import { Redis } from "@upstash/redis";

/**
 * A Redis client instance configured via Upstash and environment variables.
 */
export const redis = Redis.fromEnv();
