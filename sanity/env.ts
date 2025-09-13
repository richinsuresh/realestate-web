// sanity/env.ts

/**
 * Centralized environment settings for Sanity Studio + API client.
 * 
 * Values are loaded from env vars where possible, so you can set:
 *  - SANITY_STUDIO_PROJECT_ID   (for Studio build/deploy)
 *  - SANITY_STUDIO_DATASET
 *  - SANITY_PROJECT_ID          (for client-side fetching in Next.js)
 *  - SANITY_DATASET
 */
const env = {
  // Project ID (e.g. "abcd1234")
  SANITY_PROJECT_ID:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    "28d9tox0", // 🔑 replace with your actual ID if no env

  // Dataset name (default: "production")
  SANITY_DATASET:
    process.env.SANITY_STUDIO_DATASET ||
    process.env.SANITY_DATASET ||
    "production",

  // API version — use a fixed date for stability
  SANITY_API_VERSION: process.env.SANITY_API_VERSION || "2025-01-01",
};

export default env;
