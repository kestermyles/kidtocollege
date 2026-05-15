"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getEssayFeedback } from "@/app/actions/coach";

const GUIDED_PROMPTS = [
  "What is a moment that changed how you see the world?",
  "What would you do with a free Saturday when nobody is watching?",
  "What problem do you wish you could solve, and why does it bother you personally?",
  "When have you been wrong about something important? What happened next?",
  "What is something you have taught yourself, and why?",
  "Describe a conversation that shifted your perspective.",
  "What part of your identity do people often misunderstand?",
  "What does your bedroom, workspace, or backpack say about you?",
];

const ESSAY_KILLERS = [
  {
    title: "The resume dump",
    desc: "Listing accomplishments without reflection. Admissions officers already have your activities list.",
  },
  {
    title: "The tragedy formula",
    desc: "Dwelling on hardship without showing growth. The essay is about what you did with it.",
  },
  {
    title: "The thesaurus essay",
    desc: "Overwritten, pretentious prose. Write like you talk to a smart friend.",
  },
  {
    title: "The generic volunteer trip",
    desc: "'I went to [country] and learned gratitude.' Unless you have a genuinely specific story, avoid it.",
  },
  {
    title: "The hero ending",
    desc: "Wrapping everything up with a neat bow. Real essays sit with complexity.",
  },
];

const STRUCTURE_STEPS = [
  {
    step: "1. The hook",
    desc: "Start in the middle of a moment. Drop the reader into a scene, a feeling, or a question. No grand openings.",
  },
  {
    step: "2. The context",
    desc: "Give just enough background for the reader to understand. One or two sentences. Don't over-explain.",
  },
  {
    step: "3. The tension",
    desc: "What was hard? What did you not know? What conflicted? This is where the essay gets interesting.",
  },
  {
    step: "4. The insight",
    desc: "What did you learn, realize, or decide? Not a lesson — a genuine shift in how you think.",
  },
  {
    step: "5. The landing",
    desc: "Connect back to the opening or look forward. Leave the reader with a sense of who you are becoming.",
  },
];

