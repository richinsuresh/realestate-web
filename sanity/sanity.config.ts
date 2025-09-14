// ./sanity/sanity.config.ts
import { defineConfig } from "sanity";
// Use normal imports — we'll cast to any below to avoid cross-package type mismatch
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const config = {
  name: "arkinfra",
  title: "ARK Infra Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "28d9tox0",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  // cast plugins to `any` to avoid cross-package @sanity/types incompatibilities
  plugins: [deskTool() as any, visionTool() as any] as any,

  schema: {
    types: schemaTypes,
  },

  studio: {
    basePath: "/studio",
  },
}

// Cast the whole config to `any` when passing to defineConfig to avoid type errors
export default defineConfig(config as any);
