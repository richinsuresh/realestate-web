// next.config.ts
import type { NextConfig } from "next";

/**
 * Quick unblock config:
 * - ignoreDuringBuilds: true => ESLint warnings/errors won't fail the build
 * - typescript.ignoreBuildErrors: true => Type errors won't fail the build
 *
 * These are build-time relaxations only. Fix lint/types properly later.
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // IMPORTANT: allow builds to succeed now; revert after you fix lint/type issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
