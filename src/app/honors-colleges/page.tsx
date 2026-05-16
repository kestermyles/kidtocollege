import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { breadcrumbsLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Honors Colleges 2026: The Ivy Alternative at In-State Public Prices",
  description:
    "The best US honors colleges — Macaulay, Schreyer, Barrett, UMD Honors, Plan II at UT Austin, and more. Ivy-tier resources, public-school price, and meaningfully easier to get into than peer privates.",
  alternates: { canonical: "https://www.kidtocollege.com/honors-colleges" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Honors Colleges" },
]);

interface HonorsProgram {
  id: string;
  name: string;
  university: string;
  /** slug of parent university in the colleges table (for linking) */
  parentSlug?: string;
  location: string;
  costNote: string;
  admissionNote: string;
  highlights: string[];
  ideallySuits: string;
}

const PROGRAMS: HonorsProgram[] = [
  {
    id: "macaulay-cuny",
    name: "Macaulay Honors College",
    university: "City University of New York (CUNY)",
    parentSlug: "cuny-hunter-college",
    location: "New York, NY (across 8 CUNY campuses)",
    costNote: "Free tuition for all admits + $7,500 'Opportunity Fund' for study abroad, research, internships. A laptop is included. About 87% of graduates leave debt-free.",
    admissionNote: "About 24% acceptance rate. NY residents preferred but out-of-state admitted. Strong SAT/ACT scores, 95+ GPA, and a sharp set of essays expected.",
    highlights: [
      "Free tuition is unconditional — not tied to GPA renewal",
      "Cohort of ~520 per year across the CUNY system, with shared honors curriculum",
      "Manhattan, Brooklyn, Queens, Staten Island campuses — your home base is one of Hunter, Baruch, Brooklyn, Queens, City, Lehman, John Jay, College of Staten Island",
      "Strong pre-med, public policy, journalism, and finance pipelines via NYC employers",
    ],
    ideallySuits: "High-stat NYC-area students, low-to-middle-income families anywhere who want the NYC experience without the Columbia/NYU debt load, and first-gen applicants drawn to a structured cohort.",
  },
  {
    id: "schreyer-penn-state",
    name: "Schreyer Honors College",
    university: "Pennsylvania State University",
    parentSlug: "pennsylvania-state-university-main-campus",
    location: "University Park, PA",
    costNote: "Each Scholar receives a $5,000/year Academic Excellence Scholarship (renewable). Combined with in-state Penn State tuition, total cost is typically half a comparable private. Out-of-state Schreyer is still a strong value.",
    admissionNote: "About 8-10% acceptance rate. Requires top class rank, 1500+ SAT or 34+ ACT, two essays (one academic, one personal), and a teacher recommendation.",
    highlights: [
      "Dedicated Schreyer dorms for first-year scholars",
      "Required senior thesis — comparable to undergrad capstones at top liberal arts colleges",
      "Strong study-abroad and research-grant funding",
      "Direct access to Penn State's R1 research labs, but with a small-college academic culture",
    ],
    ideallySuits: "PA residents and out-of-state students drawn to Big Ten football culture + intensive academics. Especially strong for STEM, business (Smeal), and architecture.",
  },
  {
    id: "barrett-asu",
    name: "Barrett, the Honors College",
    university: "Arizona State University",
    parentSlug: "arizona-state-university",
    location: "Tempe, AZ (with smaller campuses at downtown Phoenix, Polytechnic, West)",
    costNote: "Honors-specific scholarships ($1,500-$3,500/yr); ASU base in-state tuition is ~$13K and out-of-state is ~$33K. Generous out-of-state merit aid layered on top can drop the bill significantly.",
    admissionNote: "Top public honors college nationally. Roughly 30% acceptance among ASU's much larger applicant pool. 3.7+ unweighted GPA and ~1300+ SAT typical.",
    highlights: [
      "Largest honors college in the US (~7,500 students) — large peer community of high-achievers",
      "Honors-only dorms, separate dining, dedicated faculty advisors",
      "Required honors thesis or creative project",
      "Disproportionate output of Fulbright, Truman, Goldwater, and Marshall scholarship winners",
    ],
    ideallySuits: "Students who want a big-school experience (D1 athletics, Greek life, hundreds of majors) plus the small-college academic environment honors provides. Great for STEM, business, journalism (Cronkite).",
  },
  {
    id: "umd-honors",
    name: "Honors College",
    university: "University of Maryland, College Park",
    parentSlug: "university-of-maryland-college-park",
    location: "College Park, MD",
    costNote: "No additional fee. In-state tuition ~$11K. Banneker-Key (full ride) and Presidential Scholarship (significant merit aid) are honors-adjacent awards for top admits.",
    admissionNote: "Top 10% of incoming UMD class is invited to honors at admission — no separate application. About 1,800 spots per cohort.",
    highlights: [
      "8 living-learning programs to choose from (Gemstone for research, Honors Humanities, Design Cultures + Creativity, etc.)",
      "Each LLP has its own dorm, curriculum, and faculty",
      "DC-area employer access for internships",
      "Strong in CS, engineering, business (Smith), public policy",
    ],
    ideallySuits: "Maryland residents (in-state cost + strong LLPs) and out-of-state students drawn to specific LLPs like Gemstone (4-year research project culminating in a thesis defense).",
  },
  {
    id: "plan-ii-ut-austin",
    name: "Plan II Honors",
    university: "University of Texas at Austin",
    parentSlug: "ut-austin",
    location: "Austin, TX",
    costNote: "Standard UT in-state tuition (~$11K) — no extra Plan II fee. The Liberal Arts Honors Scholarship and other UT merit awards apply.",
    admissionNote: "Direct-admit, separate from UT general admissions. Acceptance rate ~25%. Top 6% auto-admit rule does NOT apply to Plan II — everyone is holistic. Requires top GPA, strong SAT/ACT (~1400+), an additional essay.",
    highlights: [
      "Interdisciplinary liberal arts core — students design their own intellectual path",
      "Small seminars (15-20 students) with star faculty across departments",
      "Required thesis defended in front of a committee",
      "Alumni include Bill Moyers, Lawrence Wright, multiple Pulitzer winners",
    ],
    ideallySuits: "Texas residents and out-of-state humanities/social-science students. If you'd otherwise be looking at Brown's open curriculum or Stanford's IHUM but want the price of a state flagship.",
  },
  {
    id: "south-carolina-honors",
    name: "South Carolina Honors College",
    university: "University of South Carolina, Columbia",
    parentSlug: "university-of-south-carolina-columbia",
    location: "Columbia, SC",
    costNote: "In-state SC tuition (~$13K). Generous merit aid — McNair Scholarships cover full cost for top admits.",
    admissionNote: "About 25% acceptance rate within SC's broader admit pool. 1390+ SAT / 32+ ACT, top 10% class rank typical.",
    highlights: [
      "Required senior thesis or capstone",
      "Honors-only dorms and dining",
      "Strong in international business (Moore School ranks #1 in undergrad international business nationally), pre-med, and journalism",
      "Capstone Scholars program for students just below honors threshold",
    ],
    ideallySuits: "Southeastern students; first-gen students attracted to robust honors advising; pre-med applicants wanting strong med-school placement at low cost.",
  },
  {
    id: "uf-honors",
    name: "Honors Program",
    university: "University of Florida",
    parentSlug: "university-of-florida",
    location: "Gainesville, FL",
    costNote: "In-state ~$6K (one of the cheapest top publics in the US). Bright Futures (FL state) + UF Honors stack — many in-state students attend nearly free.",
    admissionNote: "About 1,000 spots per year. Top 10% of admitted UF class. ~1430 SAT / 32 ACT, 4.5+ weighted GPA typical.",
    highlights: [
      "Honors-only housing in Hume Hall",
      "Smaller honors seminars across general-ed requirements",
      "Pre-Health Honors track is one of the strongest in the country",
      "Lombardi Scholars (separate) is the full-ride sibling",
    ],
    ideallySuits: "Florida residents (the in-state value is unbeatable); high-stat out-of-state applicants who want a Big Ten/SEC athletic experience plus strong academics.",
  },
  {
    id: "clemson-calhoun",
    name: "Calhoun Honors College",
    university: "Clemson University",
    parentSlug: "clemson-university",
    location: "Clemson, SC",
    costNote: "Standard in-state tuition (~$15K). National Scholars Program (separate, very competitive) is a full ride. Merit aid is layered for honors admits.",
    admissionNote: "About 5-10% of Clemson's admitted class. Typical profile: 1450+ SAT, top 5% class rank.",
    highlights: [
      "Required senior thesis",
      "Dedicated study-abroad funding",
      "Strong engineering and business cohorts",
      "Smaller liberal-arts feel in a large football-culture school",
    ],
    ideallySuits: "Students drawn to SEC/ACC-style game-day school spirit who want intensive academics on top.",
  },
  {
    id: "indiana-hutton",
    name: "Hutton Honors College",
    university: "Indiana University Bloomington",
    parentSlug: "indiana-university-bloomington",
    location: "Bloomington, IN",
    costNote: "No additional fee. In-state ~$12K; out-of-state ~$40K but generous merit ($6-26K/yr) for honors admits.",
    admissionNote: "Open to all admitted IU students who hit ~3.8 weighted GPA + 1370 SAT / 30 ACT. No separate application required.",
    highlights: [
      "Hutton seminars (15-student classes) across every department",
      "Strong international experience funding",
      "Kelley School of Business direct-admit overlap (one of the top undergrad business programs)",
      "Free passes to IU performing arts shows and museums",
    ],
    ideallySuits: "Students wanting Big Ten experience with strong business/arts/sciences across disciplines. Especially good for music, business, and global studies.",
  },
  {
    id: "alabama-honors",
    name: "Honors College",
    university: "University of Alabama",
    parentSlug: "university-of-alabama",
    location: "Tuscaloosa, AL",
    costNote: "Alabama's out-of-state auto-merit is the cheat code: a 3.5 GPA + 1300 SAT = $24K/yr scholarship (essentially free out-of-state tuition). Honors students are typically in the highest scholarship tier.",
    admissionNote: "Roughly 30% of the Alabama incoming class. Acceptance is automatic if you hit GPA + test thresholds — no separate essay.",
    highlights: [
      "Honors-specific dorms",
      "Randall Research Scholars Program for in-depth undergraduate research",
      "Strong in business (Culverhouse), nursing, communications",
      "One of the largest honors colleges by enrollment — robust community",
    ],
    ideallySuits: "Out-of-state high-stat students looking for the cheapest path to a major-state-school experience. The auto-merit makes Alabama Honors one of the highest-ROI options in the country for non-residents.",
  },
];

