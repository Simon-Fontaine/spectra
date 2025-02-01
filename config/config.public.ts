export const APP_CONFIG_PUBLIC = {
  APP_NAME: "Spectra",
  APP_DESCRIPTION:
    "Spectra is a 4.5K Overwatch 2 e-sport team that competes in diverse tournaments and leagues.",
  APP_DOMAIN: "owspectra.com",
  APP_EMAIL: "noreply@owspectra.com",
  APP_HELP_EMAIL: "help@owspectra.com",
  APP_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
  APP_OG_IMAGE: `${
    process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
  }/images/og.png`,
};
