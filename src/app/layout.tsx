// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "ARK Infra";
const COMPANY_TAGLINE =
  process.env.NEXT_PUBLIC_COMPANY_TAGLINE ?? "Premium real estate";

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
          </div>
        </Providers>
      </body>
    </html>
  );
}
