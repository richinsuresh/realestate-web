// src/app/page.tsx
import Link from "next/link";
import NextImage from "next/image";
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  Button,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { sanityClient } from "@/lib/sanity.client";

export const revalidate = 60;

const PROPS_QUERY = `*[_type == "property"] | order(_createdAt desc)[0...200]{
  _id,
  title,
  "mainImageUrl": image.asset->url,
  "mainImageAlt": coalesce(image.alt, title, "Property"),
  "images": images[]{
    "src": asset->url,
    "alt": coalesce(alt, ^.title, "Property image"),
    "caption": caption
  }
}`;

type GalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
  href?: string;
  featured?: boolean;
};

type Property = {
  _id: string;
  title?: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  images?: {
    src: string;
    alt?: string;
    caption?: string;
  }[];
};

export default async function Home() {
  let properties: Property[] = [];

  try {
    properties = await sanityClient.fetch<Property[]>(PROPS_QUERY);
  } catch (err) {
    console.error("Sanity fetch error (homepage):", err);
  }

  const PLACEHOLDER = "/placeholder.jpg";

  const galleryItems: GalleryImage[] = [];
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
  }

  const seen = new Set<string>();
  const uniqueGallery = galleryItems
    .filter((it) => {
      const s = it?.src ?? "";
      if (!s) return false;
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .slice(0, 24);

  const galleryToRender = uniqueGallery.length > 0
    ? uniqueGallery
    : [
        { src: "/properties/p1/1.jpg", alt: "Placeholder 1" },
        { src: "/properties/p2/1.jpg", alt: "Placeholder 2" },
      ];

  return (
    <>
      {/* HERO */}
      <Box
        as="header"
        position="relative"
        width="100%"
        height="calc(var(--vh, 1px) * 100)"
        minHeight="640px"
        maxHeight="1000px"
        overflow="hidden"
        sx={{
          backgroundImage: `url('/hero-large.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, rgba(0,0,0,0.78), rgba(0,0,0,0.45))"
          zIndex={1}
        />
        <Container
          maxW="1100px"
          position="relative"
          zIndex={2}
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: 6, md: 8 }}
        >
          <VStack align="center" spacing={{ base: 3, md: 6 }} maxW="900px" textAlign="center" pb={{ base: 6, md: 10 }}>
            {/* Logo bigger */}
            <Box width="100%" display="flex" justifyContent="center">
              <Link href="/" aria-label="Home">
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  style={{ height: "128px", objectFit: "contain" }}
                />
              </Link>
            </Box>

            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
              color="white"
              fontWeight={800}
              lineHeight="1.05"
              letterSpacing="-0.02em"
            >
              Exceptional properties, crafted for living.
            </Heading>

            <Text
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              color="gray.300"
              maxW="72ch"
              fontWeight={500}
            >
              Discover our curated portfolio of premium apartments, villas and commercial spaces — photography-first presentation and international standards.
            </Text>

            {/* Centered buttons */}
            <HStack spacing={4} pt={{ base: 2, md: 4 }} justify="center" flexWrap="wrap">
              <Button size="lg" colorScheme="brand" as="a" href="/listings">
                View Listings
              </Button>
              <Button size="lg" variant="outline" borderColor="gray.600" color="white" as="a" href="/about">
                About
              </Button>
              <Button
                size="lg"
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                as="a"
                href="https://wa.me/91XXXXXXXXXX" // replace with your WhatsApp number
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </Button>
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

        <Container maxW="1100px" paddingLeft={0} paddingRight={0}>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3} px={{ base: 3, md: 0 }}>
            {galleryToRender.map((img, idx) => (
              <Link key={idx} href={img.href ?? "#"} aria-label={img.alt ?? "Property"}>
                <Box position="relative" overflow="hidden" borderRadius="8px" height={{ base: "160px", md: "220px", lg: "260px" }}>
                  <NextImage
                    src={img.src}
                    alt={img.alt ?? "Property"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    style={{ objectFit: "cover" }}
                    priority={idx < 2}
                  />
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
