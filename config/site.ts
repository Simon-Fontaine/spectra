export const siteConfig = {
  name: "Spectra",
  url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000",
  description:
    "Spectra is a 4.5K Overwatch 2 e-sport team that competes in diverse tournaments and leagues.",
};

export type SiteConfig = typeof siteConfig;
