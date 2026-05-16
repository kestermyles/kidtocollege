import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Auto-Merit Scholarships 2026: Schools That Pay You for a 3.5 GPA",
  description:
    "12 US universities with transparent, automatic merit scholarships — no essay, no extra application. Hit the published GPA + SAT/ACT threshold and the money is yours. Especially valuable for out-of-state students.",
  alternates: { canonical: "https://www.kidtocollege.com/auto-merit" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Auto-Merit" },
]);

interface AutoMeritSchool {
  slug: string;
  name: string;
  location: string;
  programName: string;
  /** Plain-English description of the auto-merit tiers */
  tiers: string;
  /** Out-of-state advantage (or in-state note) */
  oosNote: string;
  /** Official scholarship URL */
  url: string;
  /** Verdict for who this suits */
  bestFor: string;
}

const SCHOOLS: AutoMeritSchool[] = [
  {
    slug: "university-of-alabama",
    name: "University of Alabama",
    location: "Tuscaloosa, AL",
    programName: "Crimson Legends, Crimson Achievement, UA Distinguished",
    tiers:
      "Out-of-state: 3.5 GPA + 1200 SAT (25 ACT) → $6,000/yr (Legends). 3.5 + 1300 SAT (27 ACT) → $10,000/yr (Achievement). 3.5 + 1390 SAT (30 ACT) → ~$24,000/yr (Distinguished, essentially full out-of-state tuition).",
    oosNote:
      "Alabama's auto-merit is the most aggressive in the country for high-stat out-of-state students. A 3.8 GPA / 1400 SAT student attending from out-of-state often pays less than an in-state student because of the Distinguished award.",
    url: "https://afford.ua.edu/scholarships/out-of-state-freshman/",
    bestFor:
      "Out-of-state high-stat students looking for the cheapest path to a big-state-school experience. Honors College admission is also auto if you qualify.",
  },
  {
    slug: "university-of-mississippi",
    name: "University of Mississippi (Ole Miss)",
    location: "Oxford, MS",
    programName: "Academic Excellence Scholarships",
    tiers:
      "Out-of-state with 3.0 GPA + 23 ACT (1130 SAT) or higher unlocks the Non-Resident Academic Excellence award. Higher thresholds (3.5 + 30 ACT/1370 SAT) qualify for the Holmes Scholarship covering most out-of-state tuition.",
    oosNote:
      "In-state thresholds start at 3.0 + 21 ACT. Out-of-state awards are generous enough that the all-in cost is often comparable to neighboring in-state options.",
    url: "https://finaid.olemiss.edu/scholarships/",
    bestFor:
      "Solid B+/A- students looking south. Strong business (Patterson) and journalism programs.",
  },
  {
    slug: "mississippi-state-university",
    name: "Mississippi State University",
    location: "Starkville, MS",
    programName: "Academic Excellence, Mississippi State Achievement",
    tiers:
      "In-state: 3.0 GPA + 21 ACT (~1070 SAT) earns automatic awards. Out-of-state: similar published chart, with the National Scholar tier covering significant tuition for high-stat applicants.",
    oosNote:
      "Less famous than Alabama or Ole Miss but the auto-merit is genuinely transparent and the in-state thresholds are accessible to typical B students.",
    url: "https://www.admissions.msstate.edu/scholarships",
    bestFor: "B-student in-state Mississippi residents; engineering and agriculture applicants.",
  },
  {
    slug: "arizona-state-university",
    name: "Arizona State University",
    location: "Tempe, AZ",
    programName: "New American University Scholarship (NAUS)",
    tiers:
      "Published GPA × test score chart for non-residents. Awards run from $5,500/yr (Provost) up to $33,000/yr (President's). High-stat out-of-state students (4.0 + 1470 SAT) qualify for top tier — essentially full out-of-state tuition.",
    oosNote:
      "Stackable with Barrett Honors College awards. ASU's structure makes it one of the most price-competitive Tier-One options for high-stat OOS applicants.",
    url: "https://admission.asu.edu/aid/scholarships/freshman",
    bestFor:
      "Out-of-state high-stat students who want a large-public experience with strong honors and pre-professional pipelines.",
  },
  {
    slug: "university-of-arizona",
    name: "University of Arizona",
    location: "Tucson, AZ",
    programName: "Wildcat Excellence Award (and predecessor names)",
    tiers:
      "Out-of-state: GPA-based merit award levels published. Top tier (~4.0 unweighted) approaches $35,000/yr for non-residents, with mid-tier (3.5+) at $25,000+/yr.",
    oosNote:
      "Auto-stack with college-specific awards (e.g., Eller for business, College of Engineering).",
    url: "https://financialaid.arizona.edu/types-aid/scholarships",
    bestFor:
      "Out-of-state high-stat students — Arizona business (Eller), optical sciences, and astronomy are all nationally ranked.",
  },
  {
    slug: "iowa-state-university",
    name: "Iowa State University",
    location: "Ames, IA",
    programName: "Standout Award and Achievement Scholarships",
    tiers:
      "Published merit chart awards based on GPA + test score. Most non-residents with 3.5+ GPA qualify for at least $4,000-$8,500/yr. Top non-resident tier (4.0 + 1450+ SAT) hits $12,000-$15,000/yr.",
    oosNote:
      "Strong engineering, agriculture, and design programs. Cost-of-attendance is among the lowest top-200 publics.",
    url: "https://www.admissions.iastate.edu/scholarships",
    bestFor: "Engineering, agriculture, and design students seeking strong programs at low cost.",
  },
  {
    slug: "university-of-kentucky",
    name: "University of Kentucky",
    location: "Lexington, KY",
    programName: "Presidential Scholarship and tiers",
    tiers:
      "Published GPA × ACT/SAT chart. Out-of-state Presidential covers full tuition for top tier (4.0 + 31 ACT/1390 SAT). Mid-tiers (3.5-3.9 + 27-30 ACT) earn substantial awards.",
    oosNote:
      "Kentucky is one of the most stackable schools — Honors College admission is auto for top scholarship recipients.",
    url: "https://www.uky.edu/financialaid/freshman-merit-scholarships",
    bestFor:
      "Out-of-state students with strong test scores. Pre-med, business (Gatton), and equine science.",
  },
  {
    slug: "university-of-new-mexico-main-campus",
    name: "University of New Mexico",
    location: "Albuquerque, NM",
    programName: "Amigo Scholarship + Regents'",
    tiers:
      "Amigo Scholarship for non-residents reduces tuition to in-state rate for qualifying GPA/test combinations (3.5 + 23 ACT/1130 SAT). Regents' adds a stipend for top stats.",
    oosNote:
      "One of the cheapest paths to a Carnegie R1 research university for out-of-state students. Optical engineering, anthropology, and nursing are strong.",
    url: "https://scholarship.unm.edu/incoming-freshmen.html",
    bestFor:
      "Out-of-state students who want R1 research access at an unusual price point.",
  },
  {
    slug: "university-of-south-carolina-columbia",
    name: "University of South Carolina",
    location: "Columbia, SC",
    programName: "Capstone Scholar, Top Scholar, McNair",
    tiers:
      "Out-of-state: published awards from $7,000-$15,000/yr for various GPA × test combinations. McNair Scholarship (full ride) for very top stats. Carolina Scholar (~$12,000/yr) is an attainable tier for 3.8+ / 1400+ students.",
    oosNote:
      "South Carolina Honors College is co-considered with merit. Strong international business (Moore School ranks #1) and journalism.",
    url: "https://sc.edu/about/offices_and_divisions/financial_aid/types_of_aid/scholarships/freshmen/",
    bestFor:
      "Out-of-state students considering Southeastern schools; international business or pre-med applicants.",
  },
  {
    slug: "the-university-of-tampa",
    name: "University of Tampa",
    location: "Tampa, FL",
    programName: "Presidential, Trustees, Provost Scholarships",
    tiers:
      "Private university with transparent auto-merit. Awards range from $9,000-$20,000/yr based on GPA + test scores. Top-tier Presidential (3.8+ / 1330+ SAT) cuts tuition by about half.",
    oosNote:
      "One of few transparent private auto-merit programs — most privates require essays and personalized review.",
    url: "https://www.ut.edu/admissions/financial-aid/scholarships",
    bestFor:
      "Students drawn to Florida weather + smaller private (~10,000 undergrads). Strong business and marine sciences.",
  },
  {
    slug: "truman-state-university",
    name: "Truman State University",
    location: "Kirksville, MO",
    programName: "TruMerit Automatic Scholarships",
    tiers:
      "Truman publishes the most transparent chart in the US — Effective Scholar tier ($1K-$8K) tied directly to GPA + test combinations. Pershing Scholarship (full ride) is the top tier (3.7+ / 32+ ACT) and requires a separate application.",
    oosNote:
      "Truman is a public liberal-arts university (the only one in Missouri) with elite-school academic culture. Cost is below in-state at many state flagships.",
    url: "https://www.truman.edu/admission-cost/cost-aid/scholarships/automatic-scholarships/trumerit-scholarship/",
    bestFor:
      "Strong students who want a small public liberal arts experience with low debt. Top producer of Fulbright winners per capita.",
  },
  {
    slug: "auburn-university",
    name: "Auburn University",
    location: "Auburn, AL",
    programName: "Auburn Heritage, Spirit of Auburn",
    tiers:
      "Out-of-state Spirit of Auburn covers from $9,000-$22,000/yr based on a published chart. National Merit Finalists get full tuition + housing stipend.",
    oosNote:
      "Cheaper than peer SEC publics for high-stat OOS students. Strong engineering, business, and pre-vet.",
    url: "https://www.auburn.edu/admissions/scholarships/",
    bestFor:
      "Out-of-state students drawn to SEC athletic culture + engineering or business programs.",
  },
];

