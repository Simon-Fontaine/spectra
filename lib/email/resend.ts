import { APP_CONFIG_PRIVATE } from "@/config/config.private";
import { Resend } from "resend";

/**
 * Resend client instance for sending transactional emails.
 * `RESEND_API_KEY` must be provided in the environment variables.
 */
export const resend = new Resend(APP_CONFIG_PRIVATE.RESEND_API_KEY);
