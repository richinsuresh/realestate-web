"use client";

import React, { useState, useMemo } from "react";
import { Box, Skeleton, Center } from "@chakra-ui/react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  fill?: boolean;
  style?: React.CSSProperties;
  sizes?: string;
  fallbackSrc?: string;
};

export default function ImageWithSkeleton({
  src,
  alt,
  priority = false,
  fill = false,
  style,
  sizes,
  fallbackSrc = "/placeholder.jpg",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [nativeFallback, setNativeFallback] = useState(false);

  // choose final source: if errored, immediately use placeholder.
  const finalSrc = useMemo(() => (errored ? fallbackSrc : src), [errored, fallbackSrc, src]);

  // Optional: if you still have dev-only proxy problems, set this env var to "1"
  // to force next/image unoptimized behavior during development.
  const forceUnoptimized = typeof window !== "undefined" && (window as any).NEXT_PUBLIC_DEV_IMAGE_FALLBACK === "1";

  // Styles applied to next/image wrapper to do fade-in
  const imgStyle: React.CSSProperties = {
    objectFit: "cover",
    transition: "opacity 360ms ease, transform 360ms ease",
    opacity: loaded ? 1 : 0,
    transform: loaded ? "scale(1)" : "scale(1.02)",
    ...style,
  };

  // container background to avoid white/blue flash while loading
  const bgColor = "rgba(0,0,0,0.04)"; // subtle neutral; change to match your card bg if needed

  return (
    <Box position={fill ? "relative" : "static"} width="100%" height="100%" bg={bgColor} borderRadius="inherit" overflow="hidden">
      {/* Skeleton visible until image is loaded (we still render Image underneath for better layout) */}
      <Skeleton
        isLoaded={loaded && !errored}
        startColor="gray.200"
        endColor="gray.150"
        fadeDuration={0.2}
        height="100%"
        width="100%"
        borderRadius="inherit"
      >
        <Box position={fill ? "absolute" : "relative"} inset={0} width="100%" height="100%">
          {!nativeFallback ? (
            <Image
              src={finalSrc}
              alt={alt ?? ""}
              fill={fill}
              sizes={sizes}
              style={imgStyle}
              onLoadingComplete={() => {
                // successful load
                setLoaded(true);
              }}
              onError={() => {
                // try native <img> fallback once, otherwise use placeholder
                if (!nativeFallback && !errored) {
                  setNativeFallback(true);
                } else {
                  setErrored(true);
                  setLoaded(true); // show placeholder right away
                }
              }}
              priority={priority}
              // only use unoptimized if explicitly enabled in dev to avoid masking config issues
              unoptimized={forceUnoptimized}
            />
          ) : (
            // Native <img> fallback (some mobile browsers load remote images better as native)
            <Center width="100%" height="100%" bg={bgColor}>
              <img
                src={finalSrc}
                alt={alt ?? ""}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...imgStyle }}
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setErrored(true);
                  setLoaded(true);
                }}
              />
            </Center>
          )}
        </Box>
      </Skeleton>
    </Box>
  );
}
