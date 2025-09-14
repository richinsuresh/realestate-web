// src/providers/ChakraProviders.tsx
"use client";

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

export default function ChakraProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
