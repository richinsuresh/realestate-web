"use client";

import { Box, Container, Flex, HStack, Text, Link as ChakraLink, Button } from "@chakra-ui/react";

export default function Footer() {
  const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "ARK Infra Studio";
  const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918891143812").replace(/\D/g, "");
  const WHATSAPP_FOOTER_MSG = "I cannot find a property that I need. Can you help?";
  const WHATSAPP_FOOTER_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_FOOTER_MSG)}`;

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
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </Text>
          {/* Contact links + WhatsApp CTA */}
          <HStack spacing={6} align="center">
            <ChakraLink href="tel:+918891143812" color="white" _hover={{ color: "blue.400" }}>
              +91 88911 43812
            </ChakraLink>

            <ChakraLink href="mailto:info@arkinfras.com" color="white" _hover={{ color: "blue.400" }}>
              info@arkinfras.com
            </ChakraLink>
            <Text color="gray.400" fontSize="sm"> Not seeing your desired property?</Text>

            {/* WhatsApp CTA */}
            <Button
              as="a"
              href={WHATSAPP_FOOTER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              colorScheme="green"
            >
              Chat on WhatsApp
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
