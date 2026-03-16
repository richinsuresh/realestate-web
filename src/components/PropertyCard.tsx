"use client";

import React from "react";
import NextLink from "next/link";
import {
  Box,
  Text,
  Stack,
  Heading,
  Button,
  AspectRatio,
  Link as ChakraLink,
  HStack,
  VStack, // Added VStack import
} from "@chakra-ui/react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

export type Property = {
  id: string;
  title?: string;
  tagline?: string;
  price?: number | null;
  location?: string | null;
  imageUrl?: string | null;
  images?: string[] | null;
  type?: string | null;      // e.g. Apartment, Villa
  bedrooms?: number | null;  // number of bedrooms
};

type IndividualProps = {
  id?: string;
  title?: string;
  tagline?: string;
  price?: number;
  location?: string;
  imageUrl?: string;
  type?: string;
  bedrooms?: number;
};

type Props = {
  property?: Property;
} & IndividualProps;

// ----------------- HELPERS -----------------

function isAbsoluteOrLocal(s?: string | null) {
  if (!s) return false;
  const t = s.trim();
  if (!t) return false;
  if (t.startsWith("/")) return true; 
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function buildSupabasePublicUrl(keyOrUrl?: string | null) {
  if (!keyOrUrl) return null;
  const trimmed = keyOrUrl.trim();
  if (isAbsoluteOrLocal(trimmed)) return trimmed;

  const bucket = (() => {
    const _b = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
    if (!_b) {
      throw new Error("[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env. Add it to .env.local and restart.");
    }
    return _b;
  })();
  
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!projectUrl) return trimmed;

  let path = trimmed;
  if (trimmed.startsWith(`${bucket}/`)) {
    path = trimmed.slice(bucket.length + 1);
  }

  const normalizedProject = projectUrl.replace(/\/$/, "");
  return `${normalizedProject}/storage/v1/object/public/${bucket}/${encodeURI(path)}`;
}

// ----------------- COMPONENT -----------------

export default function PropertyCard(props: Props) {
  const { property } = props;

  const id = property?.id ?? props.id ?? "";
  const title = property?.title ?? props.title ?? "Untitled property";
  const tagline = property?.tagline ?? props.tagline;
  const price = property?.price ?? props.price;
  const location = property?.location ?? props.location;
  const type = property?.type ?? props.type;
  const bedrooms = property?.bedrooms ?? props.bedrooms;

  const rawImage =
    property?.imageUrl ||
    (Array.isArray(property?.images) && property.images.length > 0
      ? property.images[0]
      : props.imageUrl) ||
    "/placeholder.jpg";

  const imageUrl = buildSupabasePublicUrl(rawImage) ?? "/placeholder.jpg";

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      transition="all 0.2s"
      bg="white"
    >
      {/* Image Section */}
      <AspectRatio ratio={4 / 3}>
        <Box position="relative" width="100%" height="100%" bg="gray.100">
          <ImageWithSkeleton
            src={imageUrl}
            alt={title ?? "Property image"}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            fallbackSrc="/placeholder.jpg"
          />
        </Box>
      </AspectRatio>

      {/* Content Section */}
      <Box p={5}>
        {/* Important: Replaced all 'spacing' with 'gap' for compatibility */}
        <VStack align="stretch" gap={4} flex="1">
          <Stack gap={3}>
            <Heading size="md" noOfLines={2}>
              {title}
            </Heading>

            <Text color="gray.600" fontSize="sm" noOfLines={2}>
              {tagline ?? "No tagline available"}
            </Text>

            <Text fontWeight="bold" fontSize="lg" color="black">
              {typeof price === "number"
                ? `₹${price.toLocaleString("en-IN")}`
                : "Price on request"}
            </Text>

            <Stack gap={1} fontSize="sm" color="gray.600">
              {location && <Text>{location}</Text>}
              <HStack gap={2}>
                {type && <Text>{type}</Text>}
                {bedrooms ? <Text>{bedrooms} BHK</Text> : null}
              </HStack>
            </Stack>

            <NextLink href={`/listings/${id}`} passHref legacyBehavior>
              <ChakraLink width="100%" aria-label={`View ${title}`}>
                <Button colorScheme="teal" width="100%">
                  View
                </Button>
              </ChakraLink>
            </NextLink>
          </Stack>
        </VStack>
      </Box>
    </Box>
  );
}