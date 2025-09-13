// src/components/NavButton.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

export default function NavButton({
  href,
  children,
  variant = "solid",
  colorScheme = "teal",
  size = "md",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  colorScheme?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}) {
  const router = useRouter();

  const handle = (e: React.MouseEvent) => {
    if (onClick) onClick();
    // client-side navigation preserves SPA behavior
    router.push(href);
  };

  return (
    <Button onClick={handle} variant={variant} colorScheme={colorScheme} size={size}>
      {children}
    </Button>
  );
}
