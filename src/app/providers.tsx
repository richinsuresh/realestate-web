// src/app/providers.tsx
"use client";

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

// Minimal Providers — no theme import, no CacheProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
