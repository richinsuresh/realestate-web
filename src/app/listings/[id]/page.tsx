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
import Link from "next/link";
import NextImage from "next/image";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import ImageGallery from "@/components/ImageGallery";
import NavButton from "@/components/NavButton";

export const revalidate = 60;

function buildMapsUrl(
  coords?: { lat?: number; lng?: number } | null,
  locationStr?: string
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
  caption?: string | null;
  display_order?: number | null;
};

// ---- config (strict) ----
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
if (!BUCKET) {
  throw new Error(
    "[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env. Add it to .env.local and restart."
  );
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const serverSupabase =
  SERVICE_ROLE && SUPABASE_URL
    ? createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
    : null;

const PLACEHOLDER = "/placeholder.jpg";

function isEmptyVal(s?: string | null) {
  return !s || s.trim() === "" || s.trim() === "null" || s.trim() === "undefined";
}

function looksLikeAbsoluteUrl(s?: string | null) {
  if (isEmptyVal(s)) return false;
  try {
    const u = new URL(s!.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeLocalPath(s?: string | null) {
  return !!(s && typeof s === "string" && s.startsWith("/"));
}

async function resolveImageUrl(keyOrUrl?: string | null, expiresSec = 60) {
  if (isEmptyVal(keyOrUrl)) return null;
  const trimmed = keyOrUrl!.trim();

  if (looksLikeAbsoluteUrl(trimmed) || looksLikeLocalPath(trimmed)) {
    return trimmed;
  }

  const storageKey = trimmed;

  if (serverSupabase) {
    try {
      const { data, error } = await serverSupabase.storage.from(BUCKET).createSignedUrl(storageKey, expiresSec);
      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
      console.error("createSignedUrl (property page) error:", error ?? null);
    } catch (err) {
      console.error("createSignedUrl (property page) unexpected error:", err);
    }
  }

  try {
    const publicRes = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
    const publicUrl = (publicRes?.data as any)?.publicUrl ?? (publicRes?.data as any)?.publicURL ?? null;
    if (publicUrl) return publicUrl;
  } catch (err) {
    console.error("getPublicUrl (property page) error:", err);
  }

  return null;
}

export default async function PropertyPage(props: any) {
  const params = props?.params as { id?: string } | undefined;
  const paramId = params?.id ?? "";
  if (!paramId) {
    return (
      <Box p={8}>
        <Heading>Invalid property</Heading>
        <Text>No property id provided.</Text>
      </Box>
    );
  }

  let property: PropertyRow | null = null;

  try {
    const { data: bySlug, error: slugErr } = await supabase
      .from("properties")
      .select("id, title, description, price, location, main_image_url, slug, coordinates")
      .eq("slug", paramId)
      .maybeSingle();

    if (slugErr) {
      console.error("Error fetching by slug:", slugErr);
    }

    if (bySlug) {
      property = bySlug as PropertyRow;
    } else {
      const { data: byId, error: idErr } = await supabase
        .from("properties")
        .select("id, title, description, price, location, main_image_url, slug, coordinates")
        .eq("id", paramId)
        .maybeSingle();

      if (idErr) {
        console.error("Error fetching by id:", idErr);
      }
      property = (byId as PropertyRow) ?? null;
    }
  } catch (err) {
    console.error("Supabase fetch error (property details):", err);
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

  // ---------------- FETCH IMAGES ----------------
  let galleryItemsRaw: PropertyImageRow[] = [];
  try {
    const { data: imagesData, error: imagesErr } = await supabase
      .from("property_images")
      .select("id, image_url, alt, caption, display_order")
      .eq("property_id", property.id)
      .order("display_order", { ascending: true });

    if (imagesErr) {
      console.error("Error fetching property_images:", imagesErr);
    } else if (imagesData && imagesData.length > 0) {
      galleryItemsRaw = (imagesData as PropertyImageRow[]).map((r) => r);
    }
  } catch (err) {
    console.error("Unexpected error fetching property images:", err);
  }

  if (galleryItemsRaw.length === 0 && property.main_image_url) {
    galleryItemsRaw = [
      {
        id: "main",
        image_url: property.main_image_url,
        alt: property.title ?? null,
        caption: null,
        display_order: 0,
      },
    ];
  }

  const resolvePromises = galleryItemsRaw.map((it) => resolveImageUrl(it.image_url ?? null, 60));
  const resolved = await Promise.all(resolvePromises);

  const galleryItems = galleryItemsRaw.map((it, idx) => {
    const resolvedUrl = resolved[idx] ?? null;
    return {
      src: resolvedUrl ?? PLACEHOLDER,
      alt: it.alt ?? property.title ?? "Property image",
      caption: it.caption ?? undefined,
    };
  });

  const maps = buildMapsUrl(
    (property as any).coordinates ?? null,
    property.location ?? undefined
  );

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

      <Box maxW="6xl" mx="auto" px={4} py={6}>
        <Stack spacing={6}>
          <Heading>{property.title ?? "Untitled property"}</Heading>

          {/* Gallery: pass fully resolved URLs to ImageGallery */}
          {galleryItems.length > 0 ? (
            <ImageGallery images={galleryItems} />
          ) : (
            <Box
              borderRadius="md"
              overflow="hidden"
              width="100%"
              height="420px"
              bg="gray.100"
            />
          )}

          {/* Price + Enquiry */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            gap={6}
          >
            <Box flex="1" minW={0}>
              <Text
                color="gray.700"
                fontSize="md"
                whiteSpace="pre-line"
                mb={3}
              >
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

            <Box
              width={{ base: "100%", md: "300px" }}
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-start"
            >
              <Stack spacing={4} align="flex-end" width="100%">
                <Box textAlign="right" width="100%">
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    Prices starting from
                  </Text>
                  <Text
                    fontWeight="extrabold"
                    fontSize="3xl"
                    color="black"
                  >
                    {typeof property.price === "number"
                      ? `₹${property.price.toLocaleString("en-IN")}`
                      : "—"}
                  </Text>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </>
  );
}
