"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

// export const metadata omitted because this is a client component —
// metadata is set via generateMetadata or a head.tsx in production.

type MilestoneItem = string | { text: string; href: string };

const ROADMAP: {
  grade: string;
  color: string;
  terms: { term: string; items: MilestoneItem[] }[];
}[] = [
  {
    grade: "Freshman Year (9th Grade)",
    color: "bg-sage",
    terms: [
      {
        term: "Fall",
        items: [
          "Focus on building strong study habits — they matter more than any single grade.",
          "Join 2-3 extracurricular activities that genuinely interest you.",
          "Introduce yourself to your school counselor and learn what resources are available.",
          "Start a simple filing system for awards, certificates, and important documents.",
          "If your school offers honors courses, consider taking one in your strongest subject.",
        ],
      },
      {
        term: "Spring",
        items: [
          "Reflect on your activities — double down on what you love, drop what you don't.",
          "Explore volunteer opportunities in your community.",
          "Begin thinking about summer — camps, programs, or jobs that align with your interests.",
          "Keep grades strong. Freshman year GPA counts in your cumulative average.",
        ],
      },
      {
        term: "Summer",
        items: [
          "Read widely — fiction, nonfiction, anything that sparks curiosity.",
          "Try a summer program, job, or meaningful project.",
          "Start a journal or notes file — jot down experiences that shape you.",
          "Visit a college campus casually, even just to walk around and get the feel.",
        ],
      },
    ],
  },
  {
    grade: "Sophomore Year (10th Grade)",
    color: "bg-gold",
    terms: [
      {
        term: "Fall",
        items: [
          "Take the PSAT in October — it is practice this year, but the score gives you a baseline.",
          "Consider taking your first AP or advanced course if available.",
          "Deepen involvement in activities — seek leadership roles or start a project.",
          "Begin researching colleges casually. Make a list of what matters to you (size, location, vibe).",
          "Attend college fairs or information sessions if they come to your area.",
        ],
      },
      {
        term: "Spring",
        items: [
          "Identify teachers who know you well — they may write recommendations later.",
          "Take the SAT or ACT for the first time if you feel ready, or plan for junior year.",
          "Research AP/IB courses for junior year and plan your course selection strategically.",
          "Look into summer programs, internships, or research opportunities.",
          "Begin thinking about what makes you different — your 'spike' or unique angle.",
        ],
      },
      {
        term: "Summer",
        items: [
          "Pursue a meaningful summer experience — depth over breadth.",
          "Start SAT/ACT prep if you plan to test in fall of junior year.",
          "Visit 3-5 college campuses to calibrate what you like and don't like.",
          "Continue building your activity or project — consistency matters.",
        ],
      },
    ],
  },
  {
    grade: "Junior Year (11th Grade)",
    color: "bg-crimson",
    terms: [
      {
        term: "Fall",
        items: [
          "Take the PSAT/NMSQT in October — a qualifying score can earn National Merit recognition.",
          "Register for and take the SAT or ACT (many students test in December or spring).",
          "Challenge yourself academically — junior year grades are the most scrutinized.",
          "Build your college list: 3-4 reach, 3-4 match, 2-3 safety schools.",
          "Attend college info sessions and virtual tours. Take notes on what resonates.",
          "Begin thinking about your personal essay — what story do you want to tell?",
        ],
      },
      {
        term: "Spring",
        items: [
          "Retake SAT/ACT if needed — most students improve on a second attempt.",
          "Take AP exams in May. Strong scores can earn college credit.",
          "Ask two teachers for letters of recommendation before summer break.",
          "Narrow your college list. Research financial aid and scholarship deadlines.",
          "Start drafting your Common App personal statement. Even a rough draft helps.",
          "File the FAFSA as soon as it opens (October of senior year) — get familiar now.",
          "Look into fly-in programs and diversity recruitment weekends.",
          { text: "Review Common App essay prompts for next year.", href: "/blog/common-app-prompts-2026-2027" },
          { text: "Start essay brainstorming — don't write yet, just list experiences.", href: "/essays" },
          { text: "Talk to teachers about possible essay topics.", href: "/blog/talk-first-method-college-essays" },
        ],
      },
      {
        term: "Summer",
        items: [
          "Write and revise your personal essay. Get feedback from trusted readers.",
          "Research supplemental essay prompts for your target schools.",
          "Finalize your college list. Confirm application deadlines.",
          "Prepare your activities list — the Common App gives you 10 slots.",
          "Visit remaining colleges if possible. Demonstrated interest can matter.",
          "Organize financial documents for FAFSA and CSS Profile.",
          { text: "Draft your Common App personal statement using the talk-first method.", href: "/blog/talk-first-method-college-essays" },
          { text: "Get feedback on your draft from trusted readers.", href: "/essays" },
          { text: "Revise for specificity — show don't tell.", href: "/blog/show-dont-tell-college-essays" },
        ],
      },
    ],
  },
  {
    grade: "Senior Year (12th Grade)",
    color: "bg-navy",
    terms: [
      {
        term: "Fall",
        items: [
          "Submit Early Decision/Early Action applications by November 1 or 15.",
          "File the FAFSA and CSS Profile as soon as they open in October.",
          "Send SAT/ACT score reports to your colleges.",
          "Request your official transcript be sent to each school.",
          "Follow up with recommenders — confirm letters are submitted.",
          "Write and polish supplemental essays for each school.",
          "Apply for outside scholarships — many have fall deadlines.",
          "Keep your grades up. Colleges see your first-semester senior grades.",
          { text: "Finalize your personal statement. Run it through the voice check.", href: "/essays" },
          { text: "Submit with early applications by October 15 – November 1.", href: "/coach/checklist" },
        ],
      },
      {
        term: "Spring",
        items: [
          "Submit Regular Decision applications by January 1-15 (varies by school).",
          "Complete any remaining scholarship applications.",
          "Compare financial aid offers carefully — use our comparison tool.",
          "Appeal financial aid if needed — many families leave money on the table.",
          "Visit admitted students days for your top choices.",
          "Commit to a college by May 1 (National Decision Day).",
          "Send a deposit and complete housing paperwork.",
          "Thank your recommenders, counselors, and mentors.",
        ],
      },
      {
        term: "Summer",
        items: [
          "Complete orientation and register for classes.",
          "Apply for work-study positions and campus jobs.",
          "Connect with your future roommate and join campus groups online.",
          "Celebrate. You earned this.",
        ],
      },
    ],
  },
];

