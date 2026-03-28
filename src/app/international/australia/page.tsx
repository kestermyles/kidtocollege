import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Studying in Australia — KidToCollege",
  description:
    "Complete guide to Australian university admissions: UAC, ATAR scores, Group of Eight, international student costs, visas, and scholarships.",
  openGraph: {
    title: "Studying in Australia — KidToCollege",
    description:
      "UAC applications, ATAR explained, Group of Eight universities, and everything you need to apply to Australian universities.",
  },
};

const ADMISSIONS_BODIES = [
  {
    name: "UAC",
    region: "New South Wales & ACT",
    detail:
      "The Universities Admissions Centre handles applications to most universities in NSW and the ACT, including the University of Sydney, UNSW, Macquarie, and ANU. You create an account, list your preferences (up to five in the main round), and UAC processes offers based on your ATAR or equivalent ranking.",
    url: "https://www.uac.edu.au",
  },
  {
    name: "VTAC",
    region: "Victoria",
    detail:
      "The Victorian Tertiary Admissions Centre manages applications to universities in Victoria, including the University of Melbourne, Monash, RMIT, and Deakin. You can list up to eight preferences. Melbourne uses a unique model where most undergrads enter broad bachelor's degrees before specialising at the master's level.",
    url: "https://www.vtac.edu.au",
  },
  {
    name: "QTAC",
    region: "Queensland",
    detail:
      "The Queensland Tertiary Admissions Centre covers universities in Queensland, including UQ (University of Queensland), QUT, and Griffith. Up to six preferences. UQ is the state's Group of Eight member and consistently ranks among the world's top 50.",
    url: "https://www.qtac.edu.au",
  },
  {
    name: "SATAC",
    region: "South Australia & Northern Territory",
    detail:
      "The South Australian Tertiary Admissions Centre handles applications for institutions in SA and the NT, including the University of Adelaide and Flinders University. The University of Adelaide is South Australia's Group of Eight member.",
    url: "https://www.satac.edu.au",
  },
  {
    name: "TISC",
    region: "Western Australia",
    detail:
      "The Tertiary Institutions Service Centre manages applications for WA universities, including the University of Western Australia (UWA), Curtin, and Murdoch. UWA is the state's Group of Eight member.",
    url: "https://www.tisc.edu.au",
  },
];

const GROUP_OF_EIGHT = [
  {
    name: "University of Melbourne",
    location: "Melbourne, VIC",
    note: "Consistently ranked #1 in Australia. Uses a distinctive 'Melbourne Model' — broad undergraduate degrees followed by professional master's programs.",
  },
  {
    name: "Australian National University (ANU)",
    location: "Canberra, ACT",
    note: "Australia's national university. Particularly strong in political science, international relations, and Asia-Pacific studies. Located in the capital.",
  },
  {
    name: "University of Sydney",
    location: "Sydney, NSW",
    note: "Australia's oldest university (1850). Iconic campus. Strong across law, medicine, business, and the arts.",
  },
  {
    name: "University of Queensland (UQ)",
    location: "Brisbane, QLD",
    note: "Top research output in Australia. Strong in biosciences, engineering, and environmental science.",
  },
  {
    name: "UNSW Sydney",
    location: "Sydney, NSW",
    note: "Known for engineering, technology, and business. Strong industry connections and co-op programs.",
  },
  {
    name: "Monash University",
    location: "Melbourne, VIC",
    note: "Australia's largest university. World-leading in pharmacy, education, and medicine. Multiple campuses including one in Malaysia.",
  },
  {
    name: "University of Western Australia (UWA)",
    location: "Perth, WA",
    note: "Strong in marine sciences, agriculture, and mining/resources engineering. Beautiful campus on the Swan River.",
  },
  {
    name: "University of Adelaide",
    location: "Adelaide, SA",
    note: "Consistently produces above its weight in research. Known for wine science, health, and engineering. Lower cost of living than Sydney/Melbourne.",
  },
];

