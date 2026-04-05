"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STEPS = [
  {
    num: 1,
    icon: "\ud83e\udded",
    title: "Figure out what you want",
    description: "Not sure what to study? Take our 3-minute quiz to discover majors that match your interests and personality.",
    cta: "Take the quiz \u2192",
    href: "/discover",
    badge: "3 minutes",
  },
  {
    num: 2,
    icon: "\ud83c\udfdb\ufe0f",
    title: "Find your colleges",
    description: "Search 2,942 colleges by location, size, cost, D1 sports, Greek life, and more. Build your list.",
    cta: "Browse colleges \u2192",
    href: "/colleges",
    badge: "Your pace",
  },
  {
    num: 3,
    icon: "\ud83c\udfaf",
    title: "Check your chances",
    description: "Enter your GPA and test scores. Get a personalised Safety, On Target, and Reach list based on real admissions data.",
    cta: "Check my chances \u2192",
    href: "/my-chances",
    badge: "5 minutes",
  },
  {
    num: 4,
    icon: "\ud83d\udcb0",
    title: "Understand what you'll pay",
    description: "College sticker prices are misleading. See what you'll actually pay after grants, scholarships, and aid.",
    cta: "Calculate net price \u2192",
    href: "/financial-aid/calculator",
    badge: "5 minutes",
  },
  {
    num: 5,
    icon: "\ud83c\udfc6",
    title: "Find scholarships",
    description: "$50B in scholarships goes unclaimed every year. Search thousands of awards you actually qualify for.",
    cta: "Find scholarships \u2192",
    href: "/scholarships",
    badge: "10 minutes",
  },
  {
    num: 6,
    icon: "\u270d\ufe0f",
    title: "Build your application",
    description: "Track deadlines, prep your essays with AI coaching, and get your application checklist. Don't miss a thing.",
    cta: "Start your application \u2192",
    href: "/coach",
    badge: "Ongoing",
  },
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
      {/* Hero */}
      <section className="bg-navy py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Your College Roadmap
          </h1>
          <p className="font-body text-xl text-white/60 max-w-2xl mx-auto">
            Everything you need to get into the right college &mdash; in the right order. Free, forever.
          </p>
        </div>
      </section>

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
                      <span className="emoji text-xl" role="img" aria-label={step.title}>{step.icon}</span>
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
    </div>
  );
}
