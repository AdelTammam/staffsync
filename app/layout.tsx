/*
 * layout.tsx
 * Date: June 2025
 * Description: Root layout for the StaffSync application. Wraps every
 *   page with the HTML shell, Geist fonts, global CSS, SessionProvider
 *   (via Providers), sticky NavBar, and Footer.
 * Inputs:  children — the active page component.
 * Processing: Applies font CSS variables, sets page metadata, and
 *   assembles the flex-column body layout so the footer stays at the bottom.
 * Outputs: A complete HTML document shell wrapping the page content.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar    from "./components/NavBar";
import Footer    from "./components/Footer";
import Providers from "./components/Providers";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "StaffSync — Employee Management Portal",
  description: "A secure, centralised HR portal for managing employee records.",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