export default function AustraliaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / Australia
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Studying in Australia
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              World-class universities, a state-based admissions system, and a
              lifestyle that is hard to beat. Australia is the third most popular
              destination for international students globally — here is how to
              get there.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Admissions Bodies */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              State-based admissions
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              Australia does not have a national university application system.
              Each state (or group of states) has its own tertiary admissions
              centre. You apply through the centre for the state where your
              chosen university is located. International students can often
              apply directly to the university as well.
            </p>
          </FadeIn>
          <div className="space-y-6">
            {ADMISSIONS_BODIES.map((body, i) => (
              <FadeIn key={body.name} delay={i * 0.05}>
                <div className="ktc-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {body.name}
                    </h3>
                    <span className="font-mono-label text-gold text-xs tracking-wider whitespace-nowrap">
                      {body.region}
                    </span>
                  </div>
                  <p className="font-body text-navy/70 leading-relaxed text-sm">
                    {body.detail}
                  </p>
                  <a
                    href={body.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 font-body text-sm text-sage hover:underline underline-offset-2"
                  >
                    {body.name} website &rarr;
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ATAR */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              ATAR scores explained
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                The Australian Tertiary Admission Rank (ATAR) is a percentile
                ranking — not a score or a mark. An ATAR of 90.00 means you
                performed better than 90% of the Year 12 cohort in your state.
                The highest possible ATAR is 99.95.
              </p>
              <p>
                Each university course has a published ATAR cutoff (sometimes
                called a &ldquo;selection rank&rdquo;). If your ATAR meets or
                exceeds the cutoff, you receive an offer. Some courses also
                consider interviews, portfolios, or auditions.
              </p>
              <div className="bg-cream rounded-lg p-6 border border-gold/20">
                <h3 className="font-display text-lg font-bold text-navy mb-3">
                  Typical ATAR cutoffs
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["Medicine (graduate entry)", "99.00+"],
                    ["Law (combined degrees)", "95.00-99.00"],
                    ["Engineering", "80.00-95.00"],
                    ["Commerce / Business", "85.00-97.00"],
                    ["Arts / Humanities", "70.00-90.00"],
                    ["Nursing", "65.00-80.00"],
                    ["Education", "60.00-80.00"],
                  ].map(([course, atar]) => (
                    <div key={course} className="flex justify-between">
                      <span className="text-navy/80">{course}</span>
                      <span className="font-mono-label text-gold text-sm">
                        {atar}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-navy/50 mt-3 italic">
                  Cutoffs vary significantly by university and year. Always check
                  the specific institution.
                </p>
              </div>
              <p>
                <strong className="text-navy">
                  For American students:
                </strong>{" "}
                You will not have an ATAR. Australian universities assess
                international applicants using their own qualifications — GPA,
                SAT/ACT scores, AP or IB results. Each university publishes
                equivalencies for international qualifications. Contact the
                university&apos;s international admissions office directly.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Group of Eight */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The Group of Eight
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              The Group of Eight (Go8) is a coalition of Australia&apos;s eight
              leading research-intensive universities. They receive over 70% of
              Australian competitive research funding and produce more than 60%
              of the country&apos;s research output. Think of them as
              Australia&apos;s equivalent to the Russell Group in the UK or the
              top research universities in the US.
            </p>
          </FadeIn>
          <div className="space-y-4">
            {GROUP_OF_EIGHT.map((uni, i) => (
              <FadeIn key={uni.name} delay={i * 0.05}>
                <div className="ktc-card p-5">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {uni.name}
                    </h3>
                    <span className="font-mono-label text-gold text-xs">
                      {uni.location}
                    </span>
                  </div>
                  <p className="font-body text-navy/70 text-sm leading-relaxed">
                    {uni.note}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Costs and Visa */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              International student costs and visa
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Australia is not a budget destination. International tuition
                ranges from roughly <strong className="text-navy">AUD
                $30,000-$50,000/year</strong> for most courses, with medicine
                and veterinary science exceeding AUD $70,000/year at some
                universities. Living costs add approximately AUD
                $21,000-$30,000/year depending on the city (Sydney and Melbourne
                are the most expensive).
              </p>
              <div className="bg-cream rounded-lg p-6 border border-gold/20 mt-4">
                <h3 className="font-display text-lg font-bold text-navy mb-3">
                  Student visa (subclass 500)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong className="text-navy">Eligibility:</strong> You must
                    have a Confirmation of Enrolment (CoE) from a registered
                    institution, adequate financial capacity, English proficiency,
                    and Overseas Student Health Cover (OSHC).
                  </li>
                  <li>
                    <strong className="text-navy">Financial capacity:</strong>{" "}
                    You must demonstrate access to at least AUD $24,505/year for
                    living costs (in addition to tuition and travel). This can be
                    through bank statements, loans, or a financial declaration
                    from a sponsor.
                  </li>
                  <li>
                    <strong className="text-navy">Work rights:</strong>{" "}
                    International students on a subclass 500 visa can work up to
                    48 hours per fortnight during term and unlimited hours during
                    scheduled breaks.
                  </li>
                  <li>
                    <strong className="text-navy">Processing time:</strong>{" "}
                    Typically 4-8 weeks. Apply well before your course start date.
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Scholarships
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Australia has a growing scholarship landscape for international
                students, though it is less generous than the US or UK at the
                undergraduate level.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-navy">Australia Awards:</strong>{" "}
                  Funded by the Australian Government, primarily for students
                  from developing countries. Covers tuition, living costs, and
                  travel. Highly competitive.
                </li>
                <li>
                  <strong className="text-navy">
                    Destination Australia:
                  </strong>{" "}
                  Scholarships for students studying at regional campuses.
                  AUD $15,000/year.
                </li>
                <li>
                  <strong className="text-navy">
                    University-specific scholarships:
                  </strong>{" "}
                  Most Go8 universities offer merit-based scholarships for
                  international students. The University of Melbourne, ANU, and
                  UQ all have significant programs. Check each
                  university&apos;s scholarship page directly.
                </li>
                <li>
                  <strong className="text-navy">
                    Research Training Program (RTP):
                  </strong>{" "}
                  For postgraduate research students. Covers tuition and
                  provides a living stipend.
                </li>
              </ul>
              <p>
                See also our{" "}
                <Link
                  href="/international/global-scholarships"
                  className="text-sage underline underline-offset-2"
                >
                  Global Scholarships
                </Link>{" "}
                page.
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
                { label: "Study Australia", url: "https://www.studyaustralia.gov.au" },
                { label: "UAC", url: "https://www.uac.edu.au" },
                { label: "VTAC", url: "https://www.vtac.edu.au" },
                { label: "QTAC", url: "https://www.qtac.edu.au" },
                { label: "Group of Eight", url: "https://go8.edu.au" },
                { label: "Immigration (Visa 500)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" },
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
