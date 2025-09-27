// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // ✅ Supabase storage bucket
      {
        protocol: "https",
        hostname: "fbnsqlmvfizmahitrzci.supabase.co",
        pathname: "/storage/**",
      },
      // ✅ Optional: keep if you still reference Sanity images
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
