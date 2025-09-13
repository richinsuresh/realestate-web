"use client";

import { Box, Container, Flex, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";

export default function Footer() {
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
            © {new Date().getFullYear()} Your Firm. All rights reserved.
          </Text>

          {/* Contact links */}
          <HStack spacing={6}>
            <ChakraLink href="tel:+919876543210" color="white" _hover={{ color: "blue.400" }}>
              +91 98765 43210
            </ChakraLink>
            <ChakraLink
              href="mailto:info@yourfirm.com"
              color="white"
              _hover={{ color: "blue.400" }}
            >
              info@yourfirm.com
            </ChakraLink>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
