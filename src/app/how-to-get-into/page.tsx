import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { HOW_TO_GET_IN } from "@/lib/how-to-get-in-data";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "How to Get Into Top Colleges: School-Specific Admissions Guides",
  description:
    "School-specific 'how to get in' guides for 30+ top US colleges — Ivies, Stanford, MIT, Caltech, top publics, and elite liberal arts. Concrete steps, common mistakes, and reality checks for borderline applicants.",
  alternates: { canonical: "https://www.kidtocollege.com/how-to-get-into" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "How to Get In" },
]);

const slugToDisplay: Record<string, string> = {
  "harvard-university": "Harvard",
  "stanford-university": "Stanford",
  "massachusetts-institute-of-technology": "MIT",
  "yale-university": "Yale",
  "princeton-university": "Princeton",
  "ut-austin": "UT Austin",
  "university-of-california-berkeley": "UC Berkeley",
  "rice-university": "Rice",
  "duke-university": "Duke",
  "carnegie-mellon-university": "Carnegie Mellon",
  "brown-university": "Brown",
  "dartmouth-college": "Dartmouth",
  "cornell-university": "Cornell",
  "columbia-university-in-the-city-of-new-york": "Columbia",
  "university-of-pennsylvania": "UPenn",
  "university-of-chicago": "UChicago",
  "northwestern-university": "Northwestern",
  "university-of-notre-dame": "Notre Dame",
  "vanderbilt-university": "Vanderbilt",
  "university-of-southern-california": "USC",
  "johns-hopkins-university": "Johns Hopkins",
  "washington-university-in-st-louis": "WashU",
  "emory-university": "Emory",
  "california-institute-of-technology": "Caltech",
  "tufts-university": "Tufts",
  "georgetown-university": "Georgetown",
  "university-of-michigan-ann-arbor": "Michigan",
  "university-of-california-los-angeles": "UCLA",
  "unc-chapel-hill": "UNC",
  "university-of-virginia": "UVA",
  "georgia-tech": "Georgia Tech",
  "amherst-college": "Amherst",
  "williams-college": "Williams",
  "pomona-college": "Pomona",
};

export default function HowToGetInIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              How to Get Into Top Colleges
            </h1>
            <p className="font-body text-xl text-white/60">
              School-specific admissions guides — concrete steps, common
              mistakes, and a reality check for borderline applicants. Honest,
              free, and updated for 2026.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_TO_GET_IN.map((e) => {
                const display = slugToDisplay[e.slug] ?? e.slug;
                return (
                  <Link
                    key={e.slug}
                    href={`/how-to-get-into/${e.slug}`}
                    className="ktc-card p-5 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <h2 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors mb-1">
                      How to get into {display}
                    </h2>
                    <p className="font-body text-sm text-navy/60 line-clamp-2">
                      {e.hook}
                    </p>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-3">
              Don&apos;t see your target school?
            </h2>
            <p className="font-body text-navy/60 mb-6">
              We profile 2,900+ US colleges. Search for yours — every college
              page includes admissions data, requirements, and the angles
              admissions readers actually weigh.
            </p>
            <Link
              href="/colleges"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
            >
              Browse all 2,900+ colleges &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
