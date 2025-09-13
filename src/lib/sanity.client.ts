// src/lib/sanity.client.ts
import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "28d9tox0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "development",
  apiVersion: "2025-09-13", // use today's date or keep updated
  useCdn: false, // DEV: false -> always fresh. Set true in production with revalidation.
});
