// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import Link from "next/link"; // for WhatsApp floating button
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "ARK Infra — Premium Real Estate",
  description: "Curated apartments, villas, and commercial spaces",
  icons: {
    icon: "/favicon.ico", // ✅ replace Next.js favicon with your logo
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="page-wrapper">
            <Navbar />
            <main className="content">{children}</main>
            <Footer />

            {/* ✅ Floating WhatsApp button */}
            <Box
              position="fixed"
              bottom="24px"
              right="24px"
              zIndex={1000}
            >
              <Link
                href="https://wa.me/91XXXXXXXXXX" // <-- replace with your company number
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/whatsapp.png" // ✅ put your WhatsApp icon inside /public
                  alt="Chat on WhatsApp"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                />
              </Link>
            </Box>
          </div>
        </Providers>
      </body>
    </html>
  );
}
