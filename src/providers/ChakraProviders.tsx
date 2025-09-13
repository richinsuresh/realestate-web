// src/providers/ChakraProviders.tsx
"use client";

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";

/**
 * Chakra v3 provider using `value={system}`.
 * Keeping this a client component (use client).
 */
export default function ChakraProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
