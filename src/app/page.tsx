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
  Image,
} from "@chakra-ui/react";
import ImageGallery from "@/components/ImageGallery";
import { sanityClient } from "@/lib/sanity.client";

export const revalidate = 60;

const QUERY = `*[_type == "property"] | order(_createdAt desc){
  _id,
  title,
  "imageUrl": coalesce(image.asset->url, "/placeholder.jpg")
}`;

export default async function Home() {
  const properties: any[] = await sanityClient.fetch(QUERY);

  // Convert Sanity data into gallery items
  const galleryImages = properties.length > 1
    ? properties.map((p) => ({
        src: p.imageUrl || "/placeholder.jpg",
        alt: p.title,
        caption: p.title,
        href: `/listings/${p._id}`,
      }))
    : // If only one listing, show all its images if multiple
      (properties[0]?.images ?? []).map((img: any, idx: number) => ({
        src: img.asset?.url || "/placeholder.jpg",
        alt: `${properties[0].title} #${idx + 1}`,
        caption: properties[0].title,
        href: `/listings/${properties[0]._id}`,
      }));

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
          <VStack
            align="center"
            spacing={{ base: 3, md: 6 }}
            maxW="900px"
            textAlign="center"
            pb={{ base: 6, md: 10 }}
          >
            <Box width="100%" display="flex" justifyContent="center">
              <Link href="/" aria-label="Home">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  boxSize={{ base: "96px", md: "160px", lg: "300px" }}
                  objectFit="contain"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "92%",
                    maxHeight: "48vh",
                  }}
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
              Discover our curated portfolio of premium apartments, villas and
              commercial spaces — photography-first presentation and
              international standards.
            </Text>

            <HStack spacing={4} pt={{ base: 2, md: 4 }}>
              <Button size="lg" colorScheme="brand" as="a" href="/listings">
                View listings
              </Button>

              <Button
                size="lg"
                variant="outline"
                borderColor="gray.600"
                color="white"
                as="a"
                href="/contact"
              >
                Contact us
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* GALLERY */}
      <Box
        as="section"
        width="100%"
        minHeight="80vh"
        py={{ base: 12, md: 20 }}
        bg="black"
      >
        <Container maxW="1100px" mb={10} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight={800}
            lineHeight={1.05}
            color="white"
            mb={6}
          >
            Handpicked portfolio
          </Heading>

          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.400"
            maxW="60ch"
            marginLeft="auto"
            marginRight="auto"
            fontWeight={500}
            mb={10}
          >
            Photography-first presentation — click any image to view larger. We
            feature a selection of premium properties curated for international
            standards.
          </Text>
        </Container>

        <Box flex="1" display="flex" alignItems="stretch">
          <Container maxW="1100px" px={0}>
            <ImageGallery images={galleryImages} />
          </Container>
        </Box>
      </Box>
    </>
  );
}
