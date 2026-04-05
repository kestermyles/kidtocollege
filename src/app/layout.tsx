import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import Sam from "@/components/Sam";

export const metadata: Metadata = {
  metadataBase: new URL("https://kidtocollege.com"),
  title: "Free College Admissions Help for Every Student | KidToCollege",
  description:
    "Get the same college admissions advantage as kids with $15,000 counselors — for free. Find colleges, scholarships, and your personalized roadmap to acceptance.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Free College Admissions Help for Every Student | KidToCollege",
    description:
      "Get the same college admissions advantage as kids with $15,000 counselors — for free. Find colleges, scholarships, and your personalized roadmap to acceptance.",
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
          <Sam />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
