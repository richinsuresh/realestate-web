// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // recommended for catching issues

  images: {
    // Allow Sanity's image CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },

  experimental: {
    // if you're using Next 13+ appDir (which you are)
    appDir: true,
  },
};

module.exports = nextConfig;
