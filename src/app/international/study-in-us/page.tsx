import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Study in the US as an International Student — KidToCollege",
  description:
    "Complete guide for international students studying in the US: F-1 visa, TOEFL/IELTS, scholarships, financial aid, Common App, CPT/OPT, and proof of funds.",
  openGraph: {
    title: "Study in the US — KidToCollege",
    description:
      "F-1 visa process, TOEFL requirements, scholarships for international students, need-blind admissions, and working while studying in the US.",
  },
};

const VISA_STEPS = [
  {
    step: "1. Get accepted and receive your I-20",
    detail:
      "After a US university admits you, they will issue a Form I-20 (Certificate of Eligibility for Nonimmigrant Student Status). This is the document that enables you to apply for an F-1 visa. You need the I-20 from every school you plan to attend — but you will use the one from the school you choose to enrol at.",
  },
  {
    step: "2. Pay the SEVIS fee",
    detail:
      "SEVIS (Student and Exchange Visitor Information System) is the US government system that tracks international students. You must pay the I-901 SEVIS fee (currently $350 for F-1 students) before your visa interview. Pay online at fmjfee.com and keep the receipt — you will need it at the embassy.",
  },
  {
    step: "3. Complete the DS-160 visa application",
    detail:
      "The DS-160 is the Online Nonimmigrant Visa Application form. It is long and detailed — budget at least an hour. You will need your passport, I-20, SEVIS fee receipt, a digital photo, and information about your travel history, education, and employment. Save frequently — the form can time out.",
  },
  {
    step: "4. Schedule and attend your visa interview",
    detail:
      "Schedule an interview at your nearest US embassy or consulate. Wait times vary dramatically by country and season — in some locations, you may wait weeks or months, so plan well ahead. Bring your passport, I-20, DS-160 confirmation, SEVIS receipt, financial documents, academic transcripts, and your admission letter. The interview is typically brief (5-10 minutes) but important.",
  },
  {
    step: "5. Enter the US and check in with your DSO",
    detail:
      "You can enter the US up to 30 days before your programme start date. When you arrive, check in with your university's Designated School Official (DSO) — this is the person in the international student office who manages your SEVIS record. You must check in before classes begin.",
  },
];

const NEED_BLIND_SCHOOLS = [
  {
    name: "Harvard University",
    note: "Need-blind for all applicants. Meets 100% of demonstrated need.",
  },
  {
    name: "Yale University",
    note: "Need-blind for all applicants. Meets 100% of demonstrated need.",
  },
  {
    name: "Princeton University",
    note: "Need-blind for all applicants. Meets 100% of demonstrated need. No loans — all aid is grant-based.",
  },
  {
    name: "MIT",
    note: "Need-blind for all applicants. Meets 100% of demonstrated need.",
  },
  {
    name: "Amherst College",
    note: "Need-blind for all applicants. Meets 100% of demonstrated need.",
  },
];

