import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/lookbook',
        destination: '/influencers',
        permanent: true,
      },
      // Apparel is shown as "Tops" in the shop menu.
      {
        source: '/shop/apparel',
        destination: '/shop/tops',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
