// src/app/studio/[[...tool]]/page.tsx
import React from "react";
import StudioClientWrapper from "../StudioClient";

export default function StudioPage() {
  // This is a server component by default. We render the client wrapper which loads the Sanity Studio on the client.
  return (
    <main>
      <h1 style={{ display: "none" }}>Studio</h1>
      <StudioClientWrapper />
    </main>
  );
}
