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
} from "@chakra-ui/react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

type PropertyCardProps = {
  id: string;
  title: string;
  tagline?: string;
  price?: number;
  location?: string;
  imageUrl?: string;
};

export default function PropertyCard({
  id,
  title,
  tagline,
  price,
  location,
  imageUrl,
}: PropertyCardProps) {
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
      {/* stable aspect area so image is always visible on mobile */}
      <AspectRatio ratio={4 / 3}>
        <Box position="relative" width="100%" height="100%" bg="gray.100">
          <ImageWithSkeleton
            src={imageUrl ?? "/placeholder.jpg"}
            alt={title ?? "Property image"}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            fallbackSrc="/placeholder.jpg"
          />
        </Box>
      </AspectRatio>

      <Box p={5}>
        <Stack spacing={3}>
          <Heading size="md" noOfLines={2}>
            {title}
          </Heading>

          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {tagline ?? "No tagline available"}
          </Text>

          <Text fontWeight="bold" fontSize="md">
            {typeof price === "number" ? `₹${price.toLocaleString("en-IN")}` : "—"}
          </Text>

          {location && (
            <Text color="gray.500" fontSize="sm">
              {location}
            </Text>
          )}

          <NextLink href={`/listings/${id}`} passHref legacyBehavior>
            <ChakraLink width="100%" aria-label={`View ${title}`}>
              <Button colorScheme="teal" width="100%">
                View
              </Button>
            </ChakraLink>
          </NextLink>
        </Stack>
      </Box>
    </Box>
  );
}
