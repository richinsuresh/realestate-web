// src/providers/theme.ts
import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(
  {
    ...defaultConfig,
    initialColorMode: "light",  // start light
    useSystemColorMode: false,  // can set true if you want auto based on OS
  },
  {
    theme: {
      tokens: {
        fonts: {
          heading: { value: "Helvetica, Arial, sans-serif" },
          body: { value: "Helvetica, Arial, sans-serif" },
        },
        fontWeights: {
          normal: { value: "400" },
          medium: { value: "500" },
          semibold: { value: "600" },
          bold: { value: "700" },
          extrabold: { value: "800" },
        },
        semanticTokens: {
          colors: {
            bg: {
              default: "{colors.white}",     // light mode
              _dark: "{colors.gray.900}",    // dark mode
            },
            fg: {
              default: "{colors.gray.900}",
              _dark: "{colors.gray.50}",
            },
            muted: {
              default: "{colors.gray.600}",
              _dark: "{colors.gray.400}",
            },
            brand: {
              default: "{colors.blue.600}",
              _dark: "{colors.blue.400}",
            },
          },
        },
      },
    },
  }
);
