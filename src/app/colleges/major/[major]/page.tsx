import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { COLLEGES_SEED } from "@/lib/colleges-seed";
import { MAJOR_PAGES, getMajorBySlug } from "@/lib/major-pages-data";
import { careersForMajor, OUTLOOK_LABELS } from "@/lib/careers-data";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export function generateStaticParams() {
  return MAJOR_PAGES.map((m) => ({ major: m.slug }));
}

interface PageProps {
  params: Promise<{ major: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { major: slug } = await params;
  const major = getMajorBySlug(slug);
  if (!major) return {};

  return {
    title: `Best Colleges for ${major.label}: Rankings, Costs & Scholarships`,
    description: `Find the best ${major.label.toLowerCase()} programs in the US. Compare acceptance rates, tuition, scholarships, and career outcomes for top ${major.label.toLowerCase()} colleges — free on KidToCollege.`,
    alternates: {
      canonical: `https://www.kidtocollege.com/colleges/major/${slug}`,
    },
  };
}

function formatCurrency(n: number | null) {
  if (n == null) return "N/A";
  return `$${n.toLocaleString()}`;
}

export default async function MajorPage({ params }: PageProps) {
  const { major: slug } = await params;
  const major = getMajorBySlug(slug);
  if (!major) notFound();

  // Fetch colleges that offer this major
  type CollegeRow = {
    slug: string;
    name: string;
    location: string;
    acceptance_rate: number | null;
    avg_cost_instate: number | null;
    programs: string[] | null;
  };

  let colleges: CollegeRow[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();
      // Search for colleges with matching programs
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, location, acceptance_rate, avg_cost_instate, programs")
        .overlaps("programs", major.keywords)
        .order("total_enrollment", { ascending: false, nullsFirst: false })
        .limit(30);
      if (data) colleges = data as CollegeRow[];
    } catch {
      // Fall through to seed
    }
  }

