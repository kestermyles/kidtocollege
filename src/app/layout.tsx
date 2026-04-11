import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";
import Sam from "@/components/Sam";

export const metadata: Metadata = {
  metadataBase: new URL("https://kidtocollege.com"),
  title: {
    default: "Free College Admissions Help for Every Student | KidToCollege",
    template: "%s | KidToCollege",
  },
  description:
    "Get the same college admissions advantage as kids with $15,000 counselors — for free. Find colleges, scholarships, and your personalized roadmap to acceptance.",
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KidToCollege",
  },
  icons: {
    icon: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Free College Admissions Help for Every Student | KidToCollege",
    description:
      "Get the same college admissions advantage as kids with $15,000 counselors — for free. Find colleges, scholarships, and your personalized roadmap to acceptance.",
    siteName: "KidToCollege",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "KidToCollege — Free college admissions help for every student" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KidToCollege",
              url: "https://kidtocollege.com",
              description:
                "Free college admissions platform giving every student access to expert guidance",
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@kidtocollege.com",
                contactType: "customer support",
              },
            }),
          }}
        />
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
