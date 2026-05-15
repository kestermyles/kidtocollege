import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Free College Admissions Coach: Essays, Test Prep & Financial Aid",
  description:
    "Your personal free college admissions coach — covering essays, SAT/ACT prep, interview practice, financial aid, letters of recommendation, and your full application checklist.",
};

const PILLARS = [
  {
    title: "My Plan",
    href: "/coach/checklist",
    description:
      "Your personalized checklist — every task, deadline, and document tracked in one place.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "My Goals",
    href: "/coach/goals",
    description:
      "Set your GPA, test scores, target colleges, and deadlines — and we'll build your plan.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "The Roadmap",
    href: "/coach/roadmap",
    description:
      "Grade-by-grade action plan from freshman year through senior spring. Know exactly what to do and when.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    title: "Merit Sweet Spot",
    href: "/coach/merit-sweet-spot",
    description:
      "Enter your GPA and scores to find which colleges put you in merit scholarship territory. The leverage most families miss.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    title: "Appeal Letter",
    href: "/coach/appeal-letter",
    description:
      "Learn when and how to appeal your financial aid offer. Generate a personalized appeal letter with AI.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "The Essay",
    href: "/coach/essay",
    description:
      "Find your angle, structure your story, and polish your draft with AI feedback. Your voice, your story.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Test Prep",
    href: "/coach/test-prep",
    description:
      "SAT vs ACT strategy, score targets, free resources, test-optional guidance, and AP/IB exam planning.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: "Interviews",
    href: "/coach/interviews",
    description:
      "Common questions with guidance, mock practice with AI feedback, and tips for virtual and in-person.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Recommendations",
    href: "/coach/recommendations",
    description:
      "Who to ask, how to ask, and generate a brag sheet your recommenders will actually use.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Financial Aid",
    href: "/coach/financial-aid",
    description:
      "FAFSA walkthrough, CSS Profile, reading aid offers, appeal scripts, and an AI Q&A for any question.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the college coach really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — every coaching feature on KidToCollege is completely free. No paywalls, no premium tier, no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "What does the college coach cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Coach covers essay writing, SAT/ACT test prep strategy, interview preparation, financial aid guidance, letters of recommendation, and a complete application checklist — the same services private counselors charge up to $15,000 for.",
      },
    },
  ],
};

export default function CoachPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <PageHeader title="The Coach" subtitle="Your personal AI college counselor." />

      {/* Coaching Pillars */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-sm tracking-widest uppercase mb-3 text-center">
              Eight pillars
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-4">
              The full private counselor experience
            </h2>
            <p className="font-body text-navy/60 text-center max-w-2xl mx-auto mb-16">
              Each section gives you the same depth, strategy, and tools that
              families pay thousands for. Dive into any area, in any order.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <FadeIn key={pillar.href} delay={i * 0.08}>
                <Link href={pillar.href} className="block group">
                  <div className="ktc-card p-8 h-full transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-gold/40">
                    <div className="text-sage mb-4">{pillar.icon}</div>
                    <h3 className="font-display text-xl font-bold text-navy mb-2 group-hover:text-sage transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="font-body text-navy/60 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                    <div className="mt-4 flex items-center text-gold font-body text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}

            {/* Checklist CTA card */}
            <FadeIn delay={0.48}>
              <Link href="/coach/checklist" className="block group">
                <div className="ktc-card p-8 h-full bg-cream border-dashed border-2 border-gold/30 transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-gold/60">
                  <div className="text-gold mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                    The Checklist
                  </h3>
                  <p className="font-body text-navy/60 text-sm leading-relaxed">
                    Your personalized, interactive college application checklist.
                    Track every deadline, every task, every document.
                  </p>
                  <div className="mt-4 font-mono-label text-xs text-gold/80 tracking-wide uppercase">
                    Account required — Sign up free
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              Start anywhere. Come back anytime.
            </h2>
            <p className="font-body text-navy/60 text-lg mb-8">
              There is no right order. Pick the section that matters most to you
              right now, and work through it at your own pace. Every section is
              always free.
            </p>
            <Link
              href="/search"
              className="inline-block font-body font-medium bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-md transition-all duration-200 text-lg"
            >
              Start with college research
            </Link>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link href="/essays" className="font-body text-sm text-navy/60 hover:text-gold transition-colors">Essay prompts</Link>
              <span className="text-navy/20">|</span>
              <Link href="/my-chances" className="font-body text-sm text-navy/60 hover:text-gold transition-colors">My Chances</Link>
              <span className="text-navy/20">|</span>
              <Link href="/scholarships" className="font-body text-sm text-navy/60 hover:text-gold transition-colors">Scholarships</Link>
              <span className="text-navy/20">|</span>
              <Link href="/financial-aid/calculator" className="font-body text-sm text-navy/60 hover:text-gold transition-colors">Net price calculator</Link>
              <span className="text-navy/20">|</span>
              <Link href="/deadlines" className="font-body text-sm text-navy/60 hover:text-gold transition-colors">Deadlines</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
