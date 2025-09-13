// sanity/lib/client.ts
import { createClient } from "next-sanity";

/**
 * Be resilient to how ../env exports values:
 * - some setups export named exports: export const apiVersion = '...'
 * - others export a default object: export default { apiVersion, dataset, projectId }
 * This file will accept both, and fall back to environment variables if needed.
 */

import envModule from "../env";

const apiVersion =
  // prefer named export if present
  (envModule as any).apiVersion ??
  // or default export shape
  (envModule && (envModule as any).default?.apiVersion) ??
  // or runtime env var fallback
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ??
  process.env.SANITY_API_VERSION ??
  "2021-06-07";

const dataset =
  (envModule as any).dataset ??
  (envModule && (envModule as any).default?.dataset) ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_DATASET ??
  "production";

const projectId =
  (envModule as any).projectId ??
  (envModule && (envModule as any).default?.projectId) ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  "";

if (!projectId) {
  // optional: log a warning so you spot missing config during build/runtime
  // eslint-disable-next-line no-console
  console.warn("SANITY: projectId is not set — check your env file or environment variables.");
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
