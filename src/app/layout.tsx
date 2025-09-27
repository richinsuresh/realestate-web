// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import Link from "next/link";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "ARK Infra";
const COMPANY_TAGLINE =
  process.env.NEXT_PUBLIC_COMPANY_TAGLINE ?? "Premium real estate";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "91XXXXXXXXXX";

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Premium Real Estate`,
  description: COMPANY_TAGLINE,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const whatsappDigits = WHATSAPP_NUMBER.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits}`;

  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <div className="page-wrapper flex flex-col min-h-screen">
            <Navbar />
            <main className="content flex-1">{children}</main>
            <Footer />

            {/* Floating WhatsApp button */}
            <Box position="fixed" bottom="24px" right="24px" zIndex={1000}>
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <Image
                  src="/whatsapp.png"
                  alt="Chat on WhatsApp"
                  width={56}
                  height={56}
                  style={{
                    borderRadius: "50%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  priority
                />
              </Link>
            </Box>
          </div>
        </Providers>
      </body>
    </html>
  );
}
