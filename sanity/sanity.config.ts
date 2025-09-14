// ./sanity/sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

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