export default function StudyInUSPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / Study in the US
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Studying in the US
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The American higher education system is the most sought-after in
              the world — and the most complex to navigate as an international
              student. This guide covers visas, costs, financial aid, testing,
              and the application process.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* F-1 Visa */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The F-1 visa process
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              The F-1 is the standard nonimmigrant student visa for academic
              studies in the US. It allows you to study full-time at an
              accredited university, college, or language training programme.
              Here is the step-by-step process.
            </p>
          </FadeIn>
          <div className="space-y-6">
            {VISA_STEPS.map((item, i) => (
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

      {/* Financial Aid */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Financial aid for international students
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                This is the hardest part. The vast majority of US universities
                are <strong className="text-navy">need-aware</strong> for
                international applicants — meaning your ability to pay affects
                your chance of admission. If you need financial aid, many schools
                will be less likely to admit you. This is the reality.
              </p>
              <p>
                International students are{" "}
                <strong className="text-navy">not eligible for FAFSA</strong>{" "}
                (federal financial aid), federal loans, or most state grants.
                Your aid will come from the university itself (institutional
                aid), private scholarships, or your home country&apos;s
                government programmes.
              </p>

              <div className="bg-cream rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-lg font-bold text-navy mb-3">
                  Need-blind schools for international students
                </h3>
                <p className="text-sm text-navy/70 mb-4">
                  These are the rare exceptions — universities that do not
                  consider your financial need when making admissions decisions
                  for international applicants, and that meet 100% of
                  demonstrated need:
                </p>
                <div className="space-y-3">
                  {NEED_BLIND_SCHOOLS.map((school) => (
                    <div key={school.name} className="flex gap-3 text-sm">
                      <span className="text-gold font-bold">&#9679;</span>
                      <div>
                        <strong className="text-navy">{school.name}:</strong>{" "}
                        <span className="text-navy/70">{school.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-navy/50 mt-4 italic">
                  This list is very short. A few other schools (Dartmouth,
                  Columbia, Cornell, etc.) are need-blind for US citizens and
                  meet full need for international students, but are need-aware
                  in the international admissions decision. Always check
                  directly.
                </p>
              </div>

              <h3 className="font-display text-xl font-bold text-navy mt-8 mb-3">
                Merit scholarships
              </h3>
              <p>
                Many US universities offer merit-based scholarships that
                international students are eligible for. These do not require
                demonstrated financial need — they are awarded for academic
                achievement, talent, or leadership. Some examples:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-navy">
                    Stamps Scholarship:
                  </strong>{" "}
                  Full cost of attendance at partner universities (including
                  Georgia Tech, Purdue, Michigan, and others). Must be nominated
                  through the admissions process.
                </li>
                <li>
                  <strong className="text-navy">
                    Presidential / Dean&apos;s Scholarships:
                  </strong>{" "}
                  Many universities (NYU, USC, Boston University, etc.) have
                  named merit awards ranging from $10,000/year to full tuition.
                  Usually automatic consideration at admission.
                </li>
                <li>
                  <strong className="text-navy">
                    University of Alabama / Arizona / Mississippi:
                  </strong>{" "}
                  Several large state universities offer generous automatic merit
                  scholarships for high SAT/ACT scores and GPAs — and
                  international students are eligible at some.
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TOEFL / IELTS */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              English proficiency: TOEFL and IELTS
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                If English is not your first language — or if you have not
                studied in English for a sufficient number of years — you will
                need to prove English proficiency. The two main tests are:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    TOEFL iBT
                  </h3>
                  <p className="text-sm">
                    Scored out of 120 (30 per section: Reading, Listening,
                    Speaking, Writing). Most competitive universities require{" "}
                    <strong>100+</strong>. Mid-range schools typically accept{" "}
                    <strong>80+</strong>. Top universities (Ivy League, Stanford,
                    MIT) often look for <strong>105-110+</strong>.
                  </p>
                  <p className="text-sm mt-2">
                    Cost: approximately $200-$325 depending on location. Scores
                    are valid for two years.
                  </p>
                </div>
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    IELTS Academic
                  </h3>
                  <p className="text-sm">
                    Scored on a 1-9 band scale. Most competitive US universities
                    require <strong>7.0+</strong>. Mid-range schools accept{" "}
                    <strong>6.5+</strong>. Top schools often want{" "}
                    <strong>7.5+</strong>. Some schools specify minimum scores
                    for individual sections (e.g., no section below 6.5).
                  </p>
                  <p className="text-sm mt-2">
                    Cost: approximately $245-$255. Scores are valid for two
                    years.
                  </p>
                </div>
              </div>
              <p>
                <strong className="text-navy">When to take it:</strong> Aim to
                have your scores ready by October of your senior year if you are
                applying Early Decision/Early Action, or by December for Regular
                Decision. Give yourself at least 2-3 months of preparation.
              </p>
              <p>
                <strong className="text-navy">Waivers:</strong> Some
                universities waive the English proficiency requirement if you
                have studied in English for four or more years, or if your
                SAT/ACT verbal scores are sufficiently high. Always check each
                school&apos;s policy.
              </p>
              <p>
                <strong className="text-navy">Duolingo English Test:</strong>{" "}
                Increasingly accepted (especially since COVID-19). Cheaper
                ($65), shorter, and taken at home. Accepted by over 4,000
                programmes. Check if your target schools accept it.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SAT/ACT */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              SAT and ACT for international students
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The standardised testing landscape has shifted significantly.
                Many US universities went test-optional during COVID-19 and some
                remain so. However, several elite universities (MIT, Georgetown,
                Dartmouth, and others) have reinstated test requirements.
              </p>
              <p>
                <strong className="text-navy">Our advice:</strong> If you can
                score well, submit scores. For international students especially,
                a strong SAT or ACT score provides an objective benchmark that
                admissions committees can compare across different education
                systems. It can strengthen your application.
              </p>
              <p>
                The SAT is available internationally at test centres in most
                countries. The ACT is also available internationally but at fewer
                locations. Registration deadlines are typically 4-6 weeks before
                the test date. Plan ahead — test centres in some countries fill
                quickly.
              </p>
              <p>
                For detailed test prep guidance, see our{" "}
                <Link
                  href="/coach/test-prep"
                  className="text-sage underline underline-offset-2"
                >
                  Test Prep
                </Link>{" "}
                section.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Common App */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The Common Application as an international student
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The Common App is the primary application platform for over 1,000
                US colleges and universities. International applicants use the
                same platform as domestic students — but there are a few
                differences to be aware of.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-navy">Counsellor profile:</strong> If
                  your school does not use the Common App system (most
                  international schools do not), your school counsellor will need
                  to create an account and submit your school profile, transcript,
                  and recommendation through the system. Brief them early.
                </li>
                <li>
                  <strong className="text-navy">Grading system:</strong> The
                  Common App accommodates different grading systems. Enter your
                  grades as they appear on your transcript — do not try to
                  convert to the US 4.0 scale yourself. The university will do
                  the conversion.
                </li>
                <li>
                  <strong className="text-navy">Financial aid forms:</strong>{" "}
                  Instead of FAFSA, you will likely complete the CSS Profile
                  (for schools that use it) and/or the university&apos;s own
                  financial aid form. Some require the International Student
                  Financial Aid Application (ISFAA).
                </li>
                <li>
                  <strong className="text-navy">Essays:</strong> The personal
                  essay and supplements are the same for all applicants. Your
                  international perspective can be a genuine strength — but write
                  authentically, not about being international for its own sake.
                </li>
              </ul>
              <p>
                For essay guidance, see our{" "}
                <Link
                  href="/coach/essay"
                  className="text-sage underline underline-offset-2"
                >
                  Essay Coach
                </Link>{" "}
                section.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Working While Studying */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Working while studying: CPT and OPT
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                F-1 students have limited but valuable work authorisation
                options:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    On-campus employment
                  </h3>
                  <p className="text-sm">
                    You can work up to <strong>20 hours/week</strong> during the
                    academic term and full-time during breaks, in positions on
                    campus. No special authorisation needed beyond your F-1
                    status.
                  </p>
                </div>
                <div className="ktc-card p-5">
                  <h3 className="font-display text-lg font-bold text-navy mb-2">
                    CPT (Curricular Practical Training)
                  </h3>
                  <p className="text-sm">
                    Work authorisation for internships or employment that is an{" "}
                    <strong>integral part of your curriculum</strong>. Must be
                    authorised by your DSO before you start. Available during
                    your studies — great for summer internships.
                  </p>
                </div>
              </div>
              <div className="ktc-card p-5">
                <h3 className="font-display text-lg font-bold text-navy mb-2">
                  OPT (Optional Practical Training)
                </h3>
                <p className="text-sm">
                  The big one. OPT allows you to work in the US for{" "}
                  <strong>12 months after graduation</strong> in a job related to
                  your field of study. STEM degree holders get an additional{" "}
                  <strong>24-month extension</strong> (total 36 months). OPT is
                  how many international graduates transition into H-1B
                  sponsorship and long-term careers in the US. Apply through
                  USCIS at least 90 days before your programme end date.
                </p>
              </div>
              <p className="text-xs text-navy/50 italic">
                Working without proper authorisation violates your F-1 status and
                can result in deportation. Always verify with your DSO before
                accepting any employment.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Cost Planning */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Cost planning and proof of funds
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                US universities require international students to demonstrate
                financial capacity before issuing an I-20. This means you need
                to show — through bank statements, sponsor letters, or
                scholarship letters — that you can cover at least one full year
                of tuition and living expenses.
              </p>
              <div className="bg-cream rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-lg font-bold text-navy mb-3">
                  Typical annual costs (2025-2026)
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["Tuition (private university)", "$55,000-$65,000"],
                    ["Tuition (public university, out-of-state)", "$30,000-$45,000"],
                    ["Room and board", "$14,000-$20,000"],
                    ["Books and supplies", "$1,000-$2,000"],
                    ["Personal expenses", "$2,000-$4,000"],
                    ["Health insurance", "$2,000-$4,000"],
                    ["Total (private)", "$75,000-$95,000"],
                    ["Total (public)", "$50,000-$75,000"],
                  ].map(([item, cost]) => (
                    <div
                      key={item}
                      className={`flex justify-between ${
                        item?.startsWith("Total")
                          ? "font-bold text-navy border-t border-navy/10 pt-2"
                          : ""
                      }`}
                    >
                      <span>{item}</span>
                      <span className="font-mono-label text-sm">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                These costs are real and substantial. If full-cost attendance is
                not realistic, focus your applications on schools that offer
                generous aid to international students, or consider starting at a
                community college (much lower cost) and transferring to a
                four-year university after two years.
              </p>
            </div>
          </FadeIn>
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
                { label: "Study in the States (DHS)", url: "https://studyinthestates.dhs.gov" },
                { label: "SEVP / SEVIS", url: "https://www.ice.gov/sevis" },
                { label: "TOEFL (ETS)", url: "https://www.ets.org/toefl" },
                { label: "IELTS", url: "https://www.ielts.org" },
                { label: "Common App", url: "https://www.commonapp.org" },
                { label: "College Board (SAT)", url: "https://www.collegeboard.org" },
                { label: "CSS Profile", url: "https://cssprofile.collegeboard.org" },
                { label: "EducationUSA", url: "https://educationusa.state.gov" },
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
                <Link href="/international/uk" className="text-navy/50 hover:text-navy transition-colors">UK</Link>
                <Link href="/international/canada" className="text-navy/50 hover:text-navy transition-colors">Canada</Link>
                <Link href="/international/australia" className="text-navy/50 hover:text-navy transition-colors">Australia</Link>
                <Link href="/international/europe" className="text-navy/50 hover:text-navy transition-colors">Europe</Link>
                <Link href="/international/global-scholarships" className="text-navy/50 hover:text-navy transition-colors">Global Scholarships</Link>
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
