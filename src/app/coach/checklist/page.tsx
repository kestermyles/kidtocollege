import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "The Checklist — The Coach — KidToCollege",
  description:
    "Your personalized, interactive college application checklist. Track every deadline, task, and document.",
};

export default function ChecklistPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              The Checklist
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Never miss a deadline
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              Your personalized, interactive checklist tracks every task, every
              deadline, and every document — so nothing falls through the cracks.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Account required state */}
      <section className="py-24 bg-white">
        <div className="max-w-lg mx-auto px-6 text-center">
          <FadeIn>
            <div className="ktc-card p-10">
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-navy mb-3">
                Account required
              </h2>
              <p className="font-body text-navy/60 leading-relaxed mb-8">
                The interactive checklist saves your progress and personalizes
                tasks based on your colleges, deadlines, and grade level. Create
                a free account to unlock it.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth"
                  className="block w-full font-body font-medium bg-gold hover:bg-gold/90 text-navy px-6 py-3 rounded-md transition-all duration-200 text-center"
                >
                  Sign up free
                </Link>
                <Link
                  href="/auth"
                  className="block w-full font-body text-sm text-navy/50 hover:text-navy transition-colors text-center py-2"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-10">
              <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-4">
                What you will get
              </p>
              <div className="space-y-3 text-left">
                {[
                  "Personalized task list based on your grade and target schools",
                  "Deadline tracking with reminders",
                  "Progress tracking — see how far you have come",
                  "Document checklist (transcripts, test scores, essays, letters)",
                  "Shared family view so parents can help track progress",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-sage flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-body text-navy/60 text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
              Explore other coaching sections
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/coach/roadmap"
                className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
              >
                The Roadmap
              </Link>
              <Link
                href="/coach/essay"
                className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
              >
                The Essay
              </Link>
              <Link
                href="/coach/financial-aid"
                className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors"
              >
                Financial Aid
              </Link>
              <Link
                href="/coach"
                className="font-body text-sm bg-gold/10 border border-gold/30 rounded-md px-5 py-2.5 text-navy hover:bg-gold/20 transition-colors"
              >
                All Coach sections
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
