// src/app/listings/[id]/page.tsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { sanityClient } from "@/lib/sanity.client";
import ImageGallery from "@/components/ImageGallery";
import NavButton from "@/components/NavButton";

export const revalidate = 60;

const query = `*[_type == "property" && _id == $id][0]{
  _id,
  title,
  description,
  price,
  location,
  "mainImage": image{ asset->{url}, alt },
  "images": images[]{ "src": asset->url, "caption": caption, "alt": alt },
  coordinates
}`;

function buildMapsUrl(coords?: { lat?: number; lng?: number } | null, locationStr?: string) {
  if (coords && coords.lat !== undefined && coords.lng !== undefined) {
    const lat = encodeURIComponent(String(coords.lat));
    const lng = encodeURIComponent(String(coords.lng));
    return {
      embed: `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`,
      link: `https://www.google.com/maps?q=${lat},${lng}&z=15`,
    };
  }

  if (locationStr && locationStr.trim().length > 0) {
    const q = encodeURIComponent(locationStr);
    return {
      embed: `https://www.google.com/maps?q=${q}&z=13&output=embed`,
      link: `https://www.google.com/maps?q=${q}&z=13`,
    };
  }

  return null;
}

export default async function PropertyPage(props: any) {
  const params = props?.params as { id?: string } | undefined;
  const id = params?.id ?? "";
  let property: any = null;

  try {
    property = await sanityClient.fetch(query, { id });
    console.log("DEBUG property (details):", id, property);
  } catch (err) {
    console.error("Sanity fetch error:", err);
  }

  if (!property) {
    return (
      <Box p={8}>
        <Heading>Property not found</Heading>
        <Text>The property you requested does not exist or may have been removed.</Text>
      </Box>
    );
  }

  const galleryItems: { src: string; alt?: string; caption?: string }[] = [];
  if (property.mainImage?.asset?.url) {
    galleryItems.push({
      src: property.mainImage.asset.url,
      alt: property.mainImage.alt || property.title || "Property image",
    });
  }
  if (Array.isArray(property.images) && property.images.length > 0) {
    property.images.forEach((it: any) => {
      if (it?.src) {
        galleryItems.push({
          src: it.src,
          alt: it.alt || property.title || "",
          caption: it.caption || "",
        });
      }
    });
  }

  const maps = buildMapsUrl(property.coordinates, property.location);

  return (
    <>
      {/* Back */}
      <Box px={4} pt={4}>
        <NavButton href="/listings" variant="outline" colorScheme="gray" size="md">
          ← Back to Listings
        </NavButton>
      </Box>

      <Box maxW="6xl" mx="auto" px={4} py={6}>
        <Stack spacing={6}>
          <Heading>{property.title ?? "Untitled property"}</Heading>

          {/* Gallery */}
          {galleryItems.length > 0 ? (
            <ImageGallery images={galleryItems as any} />
          ) : (
            <Box borderRadius="md" overflow="hidden" width="100%" height="420px" bg="gray.100" />
          )}

          {/* MOBILE: Price + Enquire in a card */}
          <Box
            display={{ base: "block", md: "none" }}
            mt={4}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p={5}
          >
            <Stack spacing={3} align="center" width="100%">
              <Text fontSize="sm" color="gray.500">
                Prices starting from
              </Text>
              <Text fontWeight="extrabold" fontSize="2xl" color="black">
                {typeof property.price === "number"
                  ? `₹${property.price.toLocaleString("en-IN")}`
                  : "—"}
              </Text>
              <NavButton
                href={`/contact?subject=${encodeURIComponent(
                  property.title ?? "Property enquiry"
                )}`}
                variant="solid"
                colorScheme="teal"
                size="lg"
                width="100%"
              >
                Enquire
              </NavButton>
            </Stack>
          </Box>

          {/* Main content */}
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={6}>
            {/* LEFT */}
            <Box flex="1" minW={0}>
              <Text color="gray.700" fontSize="md" whiteSpace="pre-line" mb={3}>
                {property.description ?? "No description provided."}
              </Text>

              {property.location && (
                <Text
                  display="inline-block"
                  bg="gray.100"
                  color="gray.800"
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight="600"
                  boxShadow="sm"
                  mb={3}
                >
                  {property.location}
                </Text>
              )}

              {/* Map */}
              <Box
                mt={4}
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                width="100%"
                height={{ base: "220px", md: "320px" }}
              >
                {maps ? (
                  <ChakraLink
                    href={maps.link}
                    isExternal
                    display="block"
                    width="100%"
                    height="100%"
                    _hover={{ textDecoration: "none" }}
                  >
                    <iframe
                      title="Property location map"
                      src={maps.embed}
                      style={{ border: 0, width: "100%", height: "100%" }}
                      loading="lazy"
                    />
                  </ChakraLink>
                ) : (
                  <Box
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">No location available</Text>
                  </Box>
                )}
              </Box>
            </Box>

            {/* RIGHT */}
            <Box
              width={{ base: "100%", md: "300px" }}
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-start"
            >
              <Stack spacing={4} align="flex-end" width="100%">
                <Box
                  textAlign="right"
                  width="100%"
                  display={{ base: "none", md: "block" }}
                >
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Prices starting from
                  </Text>
                  <Text fontWeight="extrabold" fontSize="3xl" color="black">
                    {typeof property.price === "number"
                      ? `₹${property.price.toLocaleString("en-IN")}`
                      : "—"}
                  </Text>
                </Box>

                <Box
                  width="100%"
                  display={{ base: "none", md: "flex" }}
                  justifyContent="flex-end"
                >
                  <NavButton
                    href={`/contact?subject=${encodeURIComponent(
                      property.title ?? "Property enquiry"
                    )}`}
                    variant="solid"
                    colorScheme="teal"
                    size="lg"
                    width="100%"
                  >
                    Enquire
                  </NavButton>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </>
  );
}
