import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { createServiceRoleClient } from "@/lib/supabase-server";
import {
  HOW_TO_GET_IN,
  getHowToGetIn,
} from "@/lib/how-to-get-in-data";
import { breadcrumbsLd } from "@/lib/structured-data";

export const revalidate = 86400;

export function generateStaticParams() {
  return HOW_TO_GET_IN.map((e) => ({ slug: e.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CollegeRow {
  slug: string;
  name: string;
  location: string | null;
  acceptance_rate: number | null;
  avg_cost_instate: number | null;
  avg_cost_outstate: number | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getHowToGetIn(slug);
  if (!entry) return {};

  // Fetch the college's display name for metadata
  let collegeName = slug;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("name")
        .eq("slug", slug)
        .single();
      if (data?.name) collegeName = data.name;
    } catch {}
  }

  return {
    title: `How to Get Into ${collegeName} 2026: A Realistic Admissions Guide`,
    description: `Concrete steps, common mistakes, and a borderline-applicant reality check for getting into ${collegeName}. Free, no sign-up.`,
    alternates: {
      canonical: `https://www.kidtocollege.com/how-to-get-into/${slug}`,
    },
  };
}

export default async function HowToGetIntoPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getHowToGetIn(slug);
  if (!entry) notFound();

  let college: CollegeRow | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("colleges")
        .select("slug, name, location, acceptance_rate, avg_cost_instate, avg_cost_outstate")
        .eq("slug", slug)
        .single();
      if (data) college = data as CollegeRow;
    } catch {}
  }

  const collegeName = college?.name ?? slug.replace(/-/g, " ");

  const breadcrumbs = breadcrumbsLd([
    { label: "Home", path: "/" },
    { label: "How to Get In", path: "/how-to-get-into" },
    { label: collegeName },
  ]);

  // FAQ schema derived from the editorial content
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What GPA do you need to get into ${collegeName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.angle,
        },
      },
      {
        "@type": "Question",
        name: `What are the biggest mistakes applying to ${collegeName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.mistakes.join(" "),
        },
      },
      {
        "@type": "Question",
        name: `Is ${collegeName} worth applying to if I'm a borderline applicant?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.borderline,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <nav className="font-mono-label text-xs uppercase tracking-wider text-white/30 mb-6">
              <Link href="/" className="hover:text-white/50 transition-colors">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/how-to-get-into" className="hover:text-white/50 transition-colors">
                How to Get In
              </Link>{" "}
              / <span className="text-white/50">{collegeName}</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              How to get into {collegeName}
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/70 leading-relaxed">
              {entry.hook}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats from DB */}
      {college && (
        <section className="py-8 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="flex flex-wrap gap-6 sm:gap-10">
                {college.acceptance_rate != null && (
                  <div>
                    <p className="font-mono-label text-gold text-2xl sm:text-3xl font-bold">
                      {college.acceptance_rate}%
                    </p>
                    <p className="font-body text-sm text-navy/50">Acceptance rate</p>
                  </div>
                )}
                {college.avg_cost_instate != null && (
                  <div>
                    <p className="font-mono-label text-gold text-2xl sm:text-3xl font-bold">
                      ${college.avg_cost_instate.toLocaleString()}
                    </p>
                    <p className="font-body text-sm text-navy/50">In-state cost</p>
                  </div>
                )}
                {college.avg_cost_outstate != null &&
                  college.avg_cost_outstate !== college.avg_cost_instate && (
                    <div>
                      <p className="font-mono-label text-gold text-2xl sm:text-3xl font-bold">
                        ${college.avg_cost_outstate.toLocaleString()}
                      </p>
                      <p className="font-body text-sm text-navy/50">Out-of-state cost</p>
                    </div>
                  )}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Angle */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
              What makes {collegeName} admissions different
            </h2>
            <p className="font-body text-lg text-navy/80 leading-relaxed">
              {entry.angle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
              What an actually competitive application looks like
            </h2>
            <ol className="space-y-4">
              {entry.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 font-mono-label text-gold font-bold w-8 text-lg">
                    {i + 1}.
                  </span>
                  <p className="font-body text-navy/80 leading-relaxed flex-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      {/* Mistakes */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
              Common mistakes that hurt applicants here
            </h2>
            <ul className="space-y-3">
              {entry.mistakes.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 text-gold mt-1.5">✕</span>
                  <p className="font-body text-navy/80 leading-relaxed flex-1">
                    {m}
                  </p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Borderline */}
      <section className="py-12 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              If you&apos;re on the bubble
            </h2>
            <p className="font-body text-lg text-white/80 leading-relaxed">
              {entry.borderline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Next steps */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h3 className="font-display text-xl font-bold text-navy mb-4">
              Next steps
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/college/${slug}`}
                className="px-5 py-3 bg-gold hover:bg-gold/90 text-navy font-body font-medium rounded-md transition-colors text-sm"
              >
                Full {collegeName} profile &rarr;
              </Link>
              <Link
                href="/my-chances"
                className="px-5 py-3 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
              >
                Check your chances
              </Link>
              <Link
                href="/coach/essay"
                className="px-5 py-3 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
              >
                Essay help
              </Link>
              <Link
                href="/scholarships"
                className="px-5 py-3 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
              >
                Find scholarships
              </Link>
              <Link
                href="/how-to-get-into"
                className="px-5 py-3 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors bg-white"
              >
                Other schools
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
