import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/FadeIn";
import { STATE_AID_DATA, getStateBySlug } from "@/lib/state-aid-data";

export function generateStaticParams() {
  return STATE_AID_DATA.map((s) => ({ state: s.slug }));
}

interface PageProps {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return { title: "State Aid Guide — KidToCollege" };

  return {
    title: `${state.name} Financial Aid Guide — KidToCollege`,
    description: `Complete guide to ${state.name} state grants, scholarships, and financial aid programs. Deadlines, eligibility, and tips for maximising aid.`,
    alternates: {
      canonical: `https://www.kidtocollege.com/financial-aid/${slug}`,
    },
  };
}

export default async function StateAidPage({ params }: PageProps) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <nav className="font-mono-label text-xs uppercase tracking-wider text-white/30 mb-6">
              <Link href="/" className="hover:text-white/50 transition-colors">
                Home
              </Link>{" "}
              /{" "}
              <Link
                href="/financial-aid"
                className="hover:text-white/50 transition-colors"
              >
                Financial Aid
              </Link>{" "}
              / <span className="text-white/50">{state.name}</span>
            </nav>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
              {state.name} Financial Aid
            </h1>
            <p className="font-body text-xl text-white/60 max-w-2xl">
              State grants, eligibility, deadlines, and strategies for{" "}
              {state.name} students
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Key info bar */}
      <section className="bg-cream border-b border-card py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 text-sm font-body">
            <div>
              <span className="text-navy/40">FAFSA deadline:</span>{" "}
              <span className="font-medium text-navy">
                {state.fafsaDeadline}
              </span>
            </div>
            <div>
              <span className="text-navy/40">State agency:</span>{" "}
              <a
                href={state.agencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold hover:text-gold/80 underline underline-offset-2"
              >
                {state.agencyName}
              </a>
            </div>
            {state.stateAppRequired && (
              <div>
                <span className="text-crimson font-medium">
                  Separate state application required
                </span>{" "}
                —{" "}
                <a
                  href={state.stateAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline"
                >
                  {state.stateAppName}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="font-body text-navy/80 text-lg leading-relaxed">
              {state.overview}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grant programs */}
      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
              {state.name} grant programs
            </h2>
          </FadeIn>

          <div className="space-y-6">
            {state.grants.map((grant, i) => (
              <FadeIn key={grant.name} delay={i * 0.08}>
                <div className="ktc-card p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <h3 className="font-display text-xl font-bold text-navy leading-tight">
                      {grant.name}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        grant.type === "need-based"
                          ? "bg-sage/15 text-sage"
                          : grant.type === "merit-based"
                          ? "bg-gold/15 text-gold"
                          : "bg-navy/10 text-navy/60"
                      }`}
                    >
                      {grant.type === "need-based"
                        ? "Need-based"
                        : grant.type === "merit-based"
                        ? "Merit-based"
                        : "Hybrid"}
                    </span>
                  </div>

                  <p className="font-display text-2xl font-bold text-gold mb-4">
                    {grant.amount}
                  </p>

                  <div className="mb-4">
                    <p className="font-body font-medium text-navy text-sm mb-2">
                      Eligibility
                    </p>
                    <ul className="space-y-1.5">
                      {grant.eligibility.map((req) => (
                        <li
                          key={req}
                          className="flex items-start gap-2 font-body text-sm text-navy/70"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-card">
                    <p className="font-body text-sm text-navy/60">
                      <span className="font-medium text-navy">Deadline:</span>{" "}
                      {grant.deadline}
                    </p>
                    <a
                      href={grant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-gold hover:text-gold/80 font-medium"
                    >
                      Official info &rarr;
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-6">
              Tips for maximising {state.name} aid
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {state.tips.map((tip, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-mono text-xs font-bold text-gold">
                      {i + 1}
                    </span>
                  </span>
                  <p className="font-body text-navy/80 leading-relaxed">
                    {tip}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4">
            <p className="text-sm text-amber-900">
              <strong>Educational guide only.</strong> State aid programs,
              amounts, and deadlines change annually. Always verify current
              information directly with{" "}
              <a
                href={state.agencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {state.agencyName}
              </a>{" "}
              and your college&apos;s financial aid office before making
              decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-16 sm:py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              Put this into action
            </h2>
            <p className="text-white/60 font-body mb-8">
              Find colleges in {state.name} that fit your budget, or learn more
              about the FAFSA process.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/search"
                className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
              >
                Find Your College &rarr;
              </Link>
              <Link
                href="/fafsa-guide"
                className="bg-white/10 hover:bg-white/20 text-white font-body font-medium px-8 py-4 rounded-md transition-colors border border-white/20"
              >
                FAFSA Guide
              </Link>
              <Link
                href="/financial-aid"
                className="bg-white/10 hover:bg-white/20 text-white font-body font-medium px-8 py-4 rounded-md transition-colors border border-white/20"
              >
                All State Guides
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
