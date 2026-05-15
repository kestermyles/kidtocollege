"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { generateBragSheet } from "@/app/actions/coach";

export default function RecommendationsPage() {
  const [activities, setActivities] = useState<string[]>([""]);
  const [achievements, setAchievements] = useState("");
  const [bragSheet, setBragSheet] = useState("");
  const [loading, setLoading] = useState(false);

  function addActivity() {
    setActivities([...activities, ""]);
  }

  function updateActivity(index: number, value: string) {
    const updated = [...activities];
    updated[index] = value;
    setActivities(updated);
  }

  function removeActivity(index: number) {
    if (activities.length <= 1) return;
    setActivities(activities.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    setLoading(true);
    setBragSheet("");
    try {
      const filtered = activities.filter((a) => a.trim());
      const result = await generateBragSheet(filtered, achievements);
      setBragSheet(result.bragSheet);
    } catch {
      setBragSheet("Something went wrong. Please try again in a moment.");
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
              Recommendations
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Strong letters open doors
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              A great recommendation letter can make the difference at selective
              schools. Here is how to set your recommenders up for success.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Who to ask */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Who to ask
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The best recommender is not necessarily the teacher who gave you
                the highest grade. It is the teacher who knows you best and can
                speak to your character, growth, and engagement.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Junior-year teachers</strong> are ideal — they know recent, relevant work.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Choose teachers in core academic subjects</strong> (English, math, science, history, foreign language) unless a school specifies otherwise.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Pick teachers who have seen you struggle and grow.</strong> A story of improvement is more powerful than a story of easy success.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Match recommenders to your intended major when possible.</strong> Applying for engineering? A math or science teacher carries weight.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* When to ask */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              When to ask
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                <strong>Ask in the spring of junior year</strong> — April or May,
                before summer break. This gives your teachers time to write
                thoughtful letters without the rush of fall deadlines.
              </p>
              <p>
                If you miss that window, ask at the very start of senior year.
                Give at least 4-6 weeks before your earliest deadline.
              </p>
              <div className="ktc-card p-6 mt-4">
                <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-2">
                  Timeline
                </p>
                <ul className="space-y-2 text-sm text-navy/60">
                  <li><strong>April-May (Junior Year):</strong> Ask in person. Provide your brag sheet.</li>
                  <li><strong>August-September:</strong> Send a friendly reminder with deadlines.</li>
                  <li><strong>2 weeks before deadline:</strong> Gentle follow-up if not yet submitted.</li>
                  <li><strong>After submission:</strong> Send a handwritten thank-you note.</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How to ask */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              How to ask
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Ask in person, not by email. It shows respect and gives them a
                chance to say yes (or gracefully decline if they are overcommitted).
              </p>
              <div className="ktc-card p-6 mt-4">
                <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-3">
                  What to say
                </p>
                <p className="text-navy/60 text-sm italic leading-relaxed">
                  &ldquo;I really valued your class and how you pushed me to
                  improve my [specific skill]. I am applying to college this fall
                  and would be honoured if you would write me a letter of
                  recommendation. I will provide you with all the information you
                  need and the deadlines well in advance.&rdquo;
                </p>
              </div>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Give them an out.</strong> Say &ldquo;If you don&apos;t have time or don&apos;t feel you know me well enough, I completely understand.&rdquo;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Provide a brag sheet.</strong> This is the single most helpful thing you can do. Generate one below.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Share your college list and deadlines.</strong> Make it easy for them.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Brag sheet generator */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-xs tracking-widest uppercase mb-2">
              AI brag sheet generator
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Generate your brag sheet
            </h2>
            <p className="font-body text-navy/60 mb-8">
              A brag sheet gives your recommenders the details they need to write
              a specific, powerful letter. Add your activities and achievements
              below.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="ktc-card p-6 md:p-8">
              <div className="mb-6">
                <label className="font-body text-sm text-navy/60 mb-2 block">
                  Activities and extracurriculars
                </label>
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => updateActivity(i, e.target.value)}
                      placeholder={`Activity ${i + 1} (e.g., "Varsity soccer captain, 3 years")`}
                      className="flex-1 font-body text-sm border border-card rounded-md px-3 py-2 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-gold/40 placeholder:text-navy/30"
                    />
                    {activities.length > 1 && (
                      <button
                        onClick={() => removeActivity(i)}
                        className="text-navy/30 hover:text-crimson transition-colors px-2"
                        aria-label="Remove activity"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addActivity}
                  className="font-body text-sm text-sage hover:text-sage/80 transition-colors mt-1"
                >
                  + Add another activity
                </button>
              </div>

              <div className="mb-6">
                <label className="font-body text-sm text-navy/60 mb-2 block">
                  Achievements, awards, and additional context
                </label>
                <textarea
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Describe any awards, achievements, personal qualities, goals, or anything else you want your recommender to know about..."
                  rows={6}
                  className="w-full font-body text-[15px] text-navy border border-card rounded-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 resize-y leading-relaxed placeholder:text-navy/30"
                />
              </div>

              <div className="flex justify-end">
                <GoldButton
                  onClick={handleGenerate}
                  disabled={
                    loading ||
                    (activities.filter((a) => a.trim()).length === 0 &&
                      achievements.trim().length === 0)
                  }
                >
                  {loading ? "Generating..." : "Generate brag sheet"}
                </GoldButton>
              </div>

              {loading && (
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              )}

              {bragSheet && !loading && (
                <div className="mt-6 p-6 bg-white rounded-md border border-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg font-bold text-navy">
                      Your brag sheet
                    </h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(bragSheet)}
                      className="font-body text-xs text-sage hover:text-sage/80 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div className="font-body text-navy/75 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {bragSheet}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How many letters */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              How many letters do you need?
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Most colleges require <strong>two teacher recommendations</strong>{" "}
                and one <strong>counselor recommendation</strong>. Some allow or
                encourage additional letters.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>2 teacher letters:</strong> One STEM, one humanities is a strong combination.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>1 counselor letter:</strong> Your school counselor provides context about your school and circumstances.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Supplemental letters (optional):</strong> A coach, employer, or mentor who knows a different side of you. Only if they add new information.</span>
                </li>
              </ul>
              <p className="text-sm text-navy/50 italic mt-4">
                More is not better. Three strong letters beat five mediocre ones.
                Only send additional letters if they reveal something new.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Follow up */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Following up
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Teachers are busy. A respectful follow-up is not rude — it is
                responsible. Here is how to do it well:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>Send a brief email 2-3 weeks before your earliest deadline with a friendly reminder.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>Include the exact deadlines and submission instructions in the reminder.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>After they submit, send a handwritten thank-you note. This matters more than you think.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>Update them on your results in the spring. They are genuinely invested in your success.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What makes a strong letter */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              What makes a strong letter
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                You cannot control what your recommender writes, but you can set
                them up to write a great letter. The strongest letters share
                these qualities:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: "Specific anecdotes",
                    desc: "Not 'She is a hard worker' but 'She rewrote her paper three times because she wanted to get the argument right.'",
                  },
                  {
                    title: "Context of growth",
                    desc: "How you developed over time — from struggling to confident, from quiet to leading discussions.",
                  },
                  {
                    title: "Intellectual character",
                    desc: "How you think, ask questions, engage with ideas, and push yourself beyond what is required.",
                  },
                  {
                    title: "Personal qualities",
                    desc: "Kindness, humour, resilience, integrity — the human qualities that make a campus better.",
                  },
                ].map((item) => (
                  <div key={item.title} className="ktc-card p-5">
                    <h3 className="font-body font-medium text-navy mb-1">
                      {item.title}
                    </h3>
                    <p className="font-body text-navy/60 text-sm">{item.desc}</p>
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
              Continue coaching
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/coach/interviews" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Interviews
              </Link>
              <Link href="/coach/essay" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Essay
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
