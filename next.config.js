/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "yoalsjcbliklnmqvbsdy.supabase.co",
      },
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

module.exports = nextConfig;
