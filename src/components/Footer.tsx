// src/components/Footer.tsx
"use client";

import { Box, Container, Flex, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";

export default function Footer() {
  const openCallback = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.dispatchEvent(new CustomEvent("openCallbackDialog"));
  };

  return (
    <Box as="footer" bg="black" borderTopWidth="1px" borderColor="gray.700" py={8}>
      <Container maxW="1100px">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={6}
        >
          {/* Company info */}
          <Text color="gray.400" fontSize="sm">
            © {new Date().getFullYear()} ARK Infra Studio. All rights reserved.
          </Text>

          {/* Contact links + CTA text */}
          <HStack spacing={6} align="center">
            <ChakraLink href="tel:+919876543210" color="white" _hover={{ color: "blue.400" }}>
              +91 98765 43210
            </ChakraLink>

            <ChakraLink href="mailto:info@arkinfra.com" color="white" _hover={{ color: "blue.400" }}>
              info@arkinfra.com
            </ChakraLink>

            {/* Single sentence with clickable call-to-action link */}
            <Text color="gray.300" fontSize="sm">
              Not seeing your desired property?{" "}
              <ChakraLink as="button" onClick={openCallback} color="white" fontWeight="bold" ml={2}>
                Book a callback now
              </ChakraLink>
            </Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
