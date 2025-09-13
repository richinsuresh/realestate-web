// src/components/ClientListings.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  HStack,
  Select,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button,
} from "@chakra-ui/react";
import PropertyCard from "@/components/PropertyCard";

type Property = {
  id: string;
  slug?: string;
  title: string;
  location?: string;
  type?: string;
  price?: number;
  bedrooms?: number;
  description?: string;
  images?: string[];
};

export default function ClientListings({
  initialProperties,
}: {
  initialProperties: Property[];
}) {
  // price bounds
  const prices = useMemo(
    () => initialProperties.map((p) => p.price ?? 0),
    [initialProperties]
  );
  const minPrice = Math.min(...(prices.length ? prices : [0]));
  const maxPrice = Math.max(...(prices.length ? prices : [0]));

  // unique property types
  const types = useMemo(
    () =>
      Array.from(
        new Set(initialProperties.map((p) => p.type).filter(Boolean))
      ) as string[],
    [initialProperties]
  );

  // state for filters
  const [type, setType] = useState<string>("All");
  const [minSelected, setMinSelected] = useState<number>(minPrice);
  const [maxSelected, setMaxSelected] = useState<number>(maxPrice);
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);

  // filter logic
  const filtered = useMemo(() => {
    return initialProperties.filter((p) => {
      if (type !== "All" && p.type !== type) return false;
      if (minBedrooms !== null && (p.bedrooms ?? 0) < minBedrooms) return false;
      const price = p.price ?? 0;
      if (price < minSelected || price > maxSelected) return false;
      return true;
    });
  }, [initialProperties, type, minBedrooms, minSelected, maxSelected]);

  return (
    <Container maxW="7xl" py={10}>
      {/* Filter bar */}
      <Box mb={8}>
        <HStack spacing={4} flexWrap="wrap" alignItems="center">
          {/* Type */}
          <FormControl width={{ base: "48%", md: "200px" }}>
            <FormLabel fontSize="sm">Type</FormLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              bg="gray.800"
              color="white"
            >
              <option value="All">All</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Bedrooms */}
          <FormControl width={{ base: "48%", md: "140px" }}>
            <FormLabel fontSize="sm">Min beds</FormLabel>
            <NumberInput
              min={0}
              value={minBedrooms ?? ""}
              onChange={(val) =>
                setMinBedrooms(val === "" ? null : Number(val))
              }
            >
              <NumberInputField bg="gray.800" color="white" />
            </NumberInput>
          </FormControl>

          {/* Price slider */}
          <Box flex="1" minW="220px">
            <FormLabel fontSize="sm">Price range (₹)</FormLabel>
            <HStack>
              <Text fontSize="sm">₹{minSelected.toLocaleString()}</Text>
              <Box flex="1">
                <Slider
                  aria-label="price-range"
                  min={minPrice}
                  max={maxPrice}
                  step={10000}
                  onChange={(val) => {
                    setMaxSelected(val);
                    if (val < minSelected) setMinSelected(minPrice);
                  }}
                  defaultValue={maxPrice}
                >
                  <SliderTrack bg="gray.700">
                    <SliderFilledTrack bg="teal.400" />
                  </SliderTrack>
                  <SliderThumb boxSize={4} />
                </Slider>
              </Box>
              <Text fontSize="sm">₹{maxSelected.toLocaleString()}</Text>
            </HStack>
          </Box>

          {/* Reset button */}
          <Button
            size="sm"
            onClick={() => {
              setType("All");
              setMinBedrooms(null);
              setMinSelected(minPrice);
              setMaxSelected(maxPrice);
            }}
          >
            Reset
          </Button>
        </HStack>
      </Box>

      {/* Listings grid */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 10, md: 14, lg: 20 }}
      >
        {filtered.map((p) => (
          <PropertyCard
            key={p.id}
            property={{
              id: p.id,
              title: p.title,
              images: p.images ?? [],
              location: p.location,
              type: p.type,
              price: p.price ?? 0,
              bedrooms: p.bedrooms ?? 0,
            }}
          />
        ))}
      </SimpleGrid>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Box mt={12} textAlign="center" color="gray.400">
          No properties match your filters.
        </Box>
      )}
    </Container>
  );
}
