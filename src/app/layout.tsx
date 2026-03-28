import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "KidToCollege — Free College Guidance for Every Family",
  description:
    "Private college counsellors charge up to $15,000. We think every kid deserves the same advantage — for free. AI-powered college research, scholarships, and coaching.",
  openGraph: {
    title: "KidToCollege — Free College Guidance for Every Family",
    description:
      "Private college counsellors charge up to $15,000. We think every kid deserves the same advantage — for free.",
    siteName: "KidToCollege",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
