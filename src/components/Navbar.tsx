// src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Box, Flex, HStack, Button, Image } from "@chakra-ui/react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const openCallback = (e?: React.MouseEvent) => {
    e?.preventDefault();
    window.dispatchEvent(new CustomEvent("openCallbackDialog"));
  };

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
          {/* CTA: open modal instead of navigating */}
          <Button
            onClick={openCallback}
            colorScheme="brand"
            size="sm"
            _hover={{ bg: "blue.500" }}
          >
            Book for a callback
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
