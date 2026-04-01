import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { TestPrepPlanner } from "@/components/TestPrepPlanner";

export const metadata: Metadata = {
  title: "Test Prep — The Coach — KidToCollege",
  description:
    "SAT vs ACT strategy, score targets, free resources, test-optional guidance, AP/IB exam planning, and PSAT importance.",
};

const FREE_RESOURCES = [
  {
    name: "Khan Academy SAT Prep",
    url: "https://www.khanacademy.org/sat",
    desc: "Official College Board partner. Free, personalized SAT practice based on your PSAT scores.",
  },
  {
    name: "ACT Academy",
    url: "https://academy.act.org",
    desc: "Free practice from the ACT makers. Diagnostic tests and targeted practice.",
  },
  {
    name: "College Board Practice Tests",
    url: "https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests",
    desc: "Full-length, official SAT practice tests. The gold standard for realistic practice.",
  },
  {
    name: "CrackACT / CrackSAT",
    url: "https://www.crackact.com",
    desc: "Free access to past official ACT and SAT tests. Excellent for timed practice.",
  },
];

export default function TestPrepPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              Test Prep
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Test smarter, not harder
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The right strategy saves time and raises scores. Here is
              everything you need to know about standardised testing — and what
              to do about it.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Test-optional strategy — introductory section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-gold text-xs tracking-widest uppercase mb-2">
              Strategy
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Should you submit your score?
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              The real question isn&apos;t whether a school is test-optional.
              It&apos;s whether <strong>your</strong> score helps or hurts you —
              and whether it can save you money.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Submit column */}
              <div className="ktc-card p-6 border-l-4 border-sage">
                <h3 className="font-display text-lg font-bold text-sage mb-4">
                  Submit your score if:
                </h3>
                <ul className="space-y-3 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    Your score is at or above the school&apos;s 75th percentile
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    You&apos;re applying test-optional but your score is within 50
                    points of the median — submit, it differentiates you
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    You&apos;re borderline on GPA — a strong score compensates
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    The school offers automatic merit aid tied to scores (many do
                    even if they&apos;re &ldquo;test optional&rdquo; for admissions)
                  </li>
                </ul>
              </div>

              {/* Don't submit column */}
              <div className="ktc-card p-6 border-l-4 border-crimson">
                <h3 className="font-display text-lg font-bold text-crimson mb-4">
                  Do NOT submit your score if:
                </h3>
                <ul className="space-y-3 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0" />
                    Your score is below the school&apos;s 25th percentile
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0" />
                    Your GPA is strong and you don&apos;t need the boost
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0" />
                    The school explicitly states scores play no role
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0" />
                    You haven&apos;t had time to prepare properly
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Key insight */}
          <FadeIn delay={0.2}>
            <div className="mt-8 bg-gold/10 border border-gold/30 rounded-lg p-6">
              <p className="font-body text-navy leading-relaxed">
                <strong>Your SAT/ACT score is a financial lever, not just an
                admissions lever.</strong> A score in the top 25% at your target
                school can unlock $8,000–$15,000/year in automatic merit
                scholarships — even at test-optional schools. Run the numbers
                before you decide not to submit.
              </p>
            </div>
          </FadeIn>

          {/* Where to find score ranges */}
          <FadeIn delay={0.3}>
            <div className="mt-6 font-body text-navy/60 text-sm">
              <p>
                <strong className="text-navy">Where to find each school&apos;s score ranges:</strong>{" "}
                Check the Common Data Set for each school (Section C) or use our
                college pages — we surface the 25th and 75th percentile scores
                for every college in our database.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/coach/merit-sweet-spot"
                className="inline-block font-body font-medium bg-gold hover:bg-gold/90 text-navy px-6 py-3 rounded-md transition-all"
              >
                See where your score lands &rarr;
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Personalised Study Plan */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p className="font-mono-label text-gold text-xs tracking-widest uppercase mb-2">
              Personalised Study Plan
            </p>
            <h2 className="font-display text-3xl font-bold text-navy mb-2">
              Build your SAT/ACT roadmap
            </h2>
            <p className="font-body text-navy/60 mb-8">
              Enter your scores and study preferences. Our AI will create a
              week-by-week study plan with score predictions, resource
              recommendations, and milestone checkpoints.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <TestPrepPlanner />
          </FadeIn>
        </div>
      </section>

      {/* SAT vs ACT */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              SAT vs ACT: Which one?
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Every college in the US accepts both equally. The choice should
                be based on your strengths, not prestige. Here is how they
                differ:
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="ktc-card p-6">
                <h3 className="font-display text-xl font-bold text-navy mb-4">SAT</h3>
                <ul className="space-y-2 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Digital format, adaptive (section-level)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    2 hours 14 minutes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Math is roughly half the score
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    More vocabulary-in-context
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Score range: 400-1600
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Best for: Strong readers who are solid (not necessarily exceptional) in math
                  </li>
                </ul>
              </div>
              <div className="ktc-card p-6">
                <h3 className="font-display text-xl font-bold text-navy mb-4">ACT</h3>
                <ul className="space-y-2 font-body text-navy/70 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Paper or digital depending on state
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    2 hours 55 minutes (plus optional writing)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Includes a dedicated Science section
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    More questions, faster pace
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Score range: 1-36 (composite)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    Best for: Fast workers who are comfortable with science/data interpretation
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-6 p-4 bg-cream rounded-md border border-card">
              <p className="font-body text-navy/60 text-sm">
                <strong className="text-navy">Pro tip:</strong> Take a timed
                practice test for each. Whichever feels more natural and yields a
                higher score relative to percentile — that is your test.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What score do you need */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              What score do you need?
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Your target score depends on where you are applying. A good rule
                of thumb: aim for the 50th percentile or above of admitted
                students at your target school.
              </p>
              <div className="ktc-card p-6 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-2">Ivy League / Top 20</p>
                    <p className="font-body text-navy font-medium">SAT: 1500+</p>
                    <p className="font-body text-navy font-medium">ACT: 34+</p>
                  </div>
                  <div>
                    <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-2">Top 50</p>
                    <p className="font-body text-navy font-medium">SAT: 1350-1500</p>
                    <p className="font-body text-navy font-medium">ACT: 30-34</p>
                  </div>
                  <div>
                    <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-2">Competitive State Schools</p>
                    <p className="font-body text-navy font-medium">SAT: 1200-1400</p>
                    <p className="font-body text-navy font-medium">ACT: 26-31</p>
                  </div>
                  <div>
                    <p className="font-mono-label text-xs text-sage uppercase tracking-wider mb-2">Merit Scholarship Range</p>
                    <p className="font-body text-navy font-medium">SAT: 1300+</p>
                    <p className="font-body text-navy font-medium">ACT: 29+</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-navy/50 italic">
                Use our college research tool to find the exact score range for any specific school.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-8">
              Testing timeline
            </h2>
          </FadeIn>
          <div className="space-y-6">
            {[
              { when: "Sophomore Fall", what: "Take the PSAT for practice. Use the score to identify weak areas." },
              { when: "Sophomore Spring/Summer", what: "Begin focused prep. 30 minutes a day is more effective than weekend cram sessions." },
              { when: "Junior Fall", what: "Take the PSAT/NMSQT (October). This is the qualifying test for National Merit." },
              { when: "Junior Winter", what: "Take your first real SAT or ACT. December or February are common dates." },
              { when: "Junior Spring", what: "Retake if needed. Most students improve 50-100 SAT points on a second attempt." },
              { when: "Junior Summer", what: "Final retake opportunity if needed. Focus prep on specific weak sections." },
              { when: "Senior Fall", what: "Last chance to test (October/September). Send scores to colleges." },
            ].map((item, i) => (
              <FadeIn key={item.when} delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2.5 rounded-full bg-sage flex-shrink-0" />
                  <div>
                    <h3 className="font-body font-medium text-navy text-sm">{item.when}</h3>
                    <p className="font-body text-navy/60 text-sm">{item.what}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Free resources */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Free resources
            </h2>
            <p className="font-body text-navy/60 mb-8">
              You do not need expensive test prep. These free resources are as
              good as — or better than — most paid courses.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {FREE_RESOURCES.map((r, i) => (
              <FadeIn key={r.name} delay={i * 0.06}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ktc-card p-5 block group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="font-body font-medium text-navy group-hover:text-sage transition-colors mb-1">
                    {r.name}
                  </h3>
                  <p className="font-body text-navy/55 text-sm">{r.desc}</p>
                  <span className="inline-flex items-center text-gold text-xs font-body mt-2">
                    Visit site
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Test-optional strategy */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Test-optional strategy
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Many colleges went test-optional during COVID and some remain so.
                But &ldquo;test-optional&rdquo; does not mean &ldquo;test-blind.&rdquo;
                Here is how to think about it:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Submit if your score is at or above the school&apos;s middle 50%.</strong> A strong score always helps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Do not submit a below-average score.</strong> It cannot help and may hurt.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Going test-optional means the rest of your application must be stronger.</strong> GPA, essays, and activities carry more weight.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>For merit scholarships, scores often still matter.</strong> Many auto-merit awards are score-based even at test-optional schools.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* AP/IB Exams */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              AP and IB exams
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                AP and IB scores demonstrate college-level readiness and can earn
                you credit, saving thousands in tuition.
              </p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>AP scores of 4 or 5</strong> are accepted for credit at most colleges. Some accept 3s.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>IB Higher Level scores of 6 or 7</strong> typically earn credit. Standard Level usually does not.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Take AP/IB courses in subjects you are strong in.</strong> A B in an AP class is often viewed better than an A in a regular class.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span><strong>Do not overload.</strong> Colleges want to see rigour, but they also want to see you thriving — not drowning.</span>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* PSAT importance */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Why the PSAT matters more than you think
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The PSAT is not just practice. In your junior year, it is the
                qualifying exam for the National Merit Scholarship Program, which
                awards $2,500 scholarships — and, more importantly, can unlock
                massive full-ride offers from colleges that recruit National Merit
                Finalists.
              </p>
              <div className="ktc-card p-6 mt-4">
                <h3 className="font-body font-medium text-navy mb-2">National Merit timeline</h3>
                <ul className="space-y-2 text-sm text-navy/60">
                  <li><strong>October (Junior Year):</strong> Take the PSAT/NMSQT</li>
                  <li><strong>September (Senior Year):</strong> Semifinalists announced (top ~1% per state)</li>
                  <li><strong>February (Senior Year):</strong> Finalists announced</li>
                  <li><strong>Spring (Senior Year):</strong> Scholarship winners notified</li>
                </ul>
              </div>
              <p className="text-sm text-navy/50 italic mt-4">
                Even if you do not qualify for National Merit, the PSAT gives you
                a realistic SAT score prediction and connects you with Khan
                Academy for personalised practice.
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
              <Link href="/coach/essay" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                The Essay
              </Link>
              <Link href="/coach/interviews" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Interviews
              </Link>
              <Link href="/coach/financial-aid" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Financial Aid
              </Link>
              <Link href="/coach/merit-sweet-spot" className="font-body text-sm bg-white border border-card rounded-md px-5 py-2.5 text-navy hover:border-gold/40 transition-colors">
                Merit Sweet Spot
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