export default function AutoMeritPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Universities with Auto-Merit Scholarships 2026",
    numberOfItems: SCHOOLS.length,
    itemListElement: SCHOOLS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CollegeOrUniversity",
        name: s.name,
        url: `https://www.kidtocollege.com/college/${s.slug}`,
        address: s.location,
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an auto-merit scholarship?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An automatic merit scholarship is awarded based on a published, transparent chart of GPA + SAT/ACT thresholds. You don't write an essay, don't compete in a holistic review — you hit the threshold listed on the school's scholarship page and the award is yours. About 50 US colleges have transparent auto-merit programs.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to apply separately?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For most schools on this list, no — you just need to complete your admission application by the priority deadline (usually December 1 for fall enrollment). The scholarship is awarded with your admission decision. A few honors-tier awards (Truman's Pershing, USC McNair, Kentucky Otis Singletary) require additional applications.",
        },
      },
      {
        "@type": "Question",
        name: "Are auto-merit scholarships only for out-of-state students?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, but the out-of-state awards are typically much larger. The reason: schools are competing for high-stat out-of-state students who would otherwise go elsewhere. In-state students often qualify for the same programs at smaller dollar amounts, but state grants (Bright Futures in FL, HOPE in GA, Cal Grant in CA) often fill the gap.",
        },
      },
      {
        "@type": "Question",
        name: "Can I stack auto-merit with other scholarships?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usually yes. Auto-merit awards typically stack with departmental scholarships (engineering, business, music), Pell Grant, state grants, and outside private scholarships. They generally don't stack with each other within the same school (you get the highest tier you qualify for, not multiple).",
        },
      },
      {
        "@type": "Question",
        name: "What's the highest auto-merit award available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Several schools cover full out-of-state tuition automatically: University of Alabama's Distinguished (~$24K/yr), Arizona State's President's NAUS (~$33K/yr), Kentucky's Presidential, and Auburn for National Merit Finalists. These require top stats (typically 3.5-3.8+ GPA with 1390+ SAT / 31+ ACT).",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="inline-block font-mono-label text-xs px-3 py-1 rounded-full bg-gold/20 text-gold mb-6">
              No essay required
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Auto-Merit Scholarships 2026
            </h1>
            <p className="font-body text-xl text-white/70 max-w-3xl leading-relaxed">
              Most scholarship lists require you to write essays, hunt for
              obscure foundations, or apply through opaque review processes. The
              schools below publish exactly what GPA + SAT/ACT score earns
              exactly how much money. A 3.5 GPA + 1300 SAT student at Alabama
              gets $10,000/year automatically. No application beyond admission.
              No essay. No negotiation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* TL;DR strip */}
      <section className="py-10 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  3.5 GPA
                </p>
                <p className="font-body text-sm text-navy/60">
                  + 1200 SAT unlocks $6K/yr at Alabama, automatically
                </p>
              </div>
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  $24K
                </p>
                <p className="font-body text-sm text-navy/60">
                  /yr — top auto-tier essentially covers out-of-state tuition
                </p>
              </div>
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  $0
                </p>
                <p className="font-body text-sm text-navy/60">
                  essay required for any school on this list
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The list */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {SCHOOLS.map((s, i) => (
            <FadeIn key={s.slug}>
              <article className="ktc-card p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 font-mono-label text-2xl font-bold text-gold leading-none w-10">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/college/${s.slug}`}
                      className="font-display text-xl sm:text-2xl font-bold text-navy hover:text-gold transition-colors block leading-tight"
                    >
                      {s.name}
                    </Link>
                    <p className="font-body text-sm text-navy/50 mt-1">
                      {s.location} · {s.programName}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ml-14">
                  <div>
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                      The auto-merit chart
                    </h3>
                    <p className="font-body text-sm text-navy/80 leading-relaxed">
                      {s.tiers}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                      Why it matters
                    </h3>
                    <p className="font-body text-sm text-navy/80 leading-relaxed">
                      {s.oosNote}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                      Best for
                    </h3>
                    <p className="font-body text-sm text-navy/80 leading-relaxed">
                      {s.bestFor}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-body font-medium text-gold hover:text-gold/80"
                    >
                      Official scholarship page →
                    </a>
                    <Link
                      href={`/college/${s.slug}`}
                      className="text-sm font-body font-medium text-navy hover:text-gold"
                    >
                      Full {s.name.split(" ").slice(0, 3).join(" ")} profile →
                    </Link>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-4">
              How to use this list
            </h2>
            <ol className="space-y-3 font-body text-navy/80 leading-relaxed">
              <li>
                <strong className="text-navy">1. Check the official chart.</strong>{" "}
                Each school&apos;s scholarship terms change yearly. The link beside each entry goes to the current published chart. Verify your specific GPA + test score against the live chart before relying on any number here.
              </li>
              <li>
                <strong className="text-navy">2. Apply by the priority deadline.</strong>{" "}
                Most auto-merit awards require submitting your admission application by December 1 (sometimes earlier). Apply on time and the scholarship is awarded with your admission decision.
              </li>
              <li>
                <strong className="text-navy">3. Stack with other aid.</strong>{" "}
                Auto-merit stacks with Pell, state grants, departmental scholarships, and most outside private scholarships. Always file FAFSA — even if you think you don&apos;t qualify for need-based aid.
              </li>
              <li>
                <strong className="text-navy">4. Compare net cost, not sticker.</strong>{" "}
                A 3.5 / 1300 student at Alabama (with auto-merit applied) often costs less per year than an in-state public flagship for the same student. Run each school&apos;s Net Price Calculator with your scholarship factored in.
              </li>
            </ol>
            <p className="font-body text-sm text-navy/40 mt-6 italic">
              Last updated: November 2025. Scholarship amounts and thresholds
              vary year to year — always confirm against each school&apos;s
              current published chart.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Related */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-base font-bold text-navy mb-4">
            Related guides
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/honors-colleges" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Honors colleges hub</Link>
            <Link href="/scholarships" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">All scholarships</Link>
            <Link href="/best-colleges" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Best-Colleges lists</Link>
            <Link href="/blog/how-to-pay-for-college-2026" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">How to pay for college 2026</Link>
            <Link href="/fafsa-guide" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">FAFSA guide</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
