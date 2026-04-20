// updated
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Building2, Target, DollarSign, Trophy, PenLine, AlertTriangle, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const STEPS: { num: number; icon: LucideIcon; title: string; description: string; cta: string; href: string; badge: string }[] = [
  {
    num: 1,
    icon: Compass,
    title: "Figure out what you want",
    description: "Not sure what to study? Take our 3-minute quiz to discover majors that match your interests and personality.",
    cta: "Take the quiz \u2192",
    href: "/discover",
    badge: "3 minutes",
  },
  {
    num: 2,
    icon: Building2,
    title: "Find your colleges",
    description: "Search 2,942 colleges by location, size, cost, D1 sports, Greek life, and more. Build your list.",
    cta: "Browse colleges \u2192",
    href: "/colleges",
    badge: "Your pace",
  },
  {
    num: 3,
    icon: Target,
    title: "Check your chances",
    description: "Enter your GPA and test scores. Get a personalised Safety, On Target, and Reach list based on real admissions data.",
    cta: "Check my chances \u2192",
    href: "/my-chances",
    badge: "5 minutes",
  },
  {
    num: 4,
    icon: DollarSign,
    title: "Understand what you'll pay",
    description: "College sticker prices are misleading. See what you'll actually pay after grants, scholarships, and aid.",
    cta: "Calculate net price \u2192",
    href: "/financial-aid/calculator",
    badge: "5 minutes",
  },
  {
    num: 5,
    icon: Trophy,
    title: "Find scholarships",
    description: "$50B in scholarships goes unclaimed every year. Search thousands of awards you actually qualify for.",
    cta: "Find scholarships \u2192",
    href: "/scholarships",
    badge: "10 minutes",
  },
  {
    num: 6,
    icon: PenLine,
    title: "Build your application",
    description: "Track deadlines, prep your essays with AI coaching, and get your application checklist. Don't miss a thing.",
    cta: "Start your application \u2192",
    href: "/coach",
    badge: "Ongoing",
  },
];

type TimelineItem = { when: string; what: string };
type TimelineGrade = { grade: string; emphasis?: string; items: TimelineItem[] };

const TIMELINE: TimelineGrade[] = [
  {
    grade: "9th Grade",
    items: [
      { when: "Fall", what: "Focus on adjustment and exploration. Join 2-3 clubs or activities that genuinely interest you. Build relationships with teachers." },
      { when: "Winter", what: "Meet with your counselor to understand your school's course offerings and graduation requirements." },
      { when: "Spring", what: "Choose rigorous courses for sophomore year. Take the most challenging classes you can handle while maintaining strong grades." },
    ],
  },
  {
    grade: "10th Grade",
    items: [
      { when: "Fall", what: "Continue with extracurriculars and deepen involvement. Consider taking your first AP or Honors course." },
      { when: "October", what: "Take the PSAT for practice (does not count for National Merit)." },
      { when: "Spring", what: "Identify 1-2 activities where you can pursue leadership roles junior year." },
    ],
  },
  {
    grade: "11th Grade",
    emphasis: "The most critical year",
    items: [
      { when: "Summer before", what: "Begin college research. Make a broad list of 15-20 schools." },
      { when: "September", what: "Meet with your counselor about testing timeline and college list." },
      { when: "October", what: "Take PSAT/NMSQT (counts for National Merit Scholarship)." },
      { when: "Dec - Jan", what: "Take first SAT or ACT. Register 6-8 weeks in advance." },
      { when: "Feb - Apr", what: "Build college list to 10-12 schools. Schedule campus visits for spring break." },
      { when: "Mar - May", what: "Retake SAT/ACT if needed. Goal: be done with testing before summer." },
      { when: "Apr - May", what: "Ask teachers for recommendation letters in person before summer break." },
      { when: "Summer", what: "Write Common App essay. Narrow college list to 5-7 schools. Create resume/activity list." },
    ],
  },
  {
    grade: "12th Grade",
    items: [
      { when: "August 1", what: "Common App opens. Create account immediately." },
      { when: "Aug - Sep", what: "Finalize college list. Complete all essays and short answers." },
      { when: "October", what: "Submit Early Decision/Early Action applications (deadlines typically Nov 1)." },
      { when: "October 1", what: "FAFSA opens. Complete it ASAP even if your family has high income." },
      { when: "November", what: "Submit Regular Decision applications (deadlines typically Jan 1-15)." },
      { when: "Dec - Mar", what: "Decisions arrive. Review financial aid packages carefully." },
      { when: "April", what: "Compare aid packages. Visit accepted student days if possible." },
      { when: "May 1", what: "National decision deadline. Submit deposit to ONE school only." },
    ],
  },
];

