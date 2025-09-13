"use client";

import dynamic from "next/dynamic";
import React from "react";

// Named fallback component to avoid anonymous-function display-name lint errors
function StudioLoadError(): JSX.Element {
  return <div>Studio failed to load.</div>;
}

const StudioInner = dynamic(
  () => import("./StudioInner"),
  {
    ssr: false,
    // optional small loading fallback while dynamic import resolves
    loading: () => <div>Loading Studio…</div>
  }
);

export default function StudioClientWrapper(props: any): JSX.Element {
  return <StudioInner {...props} />;
}
