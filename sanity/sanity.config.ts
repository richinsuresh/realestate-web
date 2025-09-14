// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

// Adjust path to where your schemaTypes actually live.
// From your screenshot they appear under /sanity/schemaTypes
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "arkinfra",
  title: "ARK Infra Studio",

  // Read from env (Vercel / local). These fallbacks keep local dev working.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "28d9tox0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    // When embedding Studio under your Next app, basePath ensures route alignment.
    basePath: "/studio",
  },
});
