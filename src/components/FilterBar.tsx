// src/components/FilterBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Box, HStack, VStack, Text, Button } from "@chakra-ui/react";

type FilterState = {
  type: string;
  bedrooms: number | null;
  range: [number, number];
};

export default function FilterBar({
  min,
  max,
  onChange,
  initial,
  types,
}: {
  min: number;
  max: number;
  initial?: FilterState;
  types: string[];
  onChange: (s: FilterState) => void;
}) {
  const [range, setRange] = useState<[number, number]>(initial?.range ?? [min, max]);
  const [type, setType] = useState<string>(initial?.type ?? "All");
  const [bedrooms, setBedrooms] = useState<number | null>(initial?.bedrooms ?? null);

  useEffect(() => {
    onChange({ type, bedrooms, range });
  }, [type, bedrooms, range, onChange]);

  const reset = () => {
    setType("All");
    setBedrooms(null);
    setRange([min, max]);
  };

  return (
    <VStack align="stretch" spacing={5}>
      {/* Top row */}
      <HStack spacing={4} justify="space-between" flexWrap="wrap">
        <HStack spacing={3}>
          {/* Property type */}
          <label>
            <Text fontSize="sm" fontWeight="500" mr={2}>
              Type
            </Text>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="All">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {/* Bedrooms */}
          <label>
            <Text fontSize="sm" fontWeight="500" mr={2}>
              Beds
            </Text>
            <select
              value={bedrooms ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setBedrooms(v === "" ? null : Number(v));
              }}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
        </HStack>

        <HStack spacing={3}>
          <Text fontSize="sm" color="muted.500">
            Price
          </Text>
          <Text fontSize="sm" fontWeight="600">
            ₹{range[0].toLocaleString("en-IN")} – ₹{range[1].toLocaleString("en-IN")}
          </Text>
          <Button size="sm" onClick={reset}>
            Reset
          </Button>
        </HStack>
      </HStack>

      {/* Price sliders */}
      <Box>
        <Text fontSize="sm" mb={1}>
          Adjust Price Range
        </Text>
        <HStack spacing={4} align="center">
          <input
            type="range"
            min={min}
            max={max}
            step={100000}
            value={range[0]}
            onChange={(e) => setRange([Number(e.target.value), range[1]])}
            style={{ flex: 1 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={100000}
            value={range[1]}
            onChange={(e) => setRange([range[0], Number(e.target.value)])}
            style={{ flex: 1 }}
          />
        </HStack>
        <HStack justify="space-between" mt={2}>
          <Text fontSize="xs">₹{min.toLocaleString("en-IN")}</Text>
          <Text fontSize="xs">₹{max.toLocaleString("en-IN")}</Text>
        </HStack>
      </Box>
    </VStack>
  );
}
