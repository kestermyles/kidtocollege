"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { GoldButton } from "@/components/GoldButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { askFinancialAidQuestion } from "@/app/actions/coach";

const FAFSA_STEPS = [
  {
    step: "1. Create an FSA ID",
    desc: "Both the student and one parent need an FSA ID (username and password) at studentaid.gov. This is your electronic signature. Do this first — it can take a few days to process.",
  },
  {
    step: "2. Gather your documents",
    desc: "You will need: Social Security numbers, federal tax returns (or tax transcripts), W-2s, bank statements, and records of untaxed income. The IRS Data Retrieval Tool can auto-fill much of this.",
  },
  {
    step: "3. Complete the FAFSA form",
    desc: "Go to studentaid.gov. The form takes 30-45 minutes if you have your documents ready. Answer every question — leaving fields blank can delay processing.",
  },
  {
    step: "4. List your colleges",
    desc: "You can list up to 20 schools on the FAFSA. Each school will receive your information and use it to build your aid package. Order does not matter for most schools.",
  },
  {
    step: "5. Submit and save your SAR",
    desc: "After submitting, you will receive a Student Aid Report (SAR) with your Expected Family Contribution (EFC) / Student Aid Index (SAI). Review it for errors.",
  },
  {
    step: "6. Review your aid offers",
    desc: "Each college will send a financial aid offer. These come in different formats and can be confusing — we break down how to read them below.",
  },
];

const KEY_DATES = [
  { date: "October 1", event: "FAFSA opens for the following academic year" },
  { date: "November-February", event: "Priority deadlines for many schools (check each school individually)" },
  { date: "February 15", event: "CSS Profile priority deadline for many private colleges" },
  { date: "March-April", event: "Financial aid offers arrive with admission decisions" },
  { date: "May 1", event: "National Decision Day — commit to a school" },
  { date: "June 30", event: "FAFSA filing deadline (but file much earlier for best aid)" },
];

