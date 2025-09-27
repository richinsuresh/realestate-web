"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import NextImage from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/placeholder.jpg";

/**
 * Ensure only valid values go into NextImage.
 * Valid:
 *   - root-relative (/foo.jpg)
 *   - http://... or https://...
 *   - storage-style keys (bucket/path/file.jpg)
 */
function isValidImageSrc(src?: string | null): src is string {
  if (!src) return false;
  const s = String(src).trim();
  if (!s || s === "null" || s === "undefined") return false;

  if (s.startsWith("/")) return true; // local asset
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    // If it looks like a Supabase storage key, allow it (last-resort fallback)
    return s.includes("/") && !s.includes(" ");
  }
}

/** Safe wrapper around NextImage */
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
  const safeSrc = isValidImageSrc(src) ? src! : PLACEHOLDER;

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

export type ImageGalleryProps = {
  images: {
    src: string;
    alt?: string;
    caption?: string;
  }[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  const safeImages =
    images && images.length > 0
      ? images
      : [{ src: PLACEHOLDER, alt: "Placeholder" }];

  return (
    <Box>
      {/* Main image */}
      <Box
        position="relative"
        width="100%"
        height={{ base: "280px", md: "480px" }}
        borderRadius="md"
        overflow="hidden"
        mb={4}
      >
        <SafeNextImage
          src={safeImages[selected]?.src}
          alt={safeImages[selected]?.alt ?? "Property"}
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </Box>

      {/* Thumbnails */}
      <SimpleGrid columns={{ base: 4, md: 6 }} spacing={2}>
        {safeImages.map((img, idx) => (
          <Box
            key={idx}
            position="relative"
            height="80px"
            borderRadius="md"
            overflow="hidden"
            cursor="pointer"
            border={idx === selected ? "2px solid #3182ce" : "1px solid #ccc"}
            onClick={() => setSelected(idx)}
          >
            <SafeNextImage
              src={img.src}
              alt={img.alt ?? "Thumbnail"}
              sizes="20vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