  // Fallback to seed data
  if (colleges.length === 0) {
    const lowerKeywords = major.keywords.map((k) => k.toLowerCase());
    colleges = COLLEGES_SEED.filter((c) =>
      c.programs?.some((p) =>
        lowerKeywords.some((k) => p.toLowerCase().includes(k))
      )
    )
      .slice(0, 30)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        location: c.location,
        acceptance_rate: c.acceptance_rate,
        avg_cost_instate: c.avg_cost_instate,
        programs: c.programs,
      }));
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.kidtocollege.com" },
      { "@type": "ListItem", position: 2, name: "Colleges", item: "https://www.kidtocollege.com/colleges" },
      { "@type": "ListItem", position: 3, name: major.label, item: `https://www.kidtocollege.com/colleges/major/${slug}` },
    ],
  };

  // Course-collection schema: signals to Google that this is an authoritative
  // "Best X colleges" page for course/major search results.
  const courseListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    name: `Best Colleges for ${major.label}`,
    description: `Top US colleges offering ${major.label} programs, ranked by selectivity and enrollment.`,
    numberOfItems: colleges.length,
    itemListElement: colleges.slice(0, 10).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CollegeOrUniversity",
        name: c.name,
        url: `https://www.kidtocollege.com/college/${c.slug}`,
        address: c.location,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListLd) }}
      />

      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <nav className="font-mono-label text-xs uppercase tracking-wider text-white/30 mb-6">
              <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
              {" / "}
              <Link href="/colleges" className="hover:text-white/50 transition-colors">Colleges</Link>
              {" / "}
              <span className="text-white/50">{major.label}</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Best Colleges for {major.label} in 2025&ndash;26
            </h1>
            <p className="font-body text-xl text-white/60 max-w-2xl">
              {colleges.length} colleges with strong {major.label.toLowerCase()} programs, ranked by size and selectivity.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* College grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {colleges.length > 0 ? (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {colleges.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/college/${c.slug}`}
                    className="ktc-card p-5 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-1 leading-tight">
                      {c.name}
                    </h3>
                    <p className="font-body text-sm text-navy/50 mb-3">{c.location}</p>
                    <div className="flex items-center gap-4 text-xs font-body text-navy/40">
                      {c.acceptance_rate != null && (
                        <span>
                          <span className="font-medium text-navy/60">{c.acceptance_rate}%</span> acceptance
                        </span>
                      )}
                      {c.avg_cost_instate != null && (
                        <span>
                          <span className="font-medium text-navy/60">{formatCurrency(c.avg_cost_instate)}</span> in-state
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-navy/50 text-lg mb-4">
                We&apos;re still building our {major.label.toLowerCase()} college list.
              </p>
              <Link
                href="/colleges"
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
              >
                Browse all colleges &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Overview / longform (top majors only) */}
      {major.overview && (
        <section className="py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
                About {major.label.toLowerCase()} as a major
              </h2>
              <p className="font-body text-navy/80 leading-relaxed text-lg">
                {major.overview}
              </p>
              {(major.salaryRange || major.studyPath) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {major.salaryRange && (
                    <div className="ktc-card p-5">
                      <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                        Salary range
                      </h3>
                      <p className="font-body text-sm text-navy/80">{major.salaryRange}</p>
                    </div>
                  )}
                  {major.studyPath && (
                    <div className="ktc-card p-5">
                      <h3 className="font-mono-label text-xs uppercase tracking-wider text-gold mb-2">
                        Study path
                      </h3>
                      <p className="font-body text-sm text-navy/80">{major.studyPath}</p>
                    </div>
                  )}
                </div>
              )}
            </FadeIn>
          </div>
        </section>
      )}

      {/* How to choose */}
      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
              How to choose a {major.label.toLowerCase()} program
            </h2>
            <p className="font-body text-navy/80 leading-relaxed mb-6">
              {major.howToChoose}
            </p>
            <div className="ktc-card p-6">
              <h3 className="font-body font-medium text-navy mb-2">
                Common career paths for {major.label.toLowerCase()} graduates
              </h3>
              <p className="font-body text-sm text-navy/60">{major.careerPaths}</p>
            </div>
          </FadeIn>

          {careersForMajor(slug).length > 0 && (
            <FadeIn>
              <div className="mt-8">
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <h3 className="font-display text-xl font-bold text-navy">
                    Real careers, real salaries
                  </h3>
                  <Link
                    href={`/careers?major=${slug}`}
                    className="font-body text-sm text-gold hover:text-gold/80 whitespace-nowrap"
                  >
                    See all &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {careersForMajor(slug).slice(0, 6).map((c) => {
                    const outlook = OUTLOOK_LABELS[c.outlookLabel];
                    return (
                      <Link
                        key={c.slug}
                        href={`/careers/${c.slug}`}
                        className="ktc-card p-4 block group hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white"
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <span className="font-display text-sm font-bold text-navy group-hover:text-gold transition-colors leading-tight">
                            {c.title}
                          </span>
                          <span className="font-mono-label text-gold font-bold text-sm shrink-0">
                            ${Math.round(c.medianSalary / 1000)}K
                          </span>
                        </div>
                        <span className={`inline-block text-[10px] font-body font-medium px-2 py-0.5 rounded-full border ${outlook.color}`}>
                          {c.outlookPct > 0 ? "+" : ""}{c.outlookPct}% by 2032
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              Scholarships for {major.label.toLowerCase()} students
            </h2>
            <p className="font-body text-navy/60 mb-6">
              There are scholarships specifically for students studying {major.label.toLowerCase()}. Search our database to find awards you qualify for.
            </p>
            <Link
              href="/scholarships"
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors"
            >
              Find {major.label.toLowerCase()} scholarships &rarr;
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <Link href="/compare" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Compare colleges</Link>
            <Link href="/my-chances" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Check your chances</Link>
            <Link href="/financial-aid/calculator" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Net price calculator</Link>
            <Link href="/colleges" className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white">Browse all colleges</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
