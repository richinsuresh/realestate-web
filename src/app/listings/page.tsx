// src/app/listings/page.tsx
import React from "react";
import { Container, Heading, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { sanityClient } from "@/lib/sanity.client";
import PropertyCard from "@/components/PropertyCard";

export const revalidate = 60;

const QUERY = `*[_type == "property"] | order(_createdAt desc){
  _id,
  title,
  tagline,
  price,
  location,
  // ensure a valid imageUrl is always provided (fallback to local placeholder)
  "imageUrl": coalesce(image.asset->url, "/placeholder.jpg")
}`;

export default async function ListingsPage() {
  let properties: any[] = [];

  try {
    properties = await sanityClient.fetch(QUERY);
  } catch (err) {
    // server-side logging helps debug fetch errors
    // eslint-disable-next-line no-console
    console.error("Sanity fetch error (listings):", err);
  }

  return (
    <Container maxW="1100px" py={{ base: 8, md: 12 }}>
      <Heading mb={6}>Listings</Heading>

      {(!properties || properties.length === 0) ? (
        <Box py={12} textAlign="center" bg="white" borderRadius="md" boxShadow="sm">
          <Text fontSize="lg" color="gray.600">No listings found yet. Add properties in Sanity to populate this page.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {properties.map((prop) => (
            <PropertyCard
              key={prop._id}
              id={prop._id}
              title={prop.title}
              tagline={prop.tagline}
              price={prop.price}
              location={prop.location}
              imageUrl={prop.imageUrl}
            />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
