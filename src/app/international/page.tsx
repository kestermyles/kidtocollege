import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PhotoSection } from "@/components/PhotoSection";

export const metadata: Metadata = {
  title: "International — KidToCollege",
  description:
    "Study abroad as an American student or study in the US as an international student. Guides for the UK, Canada, Australia, Europe, global scholarships, and US admissions.",
  openGraph: {
    title: "International — KidToCollege",
    description:
      "The world is your campus. Country guides, application systems, scholarships, and visa advice for students going global.",
  },
};

const DESTINATIONS = [
  {
    title: "United Kingdom",
    href: "/international/uk",
    description: "UCAS, Russell Group, A-levels & more",
    flag: "🇬🇧",
    color: "border-l-crimson",
  },
  {
    title: "Canada",
    href: "/international/canada",
    description: "Province-by-province guide, affordable tuition",
    flag: "🇨🇦",
    color: "border-l-crimson",
  },
  {
    title: "Australia",
    href: "/international/australia",
    description: "UAC, ATAR, world-class universities",
    flag: "🇦🇺",
    color: "border-l-sage",
  },
  {
    title: "Europe",
    href: "/international/europe",
    description: "English-taught degrees, low/no tuition countries",
    flag: "🇪🇺",
    color: "border-l-sage",
  },
  {
    title: "Global Scholarships",
    href: "/international/global-scholarships",
    description: "Chevening, Fulbright, DAAD & more",
    flag: "🌍",
    color: "border-l-gold",
  },
  {
    title: "Study in the US",
    href: "/international/study-in-us",
    description: "F-1 visa, scholarships, TOEFL/IELTS",
    flag: "🇺🇸",
    color: "border-l-gold",
  },
];

export default function InternationalPage() {
  return (
    <>
      {/* Hero */}
      <PhotoSection
        imageUrl="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
        overlayOpacity="bg-navy/70"
        className="min-h-[70vh] flex items-center"
      >
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Think bigger. The world is your{" "}
              <span className="text-gold">campus.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl md:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re an American student looking abroad or an
              international student aiming for the US — we&apos;ve got you
              covered.
            </p>
          </FadeIn>
        </div>
      </PhotoSection>

      {/* Destination Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-sm tracking-widest uppercase mb-3 text-center">
              Choose your path
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-4">
              Where do you want to study?
            </h2>
            <p className="font-body text-navy/60 text-center max-w-2xl mx-auto mb-16">
              Each guide covers application systems, costs, scholarships, visas,
              and the cultural differences you need to know before you apply.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest, i) => (
              <FadeIn key={dest.href} delay={i * 0.08}>
                <Link href={dest.href} className="block group">
                  <div
                    className={`ktc-card p-8 h-full border-l-4 ${dest.color} transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-l-gold`}
                  >
                    <span className="text-3xl mb-4 block">{dest.flag}</span>
                    <h3 className="font-display text-xl font-bold text-navy mb-2 group-hover:text-sage transition-colors">
                      {dest.title}
                    </h3>
                    <p className="font-body text-navy/60 text-sm leading-relaxed">
                      {dest.description}
                    </p>
                    <div className="mt-4 flex items-center text-gold font-body text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore guide
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* US content note */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-body text-navy/60 text-base leading-relaxed mb-6">
              Our international sections are guides with links to official
              admissions bodies and government resources. US content remains our
              most comprehensive resource — start with{" "}
              <Link href="/coach" className="text-sage font-medium underline underline-offset-2">
                The Coach
              </Link>{" "}
              or{" "}
              <Link href="/search" className="text-sage font-medium underline underline-offset-2">
                college research
              </Link>{" "}
              for the full experience.
            </p>
            <p className="font-mono-label text-navy/40 text-xs tracking-widest uppercase">
              This is a guide — always verify directly with the institution and
              relevant government body.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
