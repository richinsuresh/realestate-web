// src/components/NavButton.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@chakra-ui/react";

type NavButtonProps = ButtonProps & {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function NavButton({
  href,
  children,
  onClick,
  ...buttonProps
}: NavButtonProps) {
  const router = useRouter();

  const handle = (e: React.MouseEvent) => {
    if (onClick) onClick();
    router.push(href); // SPA navigation
  };

  return (
    <Button onClick={handle} {...buttonProps}>
      {children}
    </Button>
  );
}
