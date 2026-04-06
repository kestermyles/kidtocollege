import { FadeIn } from "@/components/FadeIn";
import { PhotoSection } from "@/components/PhotoSection";
import { WizardPreview } from "@/components/WizardPreview";
import { LeagueRedirectInput } from "@/components/LeagueRedirectInput";
import Link from "next/link";
import { AskSamButton } from "@/components/AskSamButton";

const STATS = [
  { value: "2,942", label: "Colleges" },
  { value: "$50B", label: "In Scholarships" },
  { value: "100%", label: "Free" },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us about yourself",
    desc: "A quick, conversational wizard — not a form. Just the basics.",
  },
  {
    num: "02",
    title: "Get your AI research report",
    desc: "Specific to one college, one major, one student. Not generic matching.",
  },
  {
    num: "03",
    title: "Unlock your playbook",
    desc: "Insider moves, scholarship leads, and what to do right now.",
  },
  {
    num: "04",
    title: "Coach your way to admission",
    desc: "Essays, test prep, financial aid, interviews — the full private counsellor experience.",
  },
];

const FEATURES = [
  {
    title: "AI College Research",
    desc: "Deep research on any college + any major. Acceptance rates, costs, what admissions actually values.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "Scholarship Finder",
    desc: "Federal, national, state, local, activity-based, and hidden auto-merit awards most families miss.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "The Coach",
    desc: "Everything a $15K private counsellor does — roadmaps, essays, test prep, interviews, financial aid — free.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    title: "Smart Compare",
    desc: "Side-by-side comparison of up to 3 colleges. Costs, outcomes, fit — all in one view.",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
  },
  {
    title: "Community College Gateway",
    desc: "The 2+2 transfer route: same degree, lower cost. Always shown as the smart path it is.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    title: "Parent + Student Accounts",
    desc: "Shared dashboards, checklists, and deadlines. Both see everything. Work together.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section
        className="parallax-section relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1600&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <FadeIn>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white max-w-4xl leading-tight">
              Every kid deserves a shot at the{" "}
              <span className="text-gold italic">right college</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl font-body font-light leading-relaxed">
              Private college counsellors charge up to $15,000. We think every
              kid deserves the same advantage — for free.
            </p>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-8 sm:gap-12">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span className="font-mono-label text-gold text-2xl sm:text-3xl font-bold">
                    {stat.value}
                  </span>
                  <span className="block text-white/60 text-sm font-body mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/roadmap"
                className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md text-lg transition-colors"
              >
                See your roadmap &rarr;
              </Link>
              <AskSamButton />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <PhotoSection imageUrl="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-16">
              How it works
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="text-center">
                  <span className="font-mono-label text-gold text-sm">
                    {step.num}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-sm font-body">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </PhotoSection>

      {/* ===== COACH TEASER ===== */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
                  The Coach
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy mt-3 mb-6">
                  The $15,000 counsellor.{" "}
                  <span className="text-gold italic">Free.</span>
                </h2>
                <div className="space-y-4 text-navy/70 font-body">
                  <p>
                    Roadmaps. Essay coaching. Test prep strategy. Interview
                    preparation. Financial aid guidance. Letter of recommendation
                    strategy. A live application checklist.
                  </p>
                  <p>
                    Everything a private college counsellor charges families
                    $10,000 to $15,000 for — personalised to you, your
                    target college, your timeline.
                  </p>
                </div>
                <Link
                  href="/coach"
                  className="inline-block mt-8 bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
                >
                  Meet the Coach &rarr;
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "The Roadmap",
                  "The Essay",
                  "Test Prep",
                  "Interviews",
                  "Recommendations",
                  "Financial Aid",
                ].map((pillar) => (
                  <div key={pillar} className="ktc-card p-5 text-center">
                    <span className="font-display text-base font-bold text-navy">
                      {pillar}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 sm:py-28 bg-white border-t border-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
                Leveling the playing field, one family at a time
              </h2>
              <p className="mt-4 text-navy/60 font-body max-w-xl mx-auto">
                Free to use. 100% independent.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="ktc-card p-8">
                  <svg
                    className="w-8 h-8 text-gold mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={feature.icon}
                    />
                  </svg>
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-navy/60 text-sm font-body">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-20 sm:py-28 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-12">
              Built for families who can&apos;t afford to get this wrong
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="p-6">
                <p className="font-mono-label text-gold text-3xl sm:text-4xl font-bold mb-2">
                  2,942
                </p>
                <p className="font-body text-white/60 text-sm">
                  colleges tracked
                </p>
              </div>
              <div className="p-6">
                <p className="font-mono-label text-gold text-3xl sm:text-4xl font-bold mb-2">
                  $50B
                </p>
                <p className="font-body text-white/60 text-sm">
                  in scholarships searchable
                </p>
              </div>
              <div className="p-6">
                <p className="font-mono-label text-gold text-3xl sm:text-4xl font-bold mb-2">
                  100%
                </p>
                <p className="font-body text-white/60 text-sm">
                  free to use
                </p>
              </div>
            </div>
            <p className="font-display text-xl sm:text-2xl text-white/80 italic max-w-2xl mx-auto leading-relaxed">
              &ldquo;Private counsellors charge up to $15,000 for exactly
              what&apos;s here &mdash; for free.&rdquo;
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== WIZARD PREVIEW ===== */}
      <section className="py-20 sm:py-28 bg-white border-t border-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
                Research any college in minutes
              </h2>
              <p className="mt-4 text-navy/60 font-body max-w-xl mx-auto">
                Our AI does the work of a private counsellor. Specific research
                for you, your college, your major.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <WizardPreview />
          </FadeIn>
        </div>
      </section>

      {/* ===== COLLEGE FINDER PREVIEW ===== */}
      <section className="py-20 sm:py-28 bg-white border-t border-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
                Find the best colleges for any subject
              </h2>
              <p className="mt-4 text-navy/60 font-body max-w-xl mx-auto">
                Enter a subject and we&apos;ll rank the best colleges for you.
                Personalised to your profile.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="ktc-card p-8 text-center">
              <LeagueRedirectInput />
              <p className="mt-6 text-navy/40 text-sm font-body">
                Ranked by program reputation, affordability, graduation rate,
                and fit for you.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SCHOLARSHIPS OVERVIEW ===== */}
      <PhotoSection imageUrl="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
              Scholarships
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">
              $50 billion in scholarships. Most families miss them.
            </h2>
            <p className="text-white/70 font-body max-w-2xl mx-auto mb-10">
              Federal grants, national awards, state programs, auto-merit
              scholarships most families never know exist, and local community
              foundation awards with fewer than 50 applicants. We find them all.
            </p>
            <Link
              href="/scholarships"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md text-lg transition-colors"
            >
              Explore scholarships &rarr;
            </Link>
          </FadeIn>
        </div>
      </PhotoSection>

      {/* ===== FROM OUR GUIDES ===== */}
      <section className="py-16 sm:py-20 bg-white border-t border-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy text-center mb-10">
              From our guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                href="/blog/how-to-get-college-scholarships"
                className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
                  How to Get College Scholarships: 12 Strategies That Work
                </h3>
                <p className="font-body text-sm text-navy/50">10 min read</p>
              </Link>
              <Link
                href="/blog/fafsa-guide-2026-27"
                className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
                  FAFSA 2026–27: Step-by-Step Filing Guide
                </h3>
                <p className="font-body text-sm text-navy/50">10 min read</p>
              </Link>
              <Link
                href="/blog/how-to-write-common-app-essay"
                className="ktc-card p-6 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <h3 className="font-display text-base font-bold text-navy group-hover:text-gold transition-colors mb-2 leading-tight">
                  How to Write a Common App Essay That Gets You In
                </h3>
                <p className="font-body text-sm text-navy/50">9 min read</p>
              </Link>
            </div>
            <p className="text-center mt-6">
              <Link href="/blog" className="font-body text-sm text-gold hover:text-gold/80 font-medium">
                View all guides &rarr;
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== GRADUATION SECTION ===== */}
      <PhotoSection imageUrl="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=1920&q=80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              From where they are today to where they&apos;re meant to be
            </h2>
            <p className="mt-6 text-white/70 font-body max-w-xl mx-auto">
              Every budget. Every background. Every kid. Let&apos;s get started.
            </p>
            <Link
              href="/search"
              className="inline-block mt-8 bg-gold hover:bg-gold/90 text-navy font-body font-medium px-10 py-4 rounded-md text-lg transition-colors"
            >
              Start free research &rarr;
            </Link>
          </FadeIn>
        </div>
      </PhotoSection>
    </>
  );
}
