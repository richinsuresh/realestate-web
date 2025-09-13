// src/components/ImageGallery.tsx
"use client";

import React from "react";
import NextLink from "next/link";
import { Box, SimpleGrid, Text, AspectRatio } from "@chakra-ui/react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

type GalleryItem = {
  src: string;
  alt?: string;
  caption?: string;
  href?: string;
  featured?: boolean;
};

type Props = {
  images: GalleryItem[];
  columns?: number;
  featuredFirst?: boolean;
  priorityCount?: number; // how many first images to mark priority
};

export default function ImageGallery({ images, columns = 3, featuredFirst = false, priorityCount = 0 }: Props) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: columns }} spacing={4}>
      {images.map((img, idx) => (
        <GalleryCard key={(img.src ?? String(idx)) + idx} item={img} index={idx} featuredFirst={featuredFirst} priority={idx < (priorityCount ?? 0)} />
      ))}
    </SimpleGrid>
  );
}

function GalleryCard({ item, index, featuredFirst, priority }: { item: GalleryItem; index: number; featuredFirst: boolean; priority: boolean; }) {
  // If featuredFirst is enabled and this is the first item, span 2 columns on md+
  const gridColumn = featuredFirst && index === 0 ? { md: "span 2" } : undefined;

  const content = (
    <Box position="relative" overflow="hidden" borderRadius="md" bg="gray.800" gridColumn={gridColumn}>
      <AspectRatio ratio={4 / 3}>
        <Box position="relative" width="100%" height="100%">
          <ImageWithSkeleton
            src={item.src ?? "/placeholder.jpg"}
            alt={item.alt ?? item.caption ?? "Image"}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            fallbackSrc="/placeholder.jpg"
            // pass priority down to ImageWithSkeleton which maps it to next/image priority
            // note: priority should be used sparingly for best performance
            {...(priority ? { priority: true } : {})}
          />
        </Box>
      </AspectRatio>

      {item.caption && (
        <Box position="absolute" bottom={2} left={2} right={2} px={3} py={1} bg="rgba(0,0,0,0.45)" borderRadius="md">
          <Text fontSize="sm" color="white" noOfLines={1}>
            {item.caption}
          </Text>
        </Box>
      )}
    </Box>
  );

  return item.href ? (
    <NextLink href={item.href} passHref legacyBehavior>
      <a aria-label={item.caption ?? "Open property"} style={{ display: "block" }}>
        {content}
      </a>
    </NextLink>
  ) : (
    content
  );
}
