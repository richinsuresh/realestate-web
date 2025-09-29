// src/app/page.tsx
import React from "react";
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
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60;

type GalleryImage = {
  src: string;
  alt?: string;
  caption?: string;
  href?: string;
};

type PropertyImageRow = {
  id: string;
  image_url: string | null;
  alt?: string | null;
  caption?: string | null;
  display_order?: number | null;
};

type PropertyRow = {
  id: string;
  title?: string | null;
  description?: string | null;
  slug?: string | null;
  main_image_url?: string | null;
  main_image_alt?: string | null;
  property_images?: PropertyImageRow[] | null;
};

// ---- config (strict: fail loudly if BUCKET missing) ----
// make BUCKET a definite string so TypeScript knows its type
const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "";
if (!BUCKET) {
  throw new Error(
    "[config] Missing NEXT_PUBLIC_SUPABASE_BUCKET env. Add it to .env.local and restart."
  );
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// server-only supabase client (service role) when available
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

  // Try signed URL with server client (private buckets)
  if (serverSupabase) {
    try {
      // BUCKET is definitely a string (see top guard)
      const { data, error } = await serverSupabase.storage.from(BUCKET).createSignedUrl(storageKey, expiresSec);
      if (!error && data?.signedUrl) return data.signedUrl;
      console.error("createSignedUrl error (homepage)", error ?? null);
    } catch (err) {
      console.error("createSignedUrl unexpected error (homepage)", err);
    }
  }

  // Fallback: public url via anon client
  try {
    const publicRes = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
    const publicUrl = (publicRes?.data as any)?.publicUrl ?? (publicRes?.data as any)?.publicURL ?? null;
    if (publicUrl) return publicUrl;
  } catch (err) {
    console.error("getPublicUrl error (homepage)", err);
  }

  return null;
}

function SafeNextImage({
  src,
  alt,
  priority,
  sizes,
  style,
}: {
  src?: string | null;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const safeSrc = src && typeof src === "string" && src.trim() ? src : PLACEHOLDER;
  return (
    <NextImage
      src={safeSrc}
      alt={alt ?? "image"}
      fill
      sizes={sizes}
      style={style}
      priority={priority}
    />
  );
}

export default async function Home() {
  let properties: PropertyRow[] = [];

  try {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        description,
        slug,
        main_image_url,
        main_image_alt,
        property_images (
          id,
          image_url,
          alt,
          caption,
          display_order
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Supabase fetch error (homepage)", error.message ?? error);
    } else {
      properties = (data ?? []) as PropertyRow[];
    }
  } catch (err) {
    console.error("Unexpected Supabase fetch error (homepage)", err);
  }

  console.log("SUPABASE HOMEPAGE FETCH COUNT", properties.length);

  type ResolveJob = { propId: string; candidate?: string | null; alt?: string | null; href?: string | null };
  const jobs: ResolveJob[] = [];

  for (const p of properties) {
    const firstImgFromList = p.property_images && p.property_images.length > 0
      ? p.property_images[0].image_url
      : null;

    const candidate = firstImgFromList ?? p.main_image_url;
    const href = `/listings/${p.slug ?? p.id}`;

    jobs.push({ propId: p.id, candidate, alt: p.main_image_alt ?? p.title ?? undefined, href });
  }

  const resolvedList = await Promise.all(jobs.map((j) => resolveImageUrl(j.candidate ?? null, 60)));

  const galleryItems: GalleryImage[] = jobs.map((j, idx) => {
    const resolved = resolvedList[idx];
    const src = resolved ?? PLACEHOLDER;
    return {
      src,
      alt: j.alt ?? "Property",
      caption: undefined,
      href: j.href ?? "#",
    };
  });

  const seen = new Set<string>();
  const uniqueGallery = galleryItems.filter((it) => {
    const s = it?.src ?? "";
    if (!s) return false;
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 24);

  const galleryToRender =
    uniqueGallery.length > 0
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
        <Box position="absolute" inset={0} bgGradient="linear(to-b, rgba(0,0,0,0.78), rgba(0,0,0,0.45))" zIndex={1} />
        <Container maxW="1100px" position="relative" zIndex={2} height="100%" display="flex" alignItems="center" justifyContent="center" px={{ base: 6, md: 8 }}>
          <VStack align="center" spacing={{ base: 3, md: 6 }} maxW="900px" textAlign="center" pb={{ base: 6, md: 10 }}>
            <Box width="100%" display="flex" justifyContent="center">
              <Link href="/" aria-label="Home">
                <NextImage src="/logo.png" alt="Company Logo" width={220} height={64} style={{ objectFit: "contain" }} priority />
              </Link>
            </Box>

            <Heading as="h1" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} color="white" fontWeight={800} lineHeight="1.05" letterSpacing="-0.02em">
              {process.env.NEXT_PUBLIC_HERO_HEADING ?? "Exceptional properties, crafted for living."}
            </Heading>

            <Text fontSize={{ base: "sm", md: "md", lg: "lg" }} color="gray.300" maxW="72ch" fontWeight={500}>
              {process.env.NEXT_PUBLIC_HERO_TEXT ??
                "Discover our curated portfolio of premium apartments, villas and commercial spaces — photography-first presentation and international standards."}
            </Text>

            <HStack spacing={4} pt={{ base: 2, md: 4 }} justify="center" flexWrap="wrap">
              <Button size="lg" colorScheme="brand" as="a" href="/listings">View Listings</Button>
              {/* About and hero-local WhatsApp button removed — header now contains the Chat on WhatsApp CTA */}
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
                  <SafeNextImage src={img.src} alt={img.alt ?? "Property"} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" priority={idx < 2} style={{ objectFit: "cover" }} />
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}
