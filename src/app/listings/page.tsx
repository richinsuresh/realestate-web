// src/app/listings/page.tsx
import React from "react";
import { Container, Heading, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";

export const revalidate = 60;

type PropertyRow = {
  id: string;
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  price?: number | null;
  location?: string | null;
  main_image_url?: string | null;
  created_at?: string | null;
  slug?: string | null;
  property_images?: {
    id: string;
    image_url: string;
    alt?: string | null;
    display_order?: number | null;
  }[];
};

const PLACEHOLDER = "/placeholder.jpg";

function safeImage(src?: string | null) {
  if (!src) return PLACEHOLDER;
  const s = String(src).trim();
  if (!s || s === "null" || s === "undefined") return PLACEHOLDER;
  return s;
}

export default async function ListingsPage() {
  let properties: PropertyRow[] = [];

  try {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        tagline,
        description,
        price,
        location,
        main_image_url,
        created_at,
        slug,
        property_images (
          id,
          image_url,
          alt,
          display_order
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Supabase fetch error (listings):", error.message);
    } else if (data) {
      properties = data as PropertyRow[];
    }
  } catch (err) {
    console.error("Unexpected error fetching properties:", err);
  }

  return (
    <Container maxW="1100px" py={{ base: 8, md: 12 }}>
      <Heading mb={6}>Listings</Heading>

      {(!properties || properties.length === 0) ? (
        <Box
          py={12}
          textAlign="center"
          bg="white"
          borderRadius="md"
          boxShadow="sm"
        >
          <Text fontSize="lg" color="gray.600">
            No listings found yet. Add properties via the admin panel to
            populate this page.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {properties.map((prop) => {
            // pick the first image from property_images, or fallback
            const firstImage =
              prop.property_images && prop.property_images.length > 0
                ? prop.property_images[0].image_url
                : prop.main_image_url;

            return (
              <PropertyCard
                key={prop.id}
                id={prop.slug ?? prop.id}
                title={prop.title ?? "Untitled property"}
                tagline={prop.tagline ?? prop.description ?? ""}
                price={prop.price ?? undefined}
                location={prop.location ?? undefined}
                imageUrl={safeImage(firstImage)}
              />
            );
          })}
        </SimpleGrid>
      )}
    </Container>
  );
}
