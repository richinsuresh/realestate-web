// ./sanity/sanity.config.ts
// ./sanity/sanity.config.ts — top imports
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes"; // <-- named import (preferred)

// Import the schema module in a defensive way so we avoid "already declared" errors
// whether schemaTypes is a named export, default export, or exported inside an object.
import * as schemaModule from "./schemaTypes";

const schemaTypes =
  // prefer named export 'schemaTypes'
  (schemaModule as any).schemaTypes ??
  // fall back to default export (if any)
  (schemaModule as any).default ??
  // or the module itself (if it directly is an array)
  (schemaModule as any);

export default defineConfig({
  name: "arkinfra",
  title: "ARK Infra Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "28d9tox0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "development",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  studio: {
    basePath: "/studio",
  },
});
