import type { Metadata } from "next";
import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { FadeIn } from "@/components/FadeIn";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import type { College, ScholarshipResult } from "@/lib/types";

export const revalidate = 86400; // ISR: revalidate every 24 hours

export async function generateStaticParams() {
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
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("colleges")
      .select("name, location, state")
      .eq("slug", slug)
      .single();
    college = data;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kidtocollege.com";
  const canonicalUrl = `${siteUrl}/college/${slug}`;

  if (!college) {
    const readable = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return {
      title: `${readable} — KidToCollege`,
      description: `Research ${readable} with KidToCollege. Get personalised admissions data, scholarships, and a step-by-step playbook.`,
      alternates: { canonical: canonicalUrl },
    };
  }

  return {
    title: `${college.name} — KidToCollege`,
    description: `Everything you need to know about ${college.name} in ${college.location}, ${college.state}. Admissions data, costs, scholarships, and personalised guidance.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${college.name} — KidToCollege`,
      description: `Research ${college.name}: acceptance rate, costs, scholarships, and community college transfer routes.`,
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

  let collegeRow = null;
  if (hasSupabase()) {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("colleges")
      .select("*")
      .eq("slug", slug)
      .single();
    collegeRow = data;
  }

  const college = collegeRow as College | null;

  // If no college found, show generic research CTA page
  if (!college) {
    const readable = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return (
      <div className="min-h-screen bg-white">
        <section className="py-32 sm:py-40 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
                College Profile
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-4 mb-6">
                {readable}
              </h1>
              <p className="text-navy/60 font-body mb-8 max-w-xl mx-auto">
                We don&apos;t have a full profile for this college yet, but our AI
                can research it for your student in minutes. Get personalised
                admissions data, scholarships, costs, and a step-by-step playbook.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href={`/search?college=${encodeURIComponent(readable)}`}
                  className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
                >
                  Research this college for my student &rarr;
                </Link>
                <Link
                  href="/coach/roadmap"
                  className="bg-white hover:bg-cream text-navy font-body font-medium px-8 py-4 rounded-md transition-colors border border-card"
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

  // Fetch cached AI results for scholarships and Q&A
  let cachedScholarships: ScholarshipResult[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cachedCC: any = null;
  let questions: { question: string; answer: string; created_at: string }[] | null = null;

  if (hasSupabase()) {
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 w-full">
          <FadeIn>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {college.name}
            </h1>
            <p className="mt-2 text-white/70 font-body text-lg">
              {college.location}, {college.state}
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
            {college.official_url && (
              <div className="mt-6 text-center">
                <a
                  href={college.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
                >
                  Official Website &rarr;
                </a>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Programs */}
      {college.programs && college.programs.length > 0 && (
        <section className="py-12 sm:py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                Programs offered
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
              Get a personalised research report for your student at{" "}
              {college.name} — scholarships, admissions strategy, costs, and a
              step-by-step playbook.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/search?college=${encodeURIComponent(college.name)}`}
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                Research this college for my student &rarr;
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
