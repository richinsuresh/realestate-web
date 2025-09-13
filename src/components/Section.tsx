// src/components/Section.tsx
import React from "react";
import { Box } from "@chakra-ui/react";

/**
 * Section - server component wrapper to standardize vertical spacing.
 * size: 'tight' | 'normal' | 'hero'
 */
export default function Section({
  children,
  size = "normal",
  as = "section",
  className,
}: {
  children: React.ReactNode;
  size?: "tight" | "normal" | "hero";
  as?: any;
  className?: string;
}) {
  // map size to token values (space tokens from the theme)
  const py =
    size === "hero" ? { base: "space.8", md: "space.10" } :
    size === "tight" ? { base: "space.4", md: "space.6" } :
    { base: "space.6", md: "space.8" }; // normal

  return (
    <Box as={as} py={py} className={className}>
      <div className="container">{children}</div>
    </Box>
  );
}
