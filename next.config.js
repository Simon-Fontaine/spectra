/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "yoalsjcbliklnmqvbsdy.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
