// src/theme.ts
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Optional config (for color mode defaults, etc.)
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Extend the default Chakra theme
const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#f5f9ff",
      100: "#e6f0ff",
      500: "#1e6fff",
    },
  },
  fonts: {
    heading:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    body: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
      },
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
});

export default theme;
