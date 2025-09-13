// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "ARK Infra Studio",

  projectId: "28d9tox0", // 👈 replace with your Sanity projectId
  dataset: "development",        // 👈 or "development" if you prefer

  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