export default function EssayPage() {
  const [draft, setDraft] = useState("");
  const [draftType, setDraftType] = useState("personal statement");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGetFeedback() {
    setLoading(true);
    setFeedback("");
    try {
      const result = await getEssayFeedback(draft, draftType);
      setFeedback(result.feedback);
    } catch {
      setFeedback(
        "Something went wrong. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              The Essay
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Tell your story. We help you tell it well.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The college essay is your one chance to speak directly to
              admissions. No grades, no scores — just you. Let&apos;s make it count.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section 1: Why it matters */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Why the essay matters
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                At selective colleges, most applicants have strong grades and test
                scores. The essay is how admissions officers differentiate
                between thousands of qualified candidates. It is the only part of
                your application that is entirely in your voice.
              </p>
              <p>
                A great essay does not need to be about a great achievement. It
                needs to reveal how you think, what you care about, and who you
                are when nobody is grading you. Admissions officers read
                thousands of essays. The ones that stick are authentic, specific,
                and human.
              </p>
              <p>
                The essay can tip a borderline decision. At schools that practice
                holistic admissions, it carries real weight — sometimes more than
                an extra AP class or a slightly higher test score.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 2: What they want */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              What admissions officers want to read
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                They want to hear <em>your</em> voice — not your parent&apos;s, not
                your counselor&apos;s, not ChatGPT&apos;s. They can tell the difference
                instantly.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Specificity.</strong> Concrete details, real moments, actual dialogue. Not abstractions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Self-awareness.</strong> Show that you can reflect honestly on your experiences.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Growth.</strong> Not a hero&apos;s journey — just evidence that you think, adapt, and learn.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>A window into your world.</strong> They want to understand what it is like to be you.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 3: What kills an essay */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              What kills an essay
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {ESSAY_KILLERS.map((killer, i) => (
              <FadeIn key={killer.title} delay={i * 0.06}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-crimson" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-body font-medium text-navy">{killer.title}</h3>
                    <p className="font-body text-navy/60 text-sm">{killer.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Finding your angle */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              How to find your angle
            </h2>
            <p className="font-body text-navy/60 mb-8">
              Sit with each of these prompts for a few minutes. The one that
              makes you feel something — that is your essay.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {GUIDED_PROMPTS.map((prompt, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="ktc-card p-5">
                  <p className="font-body text-navy/75 text-sm leading-relaxed italic">
                    &ldquo;{prompt}&rdquo;
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Structure */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              Structure guide
            </h2>
          </FadeIn>
          <div className="space-y-6">
            {STRUCTURE_STEPS.map((s, i) => (
              <FadeIn key={s.step} delay={i * 0.06}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono-label text-sage text-xs font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-body font-medium text-navy">{s.step}</h3>
                    <p className="font-body text-navy/60 text-sm">{s.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: AI Writing Assistant */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-xs tracking-widest uppercase mb-2">
              AI essay coach
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Get feedback on your draft
            </h2>
            <p className="font-body text-navy/75 text-lg mb-8">
              This is your essay. We just help you make it great.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="ktc-card p-6 md:p-8">
              <div className="mb-4">
                <label className="font-body text-sm text-navy/60 mb-2 block">
                  Essay type
                </label>
                <select
                  value={draftType}
                  onChange={(e) => setDraftType(e.target.value)}
                  className="font-body text-sm border border-card rounded-md px-3 py-2 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                >
                  <option value="personal statement">Common App Personal Statement</option>
                  <option value="supplemental essay">Supplemental Essay</option>
                  <option value="why this college">Why This College Essay</option>
                  <option value="activity essay">Activity / Extracurricular Essay</option>
                  <option value="diversity essay">Diversity Essay</option>
                </select>
              </div>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Paste or type your essay draft here..."
                rows={12}
                className="w-full font-body text-[15px] text-navy border border-card rounded-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 resize-y leading-relaxed placeholder:text-navy/30"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="font-mono-label text-xs text-navy/40">
                  {draft.split(/\s+/).filter(Boolean).length} words
                </span>
                <GoldButton
                  onClick={handleGetFeedback}
                  disabled={loading || draft.trim().length < 50}
                >
                  {loading ? "Reviewing..." : "Get AI feedback"}
                </GoldButton>
              </div>

              {loading && (
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              )}

              {feedback && !loading && (
                <div className="mt-6 p-6 bg-cream rounded-md border border-card">
                  <h3 className="font-display text-lg font-bold text-navy mb-3">
                    Feedback
                  </h3>
                  <div className="font-body text-navy/75 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {feedback}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 7: Supplemental essays */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Supplemental essays
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Most selective colleges require 1-3 supplemental essays in
                addition to the personal statement. These are shorter (usually
                150-400 words) and more targeted.
              </p>
              <div className="ktc-card p-6 space-y-4 mt-6">
                <div>
                  <h3 className="font-body font-medium text-navy mb-1">&ldquo;Why this college?&rdquo;</h3>
                  <p className="text-navy/60 text-sm">
                    Be specific. Name a professor, program, tradition, or opportunity
                    you cannot get elsewhere. Do not say &ldquo;prestigious&rdquo; or &ldquo;diverse.&rdquo;
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-navy mb-1">&ldquo;What will you contribute?&rdquo;</h3>
                  <p className="text-navy/60 text-sm">
                    Think beyond your resume. What perspective, energy, or question
                    do you bring to a campus community?
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-navy mb-1">&ldquo;Tell us about an activity&rdquo;</h3>
                  <p className="text-navy/60 text-sm">
                    Go deep on one thing. Show the behind-the-scenes — the late
                    nights, the failures, the moments nobody saw.
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-navy mb-1">Short-answer &ldquo;quirky&rdquo; prompts</h3>
                  <p className="text-navy/60 text-sm">
                    Be genuine and have fun. These are meant to reveal personality.
                    Do not overthink them — but do not waste them either.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-navy/50 italic">
                Tip: Use the AI feedback tool above for supplemental essays too.
                Just select the essay type and paste your draft.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-cream border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
              Continue coaching
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/coach/roadmap" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Roadmap
              </Link>
              <Link href="/coach/test-prep" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Test Prep
              </Link>
              <Link href="/coach/interviews" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Interviews
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