function AccordionSection({
  grade,
  color,
  terms,
  isOpen,
  onToggle,
}: {
  grade: string;
  color: string;
  terms: { term: string; items: MilestoneItem[] }[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="ktc-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-display text-xl md:text-2xl font-bold text-navy group-hover:text-sage transition-colors">
            {grade}
          </h3>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-6 h-6 text-navy/40 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 space-y-8">
              {terms.map((t) => (
                <div key={t.term}>
                  <h4 className="font-mono-label text-sm tracking-widest uppercase text-sage mb-3">
                    {t.term}
                  </h4>
                  <ul className="space-y-2">
                    {t.items.map((item, j) => {
                      const isLinked = typeof item !== "string";
                      const text = typeof item === "string" ? item : item.text;
                      return (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                          {isLinked ? (
                            <Link
                              href={item.href}
                              className="font-body text-navy/75 text-[15px] leading-relaxed hover:text-gold transition-colors underline underline-offset-2 decoration-gold/30 hover:decoration-gold"
                            >
                              {text}
                            </Link>
                          ) : (
                            <span className="font-body text-navy/75 text-[15px] leading-relaxed">
                              {text}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              The Roadmap
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Your grade-by-grade action plan
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              Every semester, every season, every move. This is exactly what a
              private counselor maps out for their families — and now it is
              yours.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Sign-in CTA */}
      <section className="bg-cream py-6">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="flex items-center gap-3 justify-center text-center">
              <svg className="w-5 h-5 text-sage flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="font-body text-navy/60 text-sm">
                <Link href="/auth" className="text-sage font-medium hover:underline">Sign in</Link>{" "}
                to get a personalized roadmap tailored to your grade, goals, and timeline.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {ROADMAP.map((section, i) => (
            <FadeIn key={section.grade} delay={i * 0.08}>
              <AccordionSection
                grade={section.grade}
                color={section.color}
                terms={section.terms}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
              Keep going
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/coach/essay" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Essay
              </Link>
              <Link href="/coach/test-prep" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Test Prep
              </Link>
              <Link href="/coach/financial-aid" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Financial Aid
              </Link>
              <Link href="/coach" className="font-body text-sm bg-gold/10 border border-gold/30 rounded-md px-5 py-2.5 text-navy hover:bg-gold/20 transition-colors">
                All Coach sections
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
