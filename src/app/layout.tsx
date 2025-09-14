// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import CallbackDialog from "@/components/CallbackDialog"; // <-- add

export const metadata: Metadata = {
  title: "ARK Infra — Premium Real Estate",
  description: "Curated apartments, villas, and commercial spaces",
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
            {/* Mounted once at the app root so any component can open it via CustomEvent */}
            <CallbackDialog />
          </div>
        </Providers>
      </body>
    </html>
  );
}
