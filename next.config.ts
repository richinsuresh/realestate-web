// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    // ✅ Allow Sanity CDN images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**", // allow all images from Sanity CDN
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
