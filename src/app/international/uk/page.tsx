import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Studying in the UK — KidToCollege",
  description:
    "Complete guide to UK university admissions: UCAS, personal statements, A-level requirements, Russell Group, student finance, and key dates.",
  openGraph: {
    title: "Studying in the UK — KidToCollege",
    description:
      "UCAS applications, Russell Group universities, personal statements, and everything you need to apply to UK universities.",
  },
};

const UCAS_STEPS = [
  {
    step: "1. Register on UCAS Hub",
    detail:
      "Create an account on the UCAS Hub (ucas.com). If you are applying through a school or college, your centre will give you a buzzword to link your application. If you are applying independently, you register as an individual.",
  },
  {
    step: "2. Choose up to 5 courses",
    detail:
      "You can apply to a maximum of five courses at five different universities (or five courses at the same university, though this is unusual). For medicine, dentistry, and veterinary science, four of your five choices must be in that subject. You can use your fifth choice for a related course as a backup.",
  },
  {
    step: "3. Write your personal statement",
    detail:
      "The personal statement is 4,000 characters (including spaces) — roughly 500-600 words. It is the single most important part of your application outside of your grades. Unlike US college essays, the UK personal statement is academic-focused. More on this below.",
  },
  {
    step: "4. Provide your qualifications and predicted grades",
    detail:
      "You enter your current qualifications and predicted grades. If you are still studying, your school provides predicted grades. For American students, this means your GPA and any AP/IB scores. Admissions tutors use predicted grades to make conditional offers.",
  },
  {
    step: "5. Get a reference",
    detail:
      "Your school or an academic referee provides a reference directly through UCAS. This is a structured academic reference — not the same as a US recommendation letter. It typically covers your academic ability, suitability for the course, and any relevant circumstances.",
  },
  {
    step: "6. Pay and submit",
    detail:
      "The UCAS application fee is currently around £27.50 for a single choice or £27.50 for up to five choices. Once submitted, your application goes to all chosen universities simultaneously.",
  },
];

const RUSSELL_GROUP = [
  "University of Birmingham",
  "University of Bristol",
  "University of Cambridge",
  "Cardiff University",
  "Durham University",
  "University of Edinburgh",
  "University of Exeter",
  "University of Glasgow",
  "Imperial College London",
  "King's College London",
  "University of Leeds",
  "University of Liverpool",
  "London School of Economics (LSE)",
  "University of Manchester",
  "Newcastle University",
  "University of Nottingham",
  "University of Oxford",
  "Queen Mary University of London",
  "Queen's University Belfast",
  "University of Sheffield",
  "University of Southampton",
  "University College London (UCL)",
  "University of Warwick",
  "University of York",
];

const KEY_DATES = [
  {
    date: "May (year before entry)",
    event: "UCAS search tool opens — start researching courses",
  },
  {
    date: "September",
    event: "UCAS applications open for the following year's entry",
  },
  {
    date: "15 October",
    event:
      "Deadline for Oxford, Cambridge, medicine, dentistry, and veterinary science",
  },
  {
    date: "31 January",
    event: "Main UCAS deadline for all other courses (equal consideration)",
  },
  {
    date: "February-March",
    event: "UCAS Extra opens for those who used all five choices without an offer",
  },
  {
    date: "March-May",
    event: "Universities send decisions; you respond through UCAS (firm and insurance choice)",
  },
  {
    date: "A-level results day (mid-August)",
    event:
      "Conditional offers confirmed or rejected. Clearing opens for students without a place.",
  },
];

