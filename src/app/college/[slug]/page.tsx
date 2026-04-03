import type { Metadata } from "next";
import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { FadeIn } from "@/components/FadeIn";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import { fetchScorecardData } from "@/lib/collegeScorecard";
import { AddToListButton } from "@/components/AddToListButton";
import { CollegeRequirements } from "@/components/CollegeRequirements";
import CollegeTravelInfo from "@/components/CollegeTravelInfo";
import type { College, ScholarshipResult } from "@/lib/types";

export const revalidate = 86400;

export async function generateStaticParams() {
  // Try Supabase for full list, fall back to seed
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("slug")
        .order("slug");
      if (data && data.length > 0) {
        return data.map((c) => ({ slug: c.slug }));
      }
    } catch {
      // Fall through to seed
    }
  }
  return COLLEGES_SEED.map((c) => ({ slug: c.slug }));
}

interface CollegePageProps {
  params: Promise<{ slug: string }>;
}

function hasSupabase() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function generateMetadata({
  params,
}: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;

  let college: { name: string; location: string; state: string } | null = null;
  if (hasSupabase()) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("name, location, state")
        .eq("slug", slug)
        .single();
      college = data;
    } catch {
      // Fall through to seed
    }
  }

  // Fall back to seed data
  if (!college) {
    const seed = COLLEGES_SEED.find((c) => c.slug === slug);
    if (seed) {
      college = { name: seed.name, location: seed.location, state: seed.state };
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidtocollege.com";
  const canonicalUrl = `${siteUrl}/college/${slug}`;

  if (!college) {
    const readable = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return {
      title: `${readable} — Acceptance Rate, Costs & Admissions | KidToCollege`,
      description: `Acceptance rate, tuition costs, graduation rate and earnings data for ${readable}. Get a free personalised admissions report in minutes.`,
      alternates: { canonical: canonicalUrl },
    };
  }

  return {
    title: `${college.name} — Acceptance Rate, Costs & Admissions | KidToCollege`,
    description: `Acceptance rate, tuition costs, graduation rate and earnings data for ${college.name} in ${college.location}. Get a free personalised admissions report in minutes.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${college.name} — Acceptance Rate, Costs & Admissions | KidToCollege`,
      description: `Acceptance rate, tuition costs, graduation rate and earnings data for ${college.name}. Free personalised admissions report in minutes.`,
    },
  };
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="ktc-card p-5 text-center">
      <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
        {value ?? "N/A"}
      </p>
      <p className="text-navy/60 text-sm font-body mt-1">{label}</p>
    </div>
  );
}

function formatCurrency(amount: number | null) {
  if (amount == null) return "N/A";
  return `$${amount.toLocaleString()}`;
}

function formatPercent(rate: number | null) {
  if (rate == null) return "N/A";
  return `${rate}%`;
}

