"use client";

import React from "react";
import Link from "next/link";
import { Box, Flex, HStack, Button, Image } from "@chakra-ui/react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919812345678").replace(/\D/g, "");
  const WHATSAPP_HOME_MSG = "Hello, I'm interested in some properties. Can you assist me?";
  const WHATSAPP_HOME_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_HOME_MSG)}`;

  return (
    <Box
      as="nav"
      bg="black"
      borderBottomWidth="1px"
      borderColor="gray.700"
      px={{ base: 4, md: 8 }}
      py={3}
      position="sticky"
      top={0}
      zIndex={50}
    >
      <Flex maxW="1100px" mx="auto" align="center" justify="space-between">
        {/* Logo → home link */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.png" alt="Your Firm Logo" height="40px" width="auto" mr={2} />
        </Link>

        {/* Desktop nav */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link href="/listings" style={{ color: "white" }}>Listings</Link>
          <Link href="/about" style={{ color: "white" }}>About</Link>
          <Link href="/contact" style={{ color: "white" }}>Contact</Link>
        </HStack>

        <HStack spacing={3}>
          {/* Chat on WhatsApp - header CTA (home message) */}
          <Button
            as="a"
            href={WHATSAPP_HOME_LINK}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="green"
            size="sm"
          >
            Chat on WhatsApp
          </Button>

          {/* Mobile menu */}
          <Box display={{ base: "inline-flex", md: "none" }}>
            <MobileMenu />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
}
