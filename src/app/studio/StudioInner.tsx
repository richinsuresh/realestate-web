// src/app/studio/StudioInner.tsx
"use client";

import React from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity/sanity.config";

export default function StudioInner(): React.ReactElement {
  return (
    <div style={{ minHeight: "60vh" }}>
      <NextStudio config={config} />
    </div>
  );
}