export default async function CollegePage({ params }: CollegePageProps) {
  const { slug } = await params;

  // Start with seed data (always available, synchronous)
  const seed = COLLEGES_SEED.find((c) => c.slug === slug);
  let collegeRow: Record<string, unknown> | null = seed
    ? { ...seed, last_updated: new Date().toISOString() }
    : null;

  // Try to upgrade with Supabase data (richer: scorecard, official_url, etc.)
  if (hasSupabase()) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) {
        collegeRow = data;
      }
    } catch {
      // Supabase unavailable — use seed data
    }
  }

  const college = collegeRow as College | null;

  // If no college found, show "Did you mean?" suggestions
  if (!college) {
    const searchTerm = slug.replace(/-/g, " ");
    const readable = searchTerm.replace(/\b\w/g, (c: string) => c.toUpperCase());

    // Fuzzy match against seed data (always available)
    let suggestions: { name: string; slug: string; location: string; acceptance_rate: number | null }[] = [];
    const termLower = searchTerm.toLowerCase();
    suggestions = COLLEGES_SEED.filter(
      (c) =>
        c.slug.includes(slug) ||
        c.name.toLowerCase().includes(termLower) ||
        termLower.split(" ").some((word) => word.length > 3 && c.name.toLowerCase().includes(word))
    )
      .slice(0, 3)
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        location: c.location,
        acceptance_rate: c.acceptance_rate,
      }));

    // Try Supabase fuzzy search for richer results
    if (hasSupabase() && suggestions.length < 3) {
      try {
        const supabase = createServiceRoleClient();
        const { data } = await supabase
          .from("colleges")
          .select("name, slug, location, acceptance_rate")
          .or(`slug.ilike.%${slug}%,name.ilike.%${searchTerm}%`)
          .limit(3);
        if (data && data.length > 0) {
          suggestions = data;
        }
      } catch {
        // Use seed suggestions
      }
    }

    return (
      <div className="min-h-screen bg-white">
        <section className="py-32 sm:py-40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
                College Profile
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-4 mb-4">
                We couldn&apos;t find &ldquo;{readable}&rdquo;
              </h1>

              {suggestions.length > 0 ? (
                <>
                  <p className="text-navy/60 font-body mb-10">
                    Did you mean one of these?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                    {suggestions.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/college/${s.slug}`}
                        className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors mb-1">
                          {s.name}
                        </h3>
                        <p className="font-body text-sm text-navy/50 mb-2">
                          {s.location}
                        </p>
                        {s.acceptance_rate != null && (
                          <p className="font-mono-label text-xs text-gold">
                            {s.acceptance_rate}% acceptance rate
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-navy/60 font-body mb-10">
                  We don&apos;t have a profile for this college yet, but our AI
                  can research it for you in minutes.
                </p>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href={`/search?college=${encodeURIComponent(readable)}`}
                  className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
                >
                  Research this college &rarr;
                </Link>
                <Link
                  href="/search"
                  className="bg-white hover:bg-cream text-navy font-body font-medium px-8 py-4 rounded-md transition-colors border border-card"
                >
                  Search all colleges
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    );
  }

  // Fetch cached AI results for scholarships and Q&A
  let cachedScholarships: ScholarshipResult[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cachedCC: any = null;
  let questions: { question: string; answer: string; created_at: string }[] | null = null;

  if (hasSupabase()) {
    try {
      const supabase = createServiceRoleClient();
      const cachePrefix = college.name.toLowerCase().trim() + "::";
      const { data: cachedResults } = await supabase
        .from("results")
        .select("raw_ai_response, scholarships_json, cc_gateway_json")
        .ilike("cache_key", `${cachePrefix}%`)
        .order("created_at", { ascending: false })
        .limit(1);

      const row = cachedResults?.[0];
      cachedScholarships =
        row?.scholarships_json || (row?.raw_ai_response as Record<string, unknown>)?.scholarships as ScholarshipResult[] || [];
      cachedCC = row?.cc_gateway_json || (row?.raw_ai_response as Record<string, unknown>)?.cc_gateway || null;

      const { data: qData } = await supabase
        .from("questions")
        .select("question, answer, created_at")
        .eq("college_slug", slug)
        .order("created_at", { ascending: false })
        .limit(10);
      questions = qData;
    } catch {
      // Supabase unavailable — render without cached data
    }
  }

  // Refresh Scorecard data if stale (>7 days) — fire and forget
  if (hasSupabase() && college) {
    try {
      const needsRefresh =
        !college.scorecard_last_updated ||
        new Date(college.scorecard_last_updated) <
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      if (needsRefresh) {
        fetchScorecardData(college.name)
          .then((scorecard) => {
            if (scorecard) {
              const supabase = createServiceRoleClient();
              supabase
                .from("colleges")
                .update({
                  median_earnings_6yr: scorecard.medianEarnings6yr,
                  median_earnings_10yr: scorecard.medianEarnings10yr,
                  employment_rate: scorecard.employmentRate,
                  graduation_rate_4yr: scorecard.graduationRate4yr,
                  loan_default_rate: scorecard.loanDefaultRate,
                  scorecard_last_updated: new Date().toISOString(),
                })
                .eq("slug", slug)
                .then(() => {});
            }
          })
          .catch(() => {});
      }
    } catch {
      // Skip scorecard refresh if unavailable
    }
  }

  const defaultPhoto = "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80";
  const heroImage =
    college.photo_url && college.photo_url !== defaultPhoto
      ? college.photo_url
      : defaultPhoto;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidtocollege.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: college.location,
      addressRegion: college.state,
    },
    url: `${siteUrl}/college/${slug}`,
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Full-bleed hero */}
      <section
        className="parallax-section relative min-h-[50vh] sm:min-h-[60vh] flex items-end"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Link
          href="/colleges"
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all"
        >
          &larr; All Colleges
        </Link>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 w-full">
          <FadeIn>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {college.name}
            </h1>
            <p className="mt-2 text-white/70 font-body text-lg">
              {college.location}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                label="Acceptance Rate"
                value={formatPercent(college.acceptance_rate)}
              />
              <StatCard
                label="Avg Cost (In-State)"
                value={formatCurrency(college.avg_cost_instate)}
              />
              <StatCard
                label="Avg Cost (Out-of-State)"
                value={formatCurrency(college.avg_cost_outstate)}
              />
              <StatCard
                label="Graduation Rate"
                value={formatPercent(college.graduation_rate)}
              />
              <StatCard
                label="Total Enrollment"
                value={
                  college.total_enrollment
                    ? college.total_enrollment.toLocaleString()
                    : "N/A"
                }
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {college.official_url && (
                <a
                  href={college.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
                >
                  Official Website &rarr;
                </a>
              )}
              <AddToListButton collegeSlug={slug} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Programs */}
      {college.programs && college.programs.length > 0 && (
        <section className="py-12 sm:py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                Popular programs
              </h2>
              <div className="flex flex-wrap gap-2">
                {college.programs.map((program: string) => (
                  <span
                    key={program}
                    className="font-body text-sm bg-white text-navy px-3 py-1.5 rounded-full border border-card"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Application Requirements */}
      <CollegeRequirements slug={slug} />

      {/* Travel Info */}
      <CollegeTravelInfo collegeState={college.state} />

      {/* Graduate Outcomes — College Scorecard */}
      {(college.median_earnings_6yr != null ||
        college.median_earnings_10yr != null ||
        college.employment_rate != null ||
        college.graduation_rate_4yr != null) && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-2">
                Graduate outcomes
              </h2>
              <p className="text-sm font-body text-navy/50 mb-6">
                Source: U.S. Department of Education College Scorecard
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {college.median_earnings_6yr != null && (
                  <div className="ktc-card p-5 text-center">
                    <svg
                      className="w-6 h-6 text-gold mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                      />
                    </svg>
                    <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                      {formatCurrency(college.median_earnings_6yr)}
                    </p>
                    <p className="text-navy font-body text-sm font-medium mt-1">
                      Median Earnings at 6 Years
                    </p>
                    <p className="text-navy/50 text-xs font-body mt-1">
                      median graduate salary 6 years after starting
                    </p>
                  </div>
                )}
                {college.median_earnings_10yr != null && (
                  <div className="ktc-card p-5 text-center">
                    <svg
                      className="w-6 h-6 text-gold mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                      />
                    </svg>
                    <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                      {formatCurrency(college.median_earnings_10yr)}
                    </p>
                    <p className="text-navy font-body text-sm font-medium mt-1">
                      Median Earnings at 10 Years
                    </p>
                    <p className="text-navy/50 text-xs font-body mt-1">
                      median graduate salary 10 years after starting
                    </p>
                  </div>
                )}
                {college.employment_rate != null && (
                  <div className="ktc-card p-5 text-center">
                    <svg
                      className="w-6 h-6 text-gold mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                      {Math.round(college.employment_rate * 100)}%
                    </p>
                    <p className="text-navy font-body text-sm font-medium mt-1">
                      Employment Rate
                    </p>
                    <p className="text-navy/50 text-xs font-body mt-1">
                      graduates employed 2 years after completion
                    </p>
                  </div>
                )}
                {college.graduation_rate_4yr != null && (
                  <div className="ktc-card p-5 text-center">
                    <svg
                      className="w-6 h-6 text-gold mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                      />
                    </svg>
                    <p className="font-mono-label text-gold text-xl sm:text-2xl font-bold">
                      {Math.round(college.graduation_rate_4yr * 100)}%
                    </p>
                    <p className="text-navy font-body text-sm font-medium mt-1">
                      4-Year Graduation Rate
                    </p>
                    <p className="text-navy/50 text-xs font-body mt-1">
                      students completing degree within 4 years
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs font-body text-navy/40 mt-4">
                Data from{" "}
                <a
                  href="https://collegescorecard.ed.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline underline-offset-2"
                >
                  U.S. Department of Education College Scorecard
                </a>
                . Figures represent recent cohorts and may not reflect current
                outcomes.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Scholarships from cached AI results */}
      {cachedScholarships.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                Scholarships at {college.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cachedScholarships.map((s) => (
                  <div key={s.name} className="ktc-card p-6">
                    <h3 className="font-display text-lg font-bold text-navy mb-2">
                      {s.name}
                    </h3>
                    <p className="font-mono-label text-gold font-bold mb-2">
                      {s.amount}
                    </p>
                    <span className="inline-block font-mono-label text-xs px-2 py-0.5 rounded bg-gold/20 text-navy mb-3">
                      {s.type}
                    </span>
                    <p className="text-sm font-body text-navy/70 mb-2">
                      {s.eligibility}
                    </p>
                    <p className="text-xs font-body text-navy/50">
                      Deadline: {s.deadline}
                    </p>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-body text-gold hover:text-gold/80 transition-colors"
                      >
                        Learn more
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Community college feeder routes */}
      {cachedCC && (
        <section className="py-12 sm:py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                Community college transfer route
              </h2>
              <div className="ktc-card p-6 sm:p-8">
                <p className="font-body text-navy/80 mb-4">
                  {cachedCC.transfer_route_description}
                </p>
                {cachedCC.community_colleges &&
                  cachedCC.community_colleges.length > 0 && (
                    <div className="mb-4">
                      <p className="font-body font-medium text-navy text-sm mb-2">
                        Feeder community colleges:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cachedCC.community_colleges.map((cc: string) => (
                          <span
                            key={cc}
                            className="font-body text-sm bg-sage/10 text-sage px-3 py-1.5 rounded-full"
                          >
                            {cc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {cachedCC.cost_comparison && (
                  <p className="text-sm font-body text-navy/60">
                    <span className="font-medium text-navy">Cost savings: </span>
                    {cachedCC.cost_comparison}
                  </p>
                )}
                {cachedCC.transfer_success_rate && (
                  <p className="text-sm font-body text-navy/60 mt-2">
                    <span className="font-medium text-navy">
                      Transfer success rate:{" "}
                    </span>
                    {cachedCC.transfer_success_rate}
                  </p>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Anonymised Q&A */}
      {questions && questions.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                Questions families have asked
              </h2>
              <div className="space-y-4">
                {questions.map(
                  (
                    q: { question: string; answer: string; created_at: string },
                    i: number
                  ) => (
                    <div key={i} className="ktc-card p-6">
                      <p className="font-body font-medium text-navy mb-2">
                        {q.question}
                      </p>
                      <p className="font-body text-sm text-navy/70">{q.answer}</p>
                    </div>
                  )
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* CTAs */}
      <section className="py-16 sm:py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to dig deeper?
            </h2>
            <p className="text-white/60 font-body mb-8">
              Get your personalised research report for{" "}
              {college.name} — scholarships, admissions strategy, costs, and a
              step-by-step playbook.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/search?college=${encodeURIComponent(college.name)}`}
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                Research this college &rarr;
              </Link>
              <Link
                href="/coach/roadmap"
                className="bg-white/10 hover:bg-white/20 text-white font-body font-medium px-8 py-4 rounded-md transition-colors border border-white/20"
              >
                Get your personalised roadmap
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
