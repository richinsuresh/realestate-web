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
import ImageGallery from "@/components/ImageGallery";
import { sanityClient } from "@/lib/sanity.client";

export const revalidate = 60;

const PROPS_QUERY = `*[_type == "property"] | order(_createdAt desc)[0...200]{
  _id,
  title,
  // main image asset url (if available)
  "mainImageUrl": image.asset->url,
  "mainImageAlt": image.alt,
  // gallery images (optional)
  "images": images[]{ "src": asset->url, "alt": alt, "caption": caption }
}`;

export default async function Home() {
  let properties: any[] = [];

  try {
    properties = await sanityClient.fetch(PROPS_QUERY);
  } catch (err) {
    console.error("Sanity fetch error (homepage):", err);
  }

  // For debugging in production: log first few image urls (Vercel build logs / server logs)
  try {
    const debugUrls = properties.slice(0, 5).map((p) => ({
      id: p._id,
      main: p.mainImageUrl ?? null,
      imagesCount: Array.isArray(p.images) ? p.images.length : 0,
    }));
    console.log("DEBUG homepage properties (sample):", JSON.stringify(debugUrls));
  } catch (e) {
    // ignore
  }

  const PLACEHOLDER = "/placeholder.jpg";

  // Build gallery items:
  // - Always include one tile per property: mainImageUrl or placeholder
  // - If only one property exists, append its gallery images after the main tile
  const galleryItems: { src: string; alt?: string; caption?: string; href?: string; featured?: boolean }[] = [];

  if (Array.isArray(properties) && properties.length > 0) {
    for (const prop of properties) {
      const mainSrc = prop?.mainImageUrl ? String(prop.mainImageUrl) : PLACEHOLDER;
      galleryItems.push({
        src: mainSrc,
        alt: prop?.mainImageAlt || prop?.title || "Property",
        caption: prop?.title,
        href: `/listings/${prop._id}`,
      });
    }

    // If exactly one property, append its gallery images (if any)
    if (properties.length === 1) {
      const single = properties[0];
      if (Array.isArray(single.images) && single.images.length > 0) {
        for (const img of single.images) {
          galleryItems.push({
            src: img?.src ?? PLACEHOLDER,
            alt: img?.alt ?? single?.title ?? "Property image",
            caption: img?.caption ?? single?.title,
            href: `/listings/${single._id}`,
          });
        }
      }
    }
  }

  // Dedupe by src and limit
  const seen = new Set<string>();
  const uniqueGallery = galleryItems.filter((it) => {
    const s = it?.src ?? "";
    if (!s) return false;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 24);

  const galleryToRender = uniqueGallery.length > 0 ? uniqueGallery : [
    { src: "/properties/p1/1.jpg", alt: "Placeholder 1" },
    { src: "/properties/p2/1.jpg", alt: "Placeholder 2" },
  ];

  return (
    <>
      {/* HERO (unchanged visuals) */}
      <Box as="header" position="relative" width="100%" height="calc(var(--vh, 1px) * 100)" minHeight="640px" maxHeight="1000px" overflow="hidden"
        sx={{ backgroundImage: `url('/hero-large.jpg')`, backgroundSize: "cover", backgroundPosition: "center" }}>
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

      {/* GALLERY */}
      <Box as="section" width="100%" minHeight="80vh" py={{ base: 12, md: 20 }} bg="black">
        <Container maxW="1100px" mb={10} textAlign="center">
          <Heading as="h2" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight={800} lineHeight={1.05} color="white" mb={6}>
            Handpicked portfolio
          </Heading>

          <Text fontSize={{ base: "sm", md: "md" }} color="gray.400" maxW="60ch" marginLeft="auto" marginRight="auto" fontWeight={500} mb={10}>
            Photography-first presentation — click any image to view larger.
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