export default function FinancialAidPage() {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);
    setAiAnswer("");
    try {
      const result = await askFinancialAidQuestion(question);
      setAiAnswer(result.answer);
    } catch {
      setAiAnswer("Something went wrong. Please try again in a moment.");
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
              Financial Aid
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Don&apos;t leave money on the table
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The financial aid process is confusing by design. We break it down
              step by step — FAFSA, CSS Profile, reading offers, and how to
              appeal for more.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAFSA explained */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              FAFSA explained
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The Free Application for Federal Student Aid (FAFSA) is the
                gateway to nearly all financial aid — federal grants, loans,
                work-study, and most state and institutional aid. Even if you
                think you will not qualify, <strong>always file the FAFSA</strong>.
                Many schools require it for merit scholarships too.
              </p>
              <p>
                The FAFSA calculates your Student Aid Index (SAI), which is an
                estimate of what your family can contribute. Schools use this
                number — along with their own assessment — to build your aid
                package.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Step by step */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              FAFSA step-by-step
            </h2>
          </FadeIn>
          <div className="space-y-6">
            {FAFSA_STEPS.map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono-label text-sage text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-body font-medium text-navy">
                      {item.step}
                    </h3>
                    <p className="font-body text-navy/60 text-sm mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Key dates */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              Key dates
            </h2>
          </FadeIn>
          <div className="ktc-card overflow-hidden">
            {KEY_DATES.map((item, i) => (
              <FadeIn key={item.date} delay={i * 0.04}>
                <div
                  className={`flex items-start gap-4 p-4 ${
                    i < KEY_DATES.length - 1 ? "border-b border-card" : ""
                  }`}
                >
                  <span className="font-mono-label text-xs text-sage w-36 flex-shrink-0 pt-0.5">
                    {item.date}
                  </span>
                  <span className="font-body text-navy/70 text-sm">
                    {item.event}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="font-body text-navy/50 text-xs mt-3 italic">
            Dates can shift. Always verify deadlines on studentaid.gov and each
            college&apos;s financial aid page.
          </p>
        </div>
      </section>

      {/* CSS Profile */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              CSS Profile
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                About 200 colleges (mostly private) require the CSS Profile in
                addition to the FAFSA. It is more detailed and gives schools a
                more nuanced picture of your finances.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Administered by the College Board</strong> at cssprofile.collegeboard.org.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Costs $25 for the first school, $16 per additional school.</strong> Fee waivers are available for low-income families.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Considers home equity, business assets, and non-custodial parent income</strong> — factors the FAFSA ignores.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>File it early.</strong> Many schools have CSS Profile deadlines in November or February.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Reading an aid offer */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Reading a financial aid offer
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Aid offers can be deliberately confusing. Here is what to look
                for:
              </p>
              <div className="ktc-card p-6 mt-4 space-y-4">
                <div>
                  <h3 className="font-body font-medium text-sage mb-1">
                    Free money (grants and scholarships)
                  </h3>
                  <p className="text-navy/60 text-sm">
                    This is money you do not repay. It includes federal Pell
                    Grants, institutional grants, and merit scholarships. This is
                    the number that matters most.
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-sage mb-1">
                    Self-help aid (work-study and loans)
                  </h3>
                  <p className="text-navy/60 text-sm">
                    Work-study is a part-time job on campus. Federal loans
                    (subsidized and unsubsidized) must be repaid. These are not
                    gifts — factor them into your real cost.
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-crimson mb-1">
                    Parent PLUS loans
                  </h3>
                  <p className="text-navy/60 text-sm">
                    Some schools include Parent PLUS loans in their &ldquo;aid&rdquo;
                    offer. These are not aid — they are debt with relatively high
                    interest rates. Be cautious.
                  </p>
                </div>
                <div className="border-t border-card pt-4">
                  <h3 className="font-body font-medium text-navy mb-1">
                    Net cost
                  </h3>
                  <p className="text-navy/60 text-sm">
                    Total Cost of Attendance minus free money (grants +
                    scholarships) = your real out-of-pocket cost. Compare schools
                    on this number, not the sticker price.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How to appeal */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              How to appeal for more aid
            </h2>
            <p className="font-body text-navy/60 text-lg mb-6">
              This is one of the highest-value moves most families never make.
            </p>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Financial aid appeals are normal and expected. Schools have
                professional judgement authority to adjust your aid. Many families
                leave thousands of dollars on the table simply because they do
                not ask.
              </p>

              <div className="ktc-card p-6 mt-4">
                <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-3">
                  Appeal script framework
                </p>
                <div className="space-y-3 text-sm text-navy/60">
                  <p>
                    <strong>1. Express gratitude.</strong> &ldquo;We are thrilled
                    about [Student]&apos;s admission to [College] and it is their
                    top choice.&rdquo;
                  </p>
                  <p>
                    <strong>2. State the situation clearly.</strong> &ldquo;After
                    reviewing the financial aid offer, there is a gap between
                    what we can afford and the expected contribution.&rdquo;
                  </p>
                  <p>
                    <strong>3. Provide context.</strong> Share any special
                    circumstances: job loss, medical expenses, multiple children
                    in college, or a competing offer with more aid.
                  </p>
                  <p>
                    <strong>4. Be specific.</strong> &ldquo;[Comparable School]
                    offered $X more in institutional grants. We would love to
                    make [College] work and are hoping you can review our
                    package.&rdquo;
                  </p>
                  <p>
                    <strong>5. Be respectful and professional.</strong> This is a
                    conversation, not a negotiation. Financial aid officers want
                    to help.
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Call, do not just email.</strong> A phone call to the financial aid office is more personal and effective.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Appeal early.</strong> Schools have limited funds — the earlier you appeal, the more flexibility they have.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Be honest.</strong> Do not exaggerate your situation. Provide documentation if asked.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Comparing offers */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Comparing offers
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Never compare sticker prices. Always compare net cost — what you
                actually pay out of pocket after grants and scholarships.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Calculate the 4-year cost</strong>, not just year one. Some merit scholarships decrease or require GPA maintenance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Factor in living costs.</strong> A school in a high-cost city may be more expensive even with more aid.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Separate loans from grants</strong> in your comparison. $20K in grants is very different from $20K in loans.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Use our college comparison tool</strong> to see schools side by side.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Outside scholarships */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Outside scholarships
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Outside scholarships are awards from organizations other than
                your college — community groups, employers, foundations, and
                national organizations.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Apply broadly.</strong> Many smaller, local scholarships have fewer applicants and better odds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Ask about stacking policy.</strong> Some colleges reduce institutional aid when you win outside scholarships. Ask before you accept.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Never pay to apply.</strong> Legitimate scholarships do not charge application fees.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Check our scholarship finder</strong> for opportunities matched to your profile.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Dependency status */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Dependency status
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                For FAFSA purposes, most students under 24 are considered
                &ldquo;dependent&rdquo; — meaning parent income and assets are
                factored in, even if you live on your own or your parents do not
                help pay for college.
              </p>
              <p>
                You are considered <strong>independent</strong> if you meet any of
                these criteria: 24 or older, married, a veteran, an orphan or
                ward of the court, have legal dependents, or are an emancipated
                minor.
              </p>
              <p>
                If your family situation is complicated (estrangement, abuse,
                homelessness), talk to your school counselor or the college&apos;s
                financial aid office about a <strong>dependency override</strong>.
                These are handled case by case and require documentation.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AI Q&A */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-sage text-xs tracking-widest uppercase mb-2">
              AI financial aid advisor
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Ask any financial aid question
            </h2>
            <p className="font-body text-navy/60 mb-8">
              FAFSA, CSS Profile, appeals, scholarships, loan terms — ask
              anything. We will give you a clear, actionable answer.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="ktc-card p-6 md:p-8">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., 'My parents are divorced. Whose income goes on the FAFSA?' or 'How do I appeal my financial aid offer?'"
                rows={4}
                className="w-full font-body text-[15px] text-navy border border-card rounded-md p-4 bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 resize-y leading-relaxed placeholder:text-navy/30"
              />

              <div className="flex justify-end mt-4">
                <GoldButton
                  onClick={handleAsk}
                  disabled={loading || question.trim().length < 10}
                >
                  {loading ? "Thinking..." : "Ask question"}
                </GoldButton>
              </div>

              {loading && (
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              )}

              {aiAnswer && !loading && (
                <div className="mt-6 p-6 bg-white rounded-md border border-card">
                  <h3 className="font-display text-lg font-bold text-navy mb-3">
                    Answer
                  </h3>
                  <div className="font-body text-navy/75 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {aiAnswer}
                  </div>
                  <p className="font-body text-navy/40 text-xs mt-4 italic">
                    This is general guidance. For decisions involving significant
                    money, verify details with your college&apos;s financial aid
                    office or studentaid.gov.
                  </p>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="py-16 bg-white border-t border-card">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-6">
              Continue coaching
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/coach/essay" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Essay
              </Link>
              <Link href="/coach/recommendations" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Recommendations
              </Link>
              <Link href="/coach/roadmap" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Roadmap
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