const MILESTONES: string[] = [
  "October (Junior Year): PSAT/NMSQT for National Merit",
  "Spring (Junior Year): Request recommendation letters",
  "August 1 (Senior Year): Common App opens",
  "October 1 (Senior Year): FAFSA opens",
  "November 1: Early Decision/Early Action deadline",
  "January 1-15: Regular Decision deadlines",
  "May 1: National decision day",
];

const QUICK_TOOLS = [
  { label: "Compare colleges", href: "/compare" },
  { label: "Application deadlines", href: "/deadlines" },
  { label: "College fairs", href: "/college-fairs" },
  { label: "Merit Sweet Spot", href: "/coach/merit-sweet-spot" },
  { label: "Essay prompts", href: "/essays" },
  { label: "FAFSA guide", href: "/fafsa-guide" },
];

export default function RoadmapPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("ktc_roadmap_completed");
    if (saved) {
      try {
        setCompleted(new Set(JSON.parse(saved)));
      } catch {
        // ignore
      }
    }
  }, []);

  function toggleStep(num: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      localStorage.setItem("ktc_roadmap_completed", JSON.stringify(Array.from(next)));
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Your College Roadmap" subtitle="Everything you need, in the right order." />

      {/* Steps */}
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-0">
            {STEPS.map((step, idx) => {
              const done = completed.has(step.num);
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={step.num} className="flex gap-5 items-stretch">
                  {/* Left column: circle + line */}
                  <div className="flex flex-col items-center flex-shrink-0 w-12">
                    <button
                      onClick={() => toggleStep(step.num)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ring-4 ring-white ${
                        done
                          ? "bg-sage text-white"
                          : "bg-white text-gold border-2 border-gold/30"
                      }`}
                      title={done ? "Mark as incomplete" : "Mark as done"}
                    >
                      {done ? "\u2713" : step.num}
                    </button>
                    {/* Line stretches to fill card height */}
                    <div className={`w-0.5 flex-1 bg-gold/20 ${isLast ? "mb-0" : ""}`} />
                  </div>

                  {/* Right column: card */}
                  <div className={`ktc-card p-6 flex-1 mb-6 transition-opacity ${done ? "opacity-60" : ""} ${isLast ? "mb-0" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gold/10">
                        <step.icon className="w-4 h-4 text-gold" />
                      </div>
                      <h2 className="font-display text-lg font-bold text-navy">
                        {step.title}
                      </h2>
                      <span className="ml-auto px-2.5 py-0.5 rounded-full bg-navy/5 font-mono-label text-xs text-navy/40 flex-shrink-0">
                        {step.badge}
                      </span>
                    </div>
                    <p className="font-body text-sm text-navy/60 mb-4">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium text-sm px-5 py-2.5 rounded-md transition-all hover:translate-x-0.5"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Tools */}
      <section className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-xl font-bold text-navy mb-6 text-center">
            Quick tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="ktc-card p-4 text-center block group hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="font-body text-sm font-medium text-navy group-hover:text-gold transition-colors">
                  {tool.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Year-by-Year Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-navy">Year-by-year timeline</h2>
            <p className="font-body text-sm text-navy/60 mt-1">What to work on each year of high school.</p>
          </div>

          <div className="space-y-6">
            {TIMELINE.map((g) => (
              <div key={g.grade} className="ktc-card p-6">
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
                  <h3 className="font-display text-lg font-bold text-navy">{g.grade}</h3>
                  {g.emphasis && (
                    <span className="text-xs font-mono-label uppercase tracking-wide text-crimson font-semibold">
                      {g.emphasis}
                    </span>
                  )}
                </div>
                <div className="divide-y divide-card">
                  {g.items.map((it, i) => (
                    <div key={i} className="grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 py-2.5">
                      <div className="font-mono-label text-xs uppercase tracking-wide text-gold font-semibold sm:pt-0.5">
                        {it.when}
                      </div>
                      <div className="font-body text-sm text-navy/80 leading-relaxed">
                        {it.what}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critical Milestones */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="ktc-card p-6 border-2 border-crimson/30 bg-crimson/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-crimson" />
              <h2 className="font-display text-lg font-bold text-navy">Cannot miss these deadlines</h2>
            </div>
            <ul className="space-y-2">
              {MILESTONES.map((m) => (
                <li key={m} className="flex items-start gap-2 font-body text-sm text-navy/80">
                  <span className="text-crimson font-bold mt-0.5">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
