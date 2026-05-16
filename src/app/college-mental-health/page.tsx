import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { breadcrumbsLd } from "@/lib/structured-data";
import {
  NATIONAL_RESOURCES,
  JED_CAMPUS_SLUGS,
  PRINCETON_REVIEW_MENTAL_HEALTH_SLUGS,
} from "@/lib/mental-health-data";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Mental Health Support at US Colleges: A 2026 Guide",
  description:
    "Crisis resources, campus mental health programs, JED Campus participants, and Princeton Review's mental-health-strongest colleges. Honest, free, no sign-up.",
  alternates: { canonical: "https://www.kidtocollege.com/college-mental-health" },
};

const breadcrumbs = breadcrumbsLd([
  { label: "Home", path: "/" },
  { label: "Mental Health" },
]);

async function fetchCollegeNames(slugs: string[]): Promise<Map<string, string>> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    slugs.length === 0
  ) {
    return new Map();
  }
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("colleges")
      .select("slug, name")
      .in("slug", slugs);
    const m = new Map<string, string>();
    for (const row of data ?? []) m.set(row.slug, row.name);
    return m;
  } catch {
    return new Map();
  }
}

export default async function CollegeMentalHealthPage() {
  const jedSlugs = Array.from(JED_CAMPUS_SLUGS).sort();
  const honorRollSlugs = Array.from(
    PRINCETON_REVIEW_MENTAL_HEALTH_SLUGS,
  ).sort();
  const nameMap = await fetchCollegeNames([...jedSlugs, ...honorRollSlugs]);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <nav className="font-mono-label text-xs uppercase tracking-wider text-white/30 mb-6">
              <Link href="/" className="hover:text-white/50 transition-colors">
                Home
              </Link>{" "}
              / <span className="text-white/50">Mental Health</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Mental Health Support at US Colleges
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/70 leading-relaxed">
              You or someone you know is struggling. This page lists the
              national crisis resources, the colleges with the strongest
              campus programs, and what to ask any school before you commit.
              Updated for 2026.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* In crisis right now */}
      <section className="bg-crimson py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              If you&apos;re in crisis right now
            </h2>
            <p className="font-body text-white/90 mb-6 leading-relaxed">
              These services are free, confidential, and available 24/7. You
              don&apos;t need a diagnosis or a referral to call.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                <p className="font-display text-2xl font-bold text-white mb-1">
                  988
                </p>
                <p className="font-body text-white/90 text-sm">
                  Suicide & Crisis Lifeline. Call or text 988 — 24/7, free,
                  confidential.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                <p className="font-display text-2xl font-bold text-white mb-1">
                  741741
                </p>
                <p className="font-body text-white/90 text-sm">
                  Crisis Text Line. Text HOME to 741741 — 24/7 trained crisis
                  counselors.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* National resources */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-3">
              National resources every college student should know
            </h2>
            <p className="font-body text-navy/70 mb-8 leading-relaxed">
              These resources work no matter which college you attend, and
              regardless of insurance status. Many work over text if calling
              feels too much.
            </p>
            <div className="space-y-4">
              {NATIONAL_RESOURCES.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block ktc-card p-5 group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-display text-lg font-bold text-navy group-hover:text-gold transition-colors">
                      {r.name}
                    </h3>
                    <span className="font-mono-label text-xs text-gold uppercase tracking-wider">
                      {r.contact}
                    </span>
                  </div>
                  <p className="font-body text-sm text-navy/70 leading-relaxed">
                    {r.description}
                  </p>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What to ask any school */}
      <section className="py-12 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
              Six questions to ask any college about mental health
            </h2>
            <ol className="space-y-4">
              {[
                "What is the typical wait time to see a counselor for a non-urgent appointment?",
                "Is there a session cap (some schools cap at 6–12 sessions per year)? What happens if I need more?",
                "Does the counseling center include psychiatric services and medication management on-site?",
                "What support exists for ADHD assessment, autism support, eating disorder treatment, and gender-affirming care specifically?",
                "Is there a 24/7 on-call counselor or after-hours crisis line dedicated to your campus?",
                "How does the school coordinate with the community when a student needs care beyond the counseling center?",
              ].map((q, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 font-mono-label text-gold font-bold w-8 text-lg">
                    {i + 1}.
                  </span>
                  <p className="font-body text-navy/80 leading-relaxed flex-1">
                    {q}
                  </p>
                </li>
              ))}
            </ol>
            <p className="font-body text-sm text-navy/60 mt-8 leading-relaxed italic">
              The answers vary dramatically. Two schools with similar reputations
              can have very different access. Ask the questions during visits
              and at admitted-student events.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* JED Campus list */}
      <section id="jed-campus" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-3">
              JED Campus participants
            </h2>
            <p className="font-body text-navy/70 mb-6 leading-relaxed">
              The JED Campus program is a 4-year strategic engagement run by
              the JED Foundation, helping universities build comprehensive
              mental-health support systems. Participating means a school has
              committed to ongoing review of its mental-health practices —
              including assessment of life-skills education, mental-health
              promotion, identification of at-risk students, increasing
              help-seeking behavior, providing substance-misuse support, and
              following crisis-management protocols.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {jedSlugs.map((slug) => {
                const name = nameMap.get(slug);
                if (!name) return null;
                return (
                  <Link
                    key={slug}
                    href={`/college/${slug}`}
                    className="font-body text-sm text-navy hover:text-gold transition-colors"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Honor roll list */}
      <section id="honor-roll" className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-3">
              Princeton Review&apos;s mental-health-strongest colleges
            </h2>
            <p className="font-body text-navy/70 mb-6 leading-relaxed">
              Based on student-survey responses about counseling availability,
              appointment wait times, and helpfulness of services. This list is
              published annually by Princeton Review based on responses from
              tens of thousands of students. These schools consistently rank in
              the upper tier for student-reported mental-health services.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {honorRollSlugs.map((slug) => {
                const name = nameMap.get(slug);
                if (!name) return null;
                return (
                  <Link
                    key={slug}
                    href={`/college/${slug}`}
                    className="font-body text-sm text-navy hover:text-gold transition-colors"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-navy mb-3">
              Looking at a specific school?
            </h2>
            <p className="font-body text-navy/60 mb-6">
              Every KidToCollege college page includes mental-health badges
              where applicable and the school&apos;s counseling center
              information.
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
