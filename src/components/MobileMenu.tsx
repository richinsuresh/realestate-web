// src/components/MobileMenu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconButton,
  Box,
  VStack,
  Button,
  HStack,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaBars, FaTimes } from "react-icons/fa";

/**
 * MobileMenu: lightweight off-canvas (client).
 * - Hamburger icon is white (for dark navbar).
 * - Close icon is dark (for white panel).
 */
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      // focus close button after opening
      setTimeout(() => closeButtonRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger (white icon for dark navbar) */}
      <IconButton
        aria-label="Open menu"
        icon={<FaBars />}
        onClick={() => setIsOpen(true)}
        size="md"
        variant="ghost"
        color="white"            // make the icon white
        _hover={{ bg: "rgba(255,255,255,0.06)" }}
        _active={{ bg: "rgba(255,255,255,0.08)" }}
      />

      {/* Backdrop */}
      <Box
        as="div"
        pointerEvents={isOpen ? "auto" : "none"}
        aria-hidden={!isOpen}
        style={{
          transition: "opacity 220ms ease",
          opacity: isOpen ? 1 : 0,
          position: "fixed",
          inset: 0,
          zIndex: isOpen ? 50 : -1,
          background: "rgba(0,0,0,0.35)",
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Off-canvas panel */}
      <Box
        as="aside"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "85vw",
          maxWidth: 360,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(.2,.9,.25,1)",
          zIndex: 60,
          background: "white",
          boxShadow: "0 10px 30px rgba(8,12,20,0.12)",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        <HStack justify="space-between" align="center">
          <VisuallyHidden as="span">Mobile menu</VisuallyHidden>
          <Box fontWeight="bold">Menu</Box>

          {/* Close (dark icon for white panel) */}
          <IconButton
            aria-label="Close menu"
            icon={<FaTimes />}
            onClick={() => setIsOpen(false)}
            ref={closeButtonRef}
            variant="ghost"
            color="gray.800"     // dark icon inside white panel
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
          />
        </HStack>

        <VStack align="stretch" spacing={4} mt={6}>
          <Link href="/listings" onClick={() => setIsOpen(false)} style={{ padding: "10px 0", color: "inherit" }}>
            Listings
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} style={{ padding: "10px 0", color: "inherit" }}>
            About
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} style={{ padding: "10px 0", color: "inherit" }}>
            Contact
          </Link>

          <Box pt={4}>
            <Button
              colorScheme="brand"
              onClick={() => {
                setIsOpen(false);
                // navigation happens via the Link below
              }}
              width="100%"
            >
              <Link href="/contact" style={{ display: "block", width: "100%", textDecoration: "none", color: "inherit" }}>
                Book Now
              </Link>
            </Button>
          </Box>
        </VStack>

        <Box marginTop="auto" pt={6} fontSize="sm" color="gray">
          <Link href="/privacy" onClick={() => setIsOpen(false)} style={{ display: "block", padding: "8px 0", color: "inherit" }}>
            Privacy
          </Link>
        </Box>
      </Box>
    </>
  );
}
