import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Why We Built KidToCollege: Free Access to College Counseling | KidToCollege",
  description:
    "Private college counselors charge up to $15,000. We think every student deserves the same advantage. KidToCollege gives every family free expert college admissions tools.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-8">
            Why we built this
          </h1>
          <div className="font-body text-navy/80 space-y-6 leading-relaxed text-lg">
            <p>
              Every year, thousands of smart, capable students miss out on their
              dream college &mdash; not because they weren&apos;t good enough, but
              because their family couldn&apos;t afford a private counsellor.
            </p>
            <p>
              We built KidToCollege to fix that.
            </p>
            <p>
              Everything a $15,000 counsellor does &mdash; college research, essay
              coaching, financial aid strategy, interview prep, scholarship hunting
              &mdash; is here, free, for every family.
            </p>
            <p>
              No ads. No paywalls. No selling your data. Just the same tools and
              guidance that wealthy families have always had access to &mdash; now
              available to everyone.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-card">
            <div className="flex flex-wrap gap-4">
              <Link
                href="/roadmap"
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                See the roadmap &rarr;
              </Link>
              <Link
                href="/search"
                className="bg-white hover:bg-cream text-navy font-body font-medium px-8 py-4 rounded-md transition-colors border border-card"
              >
                Start researching
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
