// src/app/listings/[id]/page.tsx
import React from "react";
import NextImage from "next/image";
import {
  AspectRatio,
  Box,
  Heading,
  Text,
  Flex,
  Link as ChakraLink,
  SimpleGrid,
  Button,
  Grid,
  Badge,
  Container,
} from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import NavButton from "@/components/NavButton";

export const revalidate = 60;

function buildMapsUrl(
  coords?: { lat?: number; lng?: number } | null,
  locationStr?: string | null
) {
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

type PropertyRow = {
  id: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  location?: string | null;
  main_image_url?: string | null;
  slug?: string | null;
  coordinates?: { lat?: number; lng?: number } | null;
};

type PropertyImageRow = {
  id: string;
  image_url?: string | null;
  alt?: string | null;
  display_order?: number | null;
};

const PLACEHOLDER = "/placeholder.jpg";

// ✅ FIXED signature: props: any avoids type error
export default async function PropertyPage(props: any) {
  const idParam = props?.params?.id ?? "";
  if (!idParam) {
    return (
      <Box p={8}>
        <Heading>Invalid property</Heading>
        <Text>No property id provided.</Text>
      </Box>
    );
  }

  // --- fetch property ---
  let property: PropertyRow | null = null;
  try {
    const { data: byId } = await supabase
      .from("properties")
      .select(
        "id, title, description, price, location, main_image_url, slug, coordinates"
      )
      .eq("id", idParam)
      .maybeSingle();

    if (byId) property = byId as PropertyRow;
    else {
      const { data: bySlug } = await supabase
        .from("properties")
        .select(
          "id, title, description, price, location, main_image_url, slug, coordinates"
        )
        .eq("slug", idParam)
        .maybeSingle();
      property = (bySlug as PropertyRow) ?? null;
    }
  } catch (err) {
    console.error("Error fetching property:", err);
  }

  if (!property) {
    return (
      <Box p={8}>
        <Heading>Property not found</Heading>
        <Text>
          The property you requested does not exist or may have been removed.
        </Text>
      </Box>
    );
  }

  // --- fetch images ---
  let galleryRaw: PropertyImageRow[] = [];
  try {
    const { data: imagesData } = await supabase
      .from("property_images")
      .select("id, image_url, alt, display_order")
      .eq("property_id", property.id)
      .order("display_order", { ascending: true });

    if (imagesData && imagesData.length > 0)
      galleryRaw = imagesData as PropertyImageRow[];
  } catch (err) {
    console.error("Error fetching images:", err);
  }

  if (galleryRaw.length === 0 && property.main_image_url) {
    galleryRaw = [
      {
        id: "main",
        image_url: property.main_image_url,
        alt: property.title ?? null,
      },
    ];
  }

  const galleryItems = galleryRaw.map((it) => ({
    src: it.image_url ?? PLACEHOLDER,
    alt: it.alt ?? property.title ?? "Property image",
  }));

  const imagesToShow = galleryItems.slice(0, 6);

  const maps = buildMapsUrl(
    property.coordinates ?? null,
    property.location ?? undefined
  );

  const WHATSAPP_NUMBER = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919812345678"
  ).replace(/\D/g, "");
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi — I'm interested in "${property.title ?? "this property"}"${
      property.location ? ` located at ${property.location}` : ""
    }. Please share details.`
  )}`;

  return (
    <>
      <Box px={4} pt={4}>
        <NavButton
          href="/listings"
          variant="outline"
          colorScheme="gray"
          size="md"
        >
          ← Back to Listings
        </NavButton>
      </Box>

      <Container maxW="1400px" px={6} py={8}>
        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} mb={8}>
          {property.title ?? "Untitled property"}
        </Heading>

        {/* ---------- ENLARGED CENTERED GALLERY ---------- */}
        <Flex justify="center" mb={12}>
          <SimpleGrid
            columns={{
              base: 1,
              sm: Math.min(imagesToShow.length, 2),
              md: Math.min(imagesToShow.length, 3),
            }}
            spacing={4}
            width="100%"
            maxW={
              imagesToShow.length === 1
                ? "1000px"
                : imagesToShow.length === 2
                ? "1200px"
                : "1400px"
            }
            justifyItems="center"
          >
            {imagesToShow.slice(0, 3).map((img, idx) => (
              <AspectRatio
                key={idx}
                ratio={4 / 3}
                width="100%"
                borderRadius="16px"
                overflow="hidden"
                boxShadow="xl"
              >
                <NextImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 33vw, 33vw"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  priority={idx < 3}
                />
              </AspectRatio>
            ))}
          </SimpleGrid>
        </Flex>

        {/* ---------- BELOW: description + price card ---------- */}
        <Grid
          templateColumns={{ base: "1fr", md: "2fr 420px" }}
          gap={10}
          alignItems="start"
        >
          <Box>
            <Text
              color="gray.700"
              fontSize="md"
              whiteSpace="pre-line"
              mb={6}
              p={4}
              borderRadius="md"
              bg="gray.50"
            >
              {property.description ?? "No description provided."}
            </Text>

            {property.location && (
              <Badge
                colorScheme="gray"
                variant="subtle"
                px={3}
                py={2}
                borderRadius="md"
                mb={6}
              >
                {property.location}
              </Badge>
            )}

            {/* Map */}
            <Box
              mt={6}
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
                >
                  <iframe
                    title="Property location map"
                    src={maps.embed}
                    style={{ border: 0, width: "100%", height: "100%" }}
                    loading="lazy"
                  />
                </ChakraLink>
              ) : (
                <Flex
                  width="100%"
                  height="100%"
                  align="center"
                  justify="center"
                >
                  <Text color="gray.500">No location available</Text>
                </Flex>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="flex-start" justifyContent="center">
            <Box
              width="100%"
              maxW="380px"
              borderRadius="16px"
              p={6}
              boxShadow="xl"
              border="1px solid"
              borderColor="gray.100"
              bg="white"
            >
              <Text
                fontSize="sm"
                color="gray.500"
                mb={2}
                textAlign="center"
              >
                Prices starting from
              </Text>

              <Text
                fontWeight="extrabold"
                fontSize={{ base: "2xl", md: "3xl" }}
                color="black"
                mb={6}
                textAlign="center"
                letterSpacing="-0.02em"
              >
                {typeof property.price === "number"
                  ? `₹${property.price.toLocaleString("en-IN")}`
                  : "—"}
              </Text>

              <Button
                as="a"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="green"
                width="100%"
                size="lg"
                borderRadius="12px"
                aria-label="Enquire on WhatsApp"
              >
                Enquire
              </Button>
            </Box>
          </Box>
        </Grid>
      </Container>
    </>
  );
}
