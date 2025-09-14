// sanity.config.ts  (location: ./sanity.config.ts)
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

// adjust this path if your schemaTypes live somewhere else. Based on your screenshot:
// schemaTypes are in the "sanity" folder at repo root -> ./sanity/schemaTypes
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "arkinfra",
  title: "ARK Infra Studio",

  // Read values from env vars so Vercel/local are consistent.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "28d9tox0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    // Keep Studio routes aligned when embedding under Next at /studio
    basePath: "/studio",
  },
});
