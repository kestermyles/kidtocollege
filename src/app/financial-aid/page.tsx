import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { STATE_AID_DATA } from "@/lib/state-aid-data";

export const metadata: Metadata = {
  title: "State Financial Aid Guides — KidToCollege",
  description:
    "State-by-state guides to grants, scholarships, and financial aid programs. Deadlines, eligibility, and tips for maximising aid in your state.",
  alternates: {
    canonical: "https://www.kidtocollege.com/financial-aid",
  },
};

export default function FinancialAidIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="inline-block font-mono-label text-xs px-3 py-1 rounded-full bg-gold/20 text-gold mb-6">
              Free Resource
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
              State Financial Aid Guides
            </h1>
            <p className="font-body text-xl text-white/60 max-w-2xl">
              Every state has its own grant programs, deadlines, and eligibility
              rules. Find yours below and learn how to maximise the aid
              available to your family.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* State grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8 text-center">
              Choose your state
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STATE_AID_DATA.map((state) => (
                <Link
                  key={state.slug}
                  href={`/financial-aid/${state.slug}`}
                  className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">
                      {state.name}
                    </h3>
                    <span className="font-mono-label text-xs text-navy/30">
                      {state.abbreviation}
                    </span>
                  </div>
                  <p className="font-body text-sm text-navy/60 mb-3">
                    {state.grants.length} grant{" "}
                    {state.grants.length === 1 ? "program" : "programs"} &middot;{" "}
                    {state.grants.some((g) => g.type === "merit-based")
                      ? "Merit + Need-based"
                      : "Need-based"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-body text-xs text-navy/40">
                      FAFSA: {state.fafsaDeadline.split("(")[0].trim()}
                    </p>
                    <span className="text-gold text-sm font-body opacity-0 group-hover:opacity-100 transition-opacity">
                      View guide &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* More states coming */}
          <FadeIn delay={0.5}>
            <div className="mt-12 text-center">
              <p className="font-body text-navy/40">
                More states coming soon. In the meantime, our{" "}
                <Link
                  href="/fafsa-guide"
                  className="text-gold hover:text-gold/80 underline underline-offset-2"
                >
                  FAFSA Guide
                </Link>{" "}
                covers federal aid available in all 50 states.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              State aid is just one piece
            </h2>
            <p className="font-body text-navy/60 text-lg mb-8">
              Federal grants, institutional merit aid, and private scholarships
              can significantly reduce your costs. Our research tool finds them
              all.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/search"
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                Find Your College &rarr;
              </Link>
              <Link
                href="/fafsa-guide"
                className="bg-white hover:bg-white/80 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors border border-card"
              >
                FAFSA Guide
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
