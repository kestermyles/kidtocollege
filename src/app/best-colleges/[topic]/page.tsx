import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { createServiceRoleClient } from "@/lib/supabase-server";
import {
  BEST_COLLEGES_TOPICS,
  getBestCollegesTopic,
} from "@/lib/best-colleges-data";
import { breadcrumbsLd } from "@/lib/structured-data";

export const revalidate = 86400;

export function generateStaticParams() {
  return BEST_COLLEGES_TOPICS.map((t) => ({ topic: t.slug }));
}

interface PageProps {
  params: Promise<{ topic: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getBestCollegesTopic(slug);
  if (!topic) return {};
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: {
      canonical: `https://www.kidtocollege.com/best-colleges/${slug}`,
    },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      type: "article",
    },
  };
}

interface CollegeRow {
  slug: string;
  name: string;
  location: string | null;
  state: string | null;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
  avg_cost_outstate: number | null;
}

function formatCurrency(n: number | null) {
  if (n == null) return null;
  return `$${n.toLocaleString()}`;
}

export default async function BestCollegesTopicPage({ params }: PageProps) {
  const { topic: slug } = await params;
  const topic = getBestCollegesTopic(slug);
  if (!topic) notFound();

  // Fetch live college data for each entry in topic.colleges
  let colleges: Record<string, CollegeRow> = {};
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();
      const slugs = topic.colleges.map((c) => c.slug);
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, location, state, acceptance_rate, avg_cost_instate, avg_cost_outstate")
        .in("slug", slugs);
      if (data) {
        colleges = (data as CollegeRow[]).reduce<Record<string, CollegeRow>>((acc, row) => {
          acc[row.slug] = row;
          return acc;
        }, {});
      }
    } catch {
      // Render without live data — names + notes from curation file.
    }
  }

  const breadcrumbs = breadcrumbsLd([
    { label: "Home", path: "/" },
    { label: "Best Colleges", path: "/best-colleges" },
    { label: topic.h1.replace(" 2026", "") },
  ]);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.h1,
    description: topic.metaDescription,
    numberOfItems: topic.colleges.length,
    itemListElement: topic.colleges.map((c, i) => {
      const live = colleges[c.slug];
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CollegeOrUniversity",
          name: live?.name ?? c.slug,
          url: `https://www.kidtocollege.com/college/${c.slug}`,
          ...(live?.location ? { address: live.location } : {}),
        },
      };
    }),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
            <nav className="font-mono-label text-xs uppercase tracking-wider text-white/30 mb-6">
              <Link href="/" className="hover:text-white/50 transition-colors">
                Home
              </Link>
              {" / "}
              <Link
                href="/best-colleges"
                className="hover:text-white/50 transition-colors"
              >
                Best Colleges
              </Link>
              {" / "}
              <span className="text-white/50">{topic.h1.replace(" 2026", "")}</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              {topic.h1}
            </h1>
            <p className="font-body text-xl text-white/70 max-w-3xl leading-relaxed">
              {topic.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Ranked list */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="space-y-6">
            {topic.colleges.map((entry, i) => {
              const live = colleges[entry.slug];
              const rank = i + 1;
              return (
                <li key={entry.slug} className="ktc-card p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 font-mono-label text-3xl font-bold text-gold leading-none w-12">
                      #{rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/college/${entry.slug}`}
                        className="font-display text-xl sm:text-2xl font-bold text-navy hover:text-gold transition-colors block mb-1 leading-tight"
                      >
                        {live?.name ?? entry.slug}
                      </Link>
                      {live?.location && (
                        <p className="font-body text-sm text-navy/50 mb-3">
                          {live.location}
                        </p>
                      )}
                      <p className="font-body text-base text-navy/80 leading-relaxed mb-4">
                        {entry.note}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-body text-navy/40">
                        {live?.acceptance_rate != null && (
                          <span>
                            <span className="font-medium text-navy/60">
                              {live.acceptance_rate}%
                            </span>{" "}
                            acceptance
                          </span>
                        )}
                        {formatCurrency(live?.avg_cost_instate ?? null) && (
                          <span>
                            <span className="font-medium text-navy/60">
                              {formatCurrency(live?.avg_cost_instate ?? null)}
                            </span>{" "}
                            in-state
                          </span>
                        )}
                        {formatCurrency(live?.avg_cost_outstate ?? null) && (
                          <span>
                            <span className="font-medium text-navy/60">
                              {formatCurrency(live?.avg_cost_outstate ?? null)}
                            </span>{" "}
                            out-of-state
                          </span>
                        )}
                        <Link
                          href={`/college/${entry.slug}`}
                          className="text-gold hover:text-gold/80 font-medium"
                        >
                          Full profile &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              How we ranked
            </h2>
            <p className="font-body text-navy/70 leading-relaxed">
              {topic.methodology}
            </p>
            <p className="font-body text-sm text-navy/40 mt-6 italic">
              Last updated: November 2025. Live acceptance rates and tuition pulled from each college&apos;s most recent reporting.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
              Frequently asked
            </h2>
            <div className="space-y-6">
              {topic.faqs.map((f) => (
                <div key={f.q} className="ktc-card p-6">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    {f.q}
                  </h3>
                  <p className="font-body text-navy/70 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-10 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-base font-bold text-navy mb-4">
            Related guides
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/best-colleges"
              className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              All Best-Colleges lists
            </Link>
            <Link
              href="/my-chances"
              className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              Check your chances
            </Link>
            <Link
              href="/scholarships"
              className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              Find scholarships
            </Link>
            <Link
              href="/fafsa-guide"
              className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              FAFSA Guide
            </Link>
            <Link
              href="/compare"
              className="px-4 py-2 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
            >
              Compare colleges
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