export default function UKPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / United Kingdom
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Studying in the UK
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The UK university system is fundamentally different from the US.
              Three-year degrees, subject-specific applications, and a national
              admissions service called UCAS. Here is everything you need to
              know.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* UCAS Process */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The UCAS application process
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              UCAS (Universities and Colleges Admissions Service) is the
              centralised system through which almost all UK undergraduate
              applications are made. Think of it as the Common App for the UK —
              except you apply to specific courses (subjects), not just
              universities. You do not apply &ldquo;undeclared.&rdquo;
            </p>
          </FadeIn>
          <div className="space-y-6">
            {UCAS_STEPS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="ktc-card p-6">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    {item.step}
                  </h3>
                  <p className="font-body text-navy/70 leading-relaxed text-sm">
                    {item.detail}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Statement */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The personal statement — it is not like a US essay
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                This is one of the biggest differences American students need to
                understand. The UK personal statement is{" "}
                <strong className="text-navy">purely academic</strong>. It is
                about why you want to study this subject, what you have read or
                done to explore it, and how your mind works. It is not about your
                life story, your extracurriculars, or your community service.
              </p>
              <p>
                Do not write about why you love a particular university. You send
                the same personal statement to all five choices, so it must be
                about the subject, not the institution.
              </p>
              <div className="bg-cream rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-lg font-bold text-navy mb-3">
                  What to include
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-sage font-bold">1.</span>
                    Why this subject — what sparked your interest and why it has
                    deepened
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sage font-bold">2.</span>
                    What you have read, watched, or researched beyond the
                    classroom (super-curricular, not extracurricular)
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sage font-bold">3.</span>
                    How those readings or experiences shaped your thinking about
                    the subject
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sage font-bold">4.</span>
                    Relevant academic skills — analytical thinking, research,
                    problem-solving
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sage font-bold">5.</span>
                    Brief mention of relevant work experience or projects (only
                    if directly subject-related)
                  </li>
                </ul>
              </div>
              <div className="bg-crimson/5 rounded-lg p-6 border border-crimson/20">
                <h3 className="font-display text-lg font-bold text-crimson mb-3">
                  What to leave out
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    &bull; Sports, clubs, and extracurriculars (unless directly
                    relevant to the subject)
                  </li>
                  <li>&bull; Personal hardship stories or life narratives</li>
                  <li>
                    &bull; Why you want to attend a specific university
                  </li>
                  <li>&bull; Quotes from famous people</li>
                  <li>&bull; Cliches like &ldquo;ever since I was young&rdquo;</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* A-levels and IB */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Entry requirements: A-levels, IB, and US qualifications
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                UK universities make offers based on predicted (and later,
                actual) exam results. The most common qualifications are A-levels
                (three subjects, graded A*-E) and the International
                Baccalaureate (IB, scored out of 45 points).
              </p>
              <p>
                <strong className="text-navy">Typical A-level offers:</strong>{" "}
                Top universities ask for A*A*A to AAB depending on the course.
                Oxbridge and medicine routinely require A*A*A or higher.
                Mid-ranking universities may offer BBB-ABC.
              </p>
              <p>
                <strong className="text-navy">IB equivalents:</strong> A typical
                IB offer ranges from 32-38 points total, with some courses
                specifying minimum points in Higher Level subjects (e.g., 6,6,6
                at HL). Oxford and Cambridge often ask for 38-40+ points.
              </p>
              <p>
                <strong className="text-navy">US qualifications:</strong> Many
                UK universities accept a combination of AP scores and SAT/ACT
                results. Typical requirements might be three or more APs at
                scores of 4-5, plus a strong GPA. Check each university&apos;s
                international admissions page — requirements vary significantly.
              </p>
              <p>
                <strong className="text-navy">Contextual offers:</strong> Many
                universities offer lower grade requirements to students from
                disadvantaged backgrounds, certain postcodes, or specific school
                types. This primarily applies to UK-based students, but some
                contextual data is used for international applicants.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Student Finance */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Fees and student finance
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                UK tuition fees depend on where you are from and where you are
                studying.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    UK / Home students
                  </h3>
                  <p className="text-sm">
                    Tuition fees are capped at <strong>£9,250/year</strong> in
                    England. Scottish students studying in Scotland pay no
                    tuition (funded by SAAS). Welsh and Northern Irish students
                    have their own arrangements.
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Plan 5 loans:</strong> Repayments begin when you earn
                    above the threshold (currently around £25,000/year). You repay
                    9% of earnings above that threshold. Loans are written off
                    after 40 years.
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Maintenance loans:</strong> Available to cover living
                    costs, based on household income. The amount varies by where
                    you study (London vs elsewhere) and whether you live at home.
                  </p>
                </div>
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    International students
                  </h3>
                  <p className="text-sm">
                    Fees are set by each university and are significantly higher —
                    typically <strong>£15,000-£30,000/year</strong> for most
                    courses, and up to £45,000+ for medicine.
                  </p>
                  <p className="text-sm mt-2">
                    International students are <strong>not eligible</strong> for
                    UK student loans. You must demonstrate the ability to pay fees
                    and living costs as part of your visa application.
                  </p>
                  <p className="text-sm mt-2">
                    Some universities offer scholarships specifically for
                    international students — check the{" "}
                    <Link
                      href="/international/global-scholarships"
                      className="text-sage underline underline-offset-2"
                    >
                      Global Scholarships
                    </Link>{" "}
                    section and individual university websites.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Russell Group */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The Russell Group
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The Russell Group is an association of 24 leading UK
                research-intensive universities. Think of it loosely as the UK
                equivalent of the Ivy League in terms of reputation — although
                the analogy is imperfect. Russell Group universities receive the
                majority of UK research funding and are consistently ranked among
                the best in the world.
              </p>
              <p>
                Being in the Russell Group is not the only marker of quality.
                Several excellent universities (St Andrews, Bath, Lancaster,
                Loughborough) are not members. However, for international
                recognition and graduate employment, the Russell Group is widely
                regarded as the premier tier.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
              {RUSSELL_GROUP.map((uni) => (
                <div
                  key={uni}
                  className="font-body text-sm text-navy/80 py-2 px-3 bg-cream rounded"
                >
                  {uni}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Key Dates */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Key dates
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {KEY_DATES.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex gap-4 items-start">
                  <span className="font-mono-label text-gold text-sm font-bold whitespace-nowrap min-w-[160px]">
                    {item.date}
                  </span>
                  <span className="font-body text-navy/70 text-sm leading-relaxed">
                    {item.event}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Official Links */}
      <section className="py-20 bg-cream border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-6">
              Official resources
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "UCAS", url: "https://www.ucas.com" },
                {
                  label: "Student Finance England",
                  url: "https://www.gov.uk/student-finance",
                },
                {
                  label: "Russell Group",
                  url: "https://russellgroup.ac.uk",
                },
                {
                  label: "SAAS (Scotland)",
                  url: "https://www.saas.gov.uk",
                },
                {
                  label: "UK Visas & Immigration",
                  url: "https://www.gov.uk/student-visa",
                },
              ].map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-body text-sm font-medium text-navy border-2 border-gold rounded-md px-5 py-2.5 hover:bg-gold hover:text-navy transition-colors"
                >
                  {link.label} &rarr;
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-12 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/international"
                className="font-body text-sage font-medium hover:underline underline-offset-2"
              >
                &larr; Back to International Hub
              </Link>
              <div className="flex flex-wrap gap-3 text-sm font-body">
                <Link href="/international/canada" className="text-navy/50 hover:text-navy transition-colors">Canada</Link>
                <Link href="/international/australia" className="text-navy/50 hover:text-navy transition-colors">Australia</Link>
                <Link href="/international/europe" className="text-navy/50 hover:text-navy transition-colors">Europe</Link>
                <Link href="/international/global-scholarships" className="text-navy/50 hover:text-navy transition-colors">Global Scholarships</Link>
                <Link href="/international/study-in-us" className="text-navy/50 hover:text-navy transition-colors">Study in US</Link>
              </div>
            </div>
            <p className="font-mono-label text-navy/40 text-xs tracking-widest uppercase text-center mt-8">
              This is a guide — always verify directly with the institution and
              relevant government body.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
