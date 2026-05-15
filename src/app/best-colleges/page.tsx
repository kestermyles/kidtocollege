import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { BEST_COLLEGES_TOPICS } from "@/lib/best-colleges-data";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Best Colleges 2026: Ranked Lists by Major, Cost & Region",
  description:
    "Curated rankings of the best US colleges in 2026 — by major (engineering, CS, nursing, business), region (Texas), value (no-loan financial aid), and category (HBCUs). Free, fact-checked.",
  alternates: { canonical: "https://www.kidtocollege.com/best-colleges" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Best Colleges" },
]);

export default function BestCollegesIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
              Best Colleges 2026
            </h1>
            <p className="font-body text-xl text-white/60 max-w-2xl">
              Curated rankings — by major, region, cost, and category. Each list
              is hand-built, fact-checked, and tied to live data from each college.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {BEST_COLLEGES_TOPICS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/best-colleges/${t.slug}`}
                  className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <h2 className="font-display text-xl font-bold text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
                    {t.h1}
                  </h2>
                  <p className="font-body text-sm text-navy/60 leading-relaxed mb-3">
                    {t.intro.slice(0, 200)}…
                  </p>
                  <span className="font-body text-sm text-gold font-medium">
                    See the ranking &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-3">
              Want a custom ranking for your situation?
            </h2>
            <p className="font-body text-navy/60 mb-6">
              Enter your GPA, test scores, and budget — we&apos;ll show you a personalized list of reach, target, and safety schools.
            </p>
            <Link
              href="/my-chances"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
            >
              Check your chances &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
