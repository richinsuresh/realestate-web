// src/app/about/page.tsx
import React from "react";
import NextImage from "next/image";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Divider,
  Badge,
  Stack,
  Button,
} from "@chakra-ui/react";
import NavButton from "@/components/NavButton";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "ARK Infra";
const COMPANY_TAGLINE = process.env.NEXT_PUBLIC_COMPANY_TAGLINE ?? "Premium real estate";
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+918891143812").replace(/\D/g, "");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  `Hi — I'm interested in learning more about ${COMPANY_NAME}.`
)}`;

const PLACEHOLDER = "/placeholder.jpg";

/**
 * Simple helper: prefer provided URL else fallback to placeholder.
 * Accepts root-relative or absolute urls.
 */
function safeImage(src?: string | null) {
  if (!src) return PLACEHOLDER;
  const s = String(src).trim();
  if (!s) return PLACEHOLDER;
  return s;
}

export default async function AboutPage() {
  // Image files you can place in /public/about/1.jpg etc.
  const images = [
    safeImage("/about/1.jpg"),
    safeImage("/about/2.jpg"),
    safeImage("/about/3.jpg"),
  ];

  const addressLines = [
    "ARK Infra Studio",
    "No. 12, Prestige Chambers",
    "MG Road, Bengaluru, Karnataka",
    "PIN - 560001",
  ];

  return (
    <>
      <Box px={4} pt={4}>
        <NavButton href="/" variant="outline" colorScheme="gray" size="md">
          ← Home
        </NavButton>
      </Box>

      <Container maxW="1100px" px={6} py={10}>
        {/* Header: big logo + name */}
        <Stack direction={{ base: "column", md: "row" }} align="center" spacing={6} mb={8}>
          <Box
            position="relative"
            width={{ base: 160, md: 220 }}
            height={{ base: 80, md: 110 }}
            flexShrink={0}
            borderRadius="md"
            overflow="hidden"
            bg="gray.50"
            boxShadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <NextImage src="/logo.png" alt={`${COMPANY_NAME} logo`} width={340} height={120} style={{ objectFit: "contain" }} priority />
          </Box>

          <VStack align={{ base: "center", md: "flex-start" }} spacing={1}>
            <Heading as="h1" size="xl">{COMPANY_NAME}</Heading>
            <Text color="gray.600" fontSize="md" maxW="60ch" textAlign={{ base: "center", md: "left" }}>
              {COMPANY_TAGLINE}
            </Text>
            <HStack pt={2}>
              <Badge colorScheme="gray" variant="subtle">Established 2024</Badge>
              <Badge colorScheme="green" variant="subtle">Photography-first</Badge>
            </HStack>
          </VStack>
        </Stack>

        <Divider mb={8} />

        {/* Main content: description + images */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
          {/* Left: Description (spans 2 cols on md) */}
          <Box gridColumn={{ base: "auto", md: "span 2" }}>
            <Heading as="h2" size="lg" mb={4}>
              About {COMPANY_NAME}
            </Heading>

            <Text color="gray.700" fontSize="md" mb={4} whiteSpace="pre-line">
              {`At ${COMPANY_NAME}, we specialise in presenting premium residential and commercial properties with an emphasis on photographic storytelling and international standards. Our team of experienced architects, interior stylists and marketing creatives ensure every listing looks its best and reaches the right audience.`}
            </Text>

            <Text color="gray.700" fontSize="md" mb={4}>
              We handle property scouting, professional photography, listing curation and buyer engagement — making the selling and leasing experience seamless for owners and straightforward for buyers.
            </Text>

            <Text color="gray.700" fontSize="md" mb={6}>
              Whether you are looking for a high-end apartment, a well-located villa or a commercial space with pedigree, we guide you through discovery, viewings and negotiations with transparency and local expertise.
            </Text>

            <HStack spacing={4}>
              <Button as="a" href="/listings" colorScheme="brand" size="lg">View Listings</Button>
              <Button as="a" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" colorScheme="green" size="lg">Chat on WhatsApp</Button>
            </HStack>
          </Box>

          {/* Right: image grid */}
          <Box>
            <Heading as="h3" size="md" mb={4}>Our work</Heading>
            <SimpleGrid columns={1} spacing={3}>
              {images.map((src, idx) => (
                <Box key={idx} borderRadius="12px" overflow="hidden" boxShadow="md" height={idx === 0 ? "220px" : "140px"}>
                  <NextImage
                    src={src}
                    alt={`About image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    priority={idx < 2}
                  />
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        {/* Full-width gallery (optional) */}
        <Box mb={10}>
          <Heading as="h3" size="md" mb={4}>Gallery</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} borderRadius="12px" overflow="hidden" height="220px" boxShadow="sm">
                <NextImage
                  src={`/about/${i + 1}.jpg`}
                  alt={`Gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Divider mb={8} />

        {/* Footer-like address + map */}
        <Box display="flex" gap={8} flexDirection={{ base: "column", md: "row" }} alignItems="flex-start">
          <Box flex="1">
            <Heading as="h4" size="sm" mb={3}>Office</Heading>
            <VStack align="start" spacing={0} color="gray.700">
              {addressLines.map((line, idx) => (
                <Text key={idx}>{line}</Text>
              ))}
              <Text mt={2}>Phone: +91 88911 43812</Text>
              <Text>Email: info@arkinfra.com</Text>
            </VStack>
          </Box>

          <Box width={{ base: "100%", md: "420px" }} borderRadius="md" overflow="hidden" boxShadow="sm">
            {/* Small embed to Google Maps for the address; change query if you have exact coordinates */}
            <iframe
              title="Office location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(addressLines.join(", "))}&z=14&output=embed`}
              style={{ border: 0, width: "100%", height: "240px" }}
              loading="lazy"
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}