export default function HonorsCollegesPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best US Honors Colleges 2026",
    description:
      "Top 10 US public-university honors colleges, with admission requirements, scholarships, and what each suits.",
    numberOfItems: PROGRAMS.length,
    itemListElement: PROGRAMS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOccupationalProgram",
        name: `${p.name} at ${p.university}`,
        url: p.parentSlug
          ? `https://www.kidtocollege.com/college/${p.parentSlug}`
          : undefined,
      },
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an honors college?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An honors college is a separately-admitted academic program inside a larger university that offers smaller classes, dedicated dorms, special advising, research opportunities, and often scholarships. Students earn a regular university degree plus an honors distinction. The goal is to give high-achieving students the intimate liberal-arts-college experience inside the resources of a major research university — typically at in-state public tuition.",
        },
      },
      {
        "@type": "Question",
        name: "Is an honors college worth it vs an Ivy League school?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Often yes — financially. A four-year cost at Macaulay (CUNY) or in-state UF Honors can be under $25,000 total vs $300,000+ at an Ivy. Outcomes for the strongest honors colleges are competitive with selective privates for graduate-school placement and starting salary, especially in STEM, business, and pre-health. The Ivy still wins on alumni network reach and access to selective firms that recruit only at Ivies.",
        },
      },
      {
        "@type": "Question",
        name: "How hard is it to get into an honors college?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most top honors colleges admit 8-30% of applicants — meaningfully easier than the most selective private schools but still competitive. Typical profile: 3.8+ unweighted GPA, 1400+ SAT or 31+ ACT, top 10% class rank, plus essays specific to honors. Some (like UMD Honors) auto-admit the top 10% of the university's accepted class without a separate application.",
        },
      },
      {
        "@type": "Question",
        name: "Do honors colleges cost extra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most do not. A small handful charge a modest honors program fee ($500-$1,500/year). Several (Macaulay, Schreyer, FU Bright Futures stack) actually result in lower net cost than non-honors students at the same school because of associated scholarships.",
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
              The Ivy alternative
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Honors Colleges 2026
            </h1>
            <p className="font-body text-xl text-white/70 max-w-3xl leading-relaxed">
              An honors college inside a major state university often gives you
              90% of the Ivy League experience — small classes, dedicated
              advisors, undergraduate research, study-abroad funding, dedicated
              dorms — at 30% of the cost. Macaulay (CUNY) graduates 87% of its
              students debt-free. Most families have never heard of it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* TL;DR comparison strip */}
      <section className="py-10 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  $25K
                </p>
                <p className="font-body text-sm text-navy/60">
                  total 4-year cost at Macaulay (CUNY), vs $300K at peer privates
                </p>
              </div>
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  87%
                </p>
                <p className="font-body text-sm text-navy/60">
                  of Macaulay graduates leave debt-free
                </p>
              </div>
              <div>
                <p className="font-mono-label text-3xl font-bold text-gold mb-1">
                  ~25%
                </p>
                <p className="font-body text-sm text-navy/60">
                  typical honors-college acceptance rate (vs &lt;10% at peer Ivies)
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick jump nav */}
      <section className="py-8 border-b border-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-3">
            Jump to a program
          </p>
          <div className="flex flex-wrap gap-2">
            {PROGRAMS.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="font-body text-sm text-navy hover:text-gold border border-card px-3 py-1.5 rounded-md transition-colors bg-white"
              >
                {p.name} ({p.university.split(" of ")[1]?.split(",")[0] ?? p.university.split(" ")[0]})
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {PROGRAMS.map((p) => (
            <FadeIn key={p.id}>
              <article id={p.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2 leading-tight">
                  {p.name}
                </h2>
                <p className="font-body text-base text-navy/70 mb-1">
                  {p.parentSlug ? (
                    <Link
                      href={`/college/${p.parentSlug}`}
                      className="hover:text-gold underline underline-offset-2"
                    >
                      {p.university}
                    </Link>
                  ) : (
                    p.university
                  )}
                </p>
                <p className="font-body text-sm text-navy/50 mb-6">{p.location}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="ktc-card p-5">
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                      Cost & aid
                    </h3>
                    <p className="font-body text-sm text-navy/80 leading-relaxed">
                      {p.costNote}
                    </p>
                  </div>
                  <div className="ktc-card p-5">
                    <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                      Getting in
                    </h3>
                    <p className="font-body text-sm text-navy/80 leading-relaxed">
                      {p.admissionNote}
                    </p>
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-navy mb-3">
                  What you get
                </h3>
                <ul className="space-y-2 mb-6">
                  {p.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-3 font-body text-sm text-navy/80"
                    >
                      <span className="text-gold flex-shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="ktc-card p-5 bg-cream/50">
                  <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                    Ideally suits
                  </h3>
                  <p className="font-body text-sm text-navy/80 leading-relaxed">
                    {p.ideallySuits}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Methodology / context */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-4">
              Why honors colleges fly under the radar
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-4">
              College rankings rank universities. They don&apos;t rank the
              honors college inside the university. So a high-achieving student
              comparing &quot;Penn State&quot; to &quot;Brown&quot; sees only the
              30%-vs-7% acceptance rate gap and rules Penn State out without
              ever realising the relevant comparison is &quot;Schreyer at Penn
              State&quot; (8-10% acceptance, $5,000/yr scholarship, required
              thesis, dedicated dorms) — which is much closer to Brown
              academically and dramatically cheaper.
            </p>
            <p className="font-body text-navy/70 leading-relaxed mb-4">
              Most honors colleges are also direct-admit at the start of
              college, with their own scholarship sequence. So unlike chasing
              Ivy admission post-application, you can be a competitive honors
              applicant with a clear, transparent admissions standard — 1400+
              SAT, 3.8+ GPA, two solid essays for most of the programs above.
            </p>
            <p className="font-body text-sm text-navy/40 mt-6 italic">
              Last updated: November 2025. Admission criteria and scholarships
              vary year to year — always verify with each program directly.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Related links */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-base font-bold text-navy mb-4">
            Related guides
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/best-colleges" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">All Best-Colleges lists</Link>
            <Link href="/my-chances" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Check your chances</Link>
            <Link href="/scholarships" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Find scholarships</Link>
            <Link href="/financial-aid/calculator" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Net price calculator</Link>
            <Link href="/blog/how-to-pay-for-college-2026" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">How to pay for college 2026</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
