import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/lookbook',
        destination: '/influencers',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
