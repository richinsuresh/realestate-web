// src/app/page.tsx
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Button,
  VStack,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { sanityClient } from "@/lib/sanity.client";
import ImageGallery from "@/components/ImageGallery";

export const revalidate = 60;

const PROPS_QUERY = `*[_type == "property"] | order(_createdAt desc)[0...200]{
  _id,
  title,
  "mainImage": image{ asset->{url}, alt },
  "images": images[]{ "src": asset->url, "caption": caption, "alt": alt }
}`;

export default async function Home() {
  let properties: any[] = [];

  try {
    properties = await sanityClient.fetch(PROPS_QUERY);
  } catch (err) {
    console.error("Sanity fetch error (homepage):", err);
  }

  // Build gallery items:
  // - For every property, include one tile (mainImage if present else placeholder), with href -> /listings/[id]
  // - If there's only one property, also append all its gallery images after the main tile (still href -> property)
  const galleryItems: { src: string; alt?: string; caption?: string; href?: string; featured?: boolean }[] = [];

  const PLACEHOLDER = "/placeholder.jpg";

  if (Array.isArray(properties) && properties.length > 0) {
    // Always add one tile per property
    for (const prop of properties) {
      const mainSrc = prop?.mainImage?.asset?.url ?? PLACEHOLDER;
      galleryItems.push({
        src: mainSrc,
        alt: prop?.mainImage?.alt || prop?.title || "Property image",
        caption: prop?.title,
        href: `/listings/${prop._id}`,
      });
    }

    // If exactly one property, append its gallery images (or placeholder if image missing)
    if (properties.length === 1) {
      const single = properties[0];
      if (Array.isArray(single.images) && single.images.length > 0) {
        for (const img of single.images) {
          galleryItems.push({
            src: img?.src ?? PLACEHOLDER,
            alt: img?.alt || single?.title || "Property image",
            caption: img?.caption || single?.title,
            href: `/listings/${single._id}`,
          });
        }
      }
    }
  }

  // Deduplicate by src (so we don't show exact duplicates) and limit to a reasonable count
  const seen = new Set<string>();
  const uniqueGallery = galleryItems.filter((it) => {
    const s = it?.src ?? "";
    if (!s) return false;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 24); // adjust limit if you want more tiles

  // If nothing from Sanity (very unlikely), fallback to static assets (no hrefs)
  const FALLBACK_IMAGES = [
    { src: "/properties/p1/1.jpg", alt: "Skyline 2BHK Apartment" },
    { src: "/properties/p2/1.jpg", alt: "Seaside Luxury Villa" },
    { src: "/properties/p3/1.jpg", alt: "Urban Studio" },
    { src: "/properties/p4/1.jpg", alt: "Business Park Office" },
    { src: "/properties/p5/1.jpg", alt: "Green Meadows 3BHK" },
    { src: "/properties/p6/1.jpg", alt: "Penthouse Royale" },
  ];

  const galleryToRender = uniqueGallery.length > 0 ? uniqueGallery : FALLBACK_IMAGES;

  return (
    <>
      {/* HERO */}
      <Box
        as="header"
        position="relative"
        width="100%"
        height="100vh"
        minHeight="640px"
        maxHeight="1000px"
        overflow="hidden"
        bgImage="url('/hero-large.jpg')"
        bgSize="cover"
        bgPos="center"
      >
        <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(0,0,0,0.78), rgba(0,0,0,0.45))" zIndex={1} />

        <Container maxW="1100px" position="relative" zIndex={2} height="100%" display="flex" alignItems="center" justifyContent="center" px={{ base: 6, md: 8 }}>
          <VStack align="center" spacing={{ base: 3, md: 6 }} maxW="900px" textAlign="center" pb={{ base: 6, md: 10 }}>
            <Box width="100%" display="flex" justifyContent="center">
              <Link href="/" aria-label="Home">
                <ChakraImage src="/logo.png" alt="Company Logo" boxSize={{ base: "96px", md: "160px", lg: "300px" }} objectFit="contain" />
              </Link>
            </Box>

            <Heading as="h1" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} color="white" fontWeight={800} lineHeight="1.05" letterSpacing="-0.02em">
              Exceptional properties, crafted for living.
            </Heading>

            <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.300" maxW="72ch" fontWeight={500}>
              Discover our curated portfolio of premium apartments, villas and commercial spaces — photography-first presentation and international standards.
            </Text>

            <HStack spacing={4} pt={{ base: 2, md: 4 }}>
              <Button size="lg" colorScheme="brand" as="a" href="/listings">View listings</Button>
              <Button size="lg" variant="outline" borderColor="gray.600" color="white" as="a" href="/contact">Contact us</Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* GALLERY / FEATURED */}
      <Box as="section" width="100%" minHeight="80vh" py={{ base: 12, md: 20 }} bg="black">
        <Container maxW="1100px" mb={10} textAlign="center">
          <Heading as="h2" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight={800} lineHeight={1.05} color="white" mb={6}>
            Handpicked portfolio
          </Heading>

          <Text fontSize={{ base: "sm", md: "md" }} color="gray.400" maxW="60ch" marginLeft="auto" marginRight="auto" fontWeight={500} mb={10}>
            Photography-first presentation — click any image to view larger. We feature a selection of premium properties curated for international standards.
          </Text>
        </Container>

        <Box flex="1" display="flex" alignItems="stretch">
          <Container maxW="1100px" paddingLeft={0} paddingRight={0}>
            <ImageGallery images={galleryToRender} featuredFirst priorityCount={2} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
