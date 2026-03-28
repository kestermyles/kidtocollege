import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Studying in Canada — KidToCollege",
  description:
    "Complete guide to Canadian university admissions: province-by-province applications, tuition costs, top universities, co-op programs, and study permits.",
  openGraph: {
    title: "Studying in Canada — KidToCollege",
    description:
      "Province-by-province guide to Canadian universities. OUAC, tuition comparison, co-op programs, and scholarships for international students.",
  },
};

const PROVINCES = [
  {
    name: "Ontario",
    system: "OUAC (Ontario Universities' Application Centre)",
    detail:
      "Ontario has the largest concentration of universities in Canada. Applications go through OUAC — the Ontario equivalent of the Common App. You apply to specific programs at specific universities. The 101 application is for Ontario high school students; the 105 application is for everyone else, including international applicants. Most programs require specific prerequisite courses, and admission averages are published or well-known.",
    url: "https://www.ouac.on.ca",
  },
  {
    name: "British Columbia",
    system: "EducationPlannerBC",
    detail:
      "BC uses EducationPlannerBC for applications to most post-secondary institutions in the province. UBC, SFU, and other major universities accept applications through this portal or directly. BC also has a strong college-to-university transfer system — students can complete two years at a college and transfer into the third year of a university degree.",
    url: "https://www.educationplannerbc.ca",
  },
  {
    name: "Alberta",
    system: "ApplyAlberta",
    detail:
      "ApplyAlberta is the centralised portal for applications to Alberta's post-secondary institutions, including the University of Alberta and University of Calgary. Applications typically open in October for the following fall. Alberta's universities are known for strong engineering, sciences, and energy-sector programs.",
    url: "https://www.applyalberta.ca",
  },
  {
    name: "Quebec",
    system: "CEGEP + University",
    detail:
      "Quebec has a unique system. After secondary school (which ends at grade 11), students attend CEGEP — a two-year pre-university or three-year technical college. University bachelor's degrees in Quebec are then three years instead of four. For students from outside Quebec (including Americans), you typically apply directly to the university for a four-year program, or enter CEGEP first. McGill University has its own direct application process.",
    url: "https://www.sram.qc.ca",
  },
];

const TOP_UNIVERSITIES = [
  {
    name: "University of Toronto",
    location: "Toronto, ON",
    known: "Canada's highest-ranked university globally. Three campuses (St. George, Mississauga, Scarborough). Especially strong in medicine, engineering, business, and humanities.",
  },
  {
    name: "University of British Columbia",
    location: "Vancouver, BC",
    known: "Consistently ranked top 3 in Canada. Stunning campus. Strong across sciences, forestry, film, and business. Generous entrance scholarships for international students.",
  },
  {
    name: "McGill University",
    location: "Montreal, QC",
    known: "English-language university in francophone Montreal. Known for medicine, law, and the arts. Relatively affordable for international students compared to US peers of similar calibre.",
  },
  {
    name: "University of Waterloo",
    location: "Waterloo, ON",
    known: "Canada's co-op powerhouse. The largest co-operative education program in the world. Exceptional for computer science, engineering, and mathematics. Strong tech industry pipeline.",
  },
  {
    name: "McMaster University",
    location: "Hamilton, ON",
    known: "World-renowned for its medical school and problem-based learning model. Strong health sciences, engineering, and business programs.",
  },
  {
    name: "University of Alberta",
    location: "Edmonton, AB",
    known: "Top 5 in Canada for research funding. Excellent for engineering, AI/machine learning, and energy sciences. Lower cost of living than Toronto or Vancouver.",
  },
  {
    name: "Queen's University",
    location: "Kingston, ON",
    known: "Strong sense of community and campus culture. Well-regarded commerce (Smith School of Business), engineering, and law programs.",
  },
];

export default function CanadaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / Canada
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Studying in Canada
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              World-class universities, relatively affordable tuition, and the
              largest co-op education system in the world. Canada is one of the
              most popular destinations for American students going abroad — and
              for good reason.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Province by Province */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Province-by-province applications
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              Unlike the US Common App, Canada does not have a single national
              application system. Each province has its own portal, and some
              universities accept direct applications. This can be confusing at
              first, but once you identify your target province, the process is
              straightforward.
            </p>
          </FadeIn>
          <div className="space-y-6">
            {PROVINCES.map((prov, i) => (
              <FadeIn key={prov.name} delay={i * 0.05}>
                <div className="ktc-card p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-lg font-bold text-navy">
                      {prov.name}
                    </h3>
                    <span className="font-mono-label text-gold text-xs tracking-wider whitespace-nowrap">
                      {prov.system}
                    </span>
                  </div>
                  <p className="font-body text-navy/70 leading-relaxed text-sm">
                    {prov.detail}
                  </p>
                  <a
                    href={prov.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 font-body text-sm text-sage hover:underline underline-offset-2"
                  >
                    {prov.system} &rarr;
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Tuition: domestic vs. international
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                One of Canada&apos;s biggest draws is affordability. Even for
                international students, tuition at many Canadian universities is
                lower than comparable US institutions — though the gap has been
                narrowing.
              </p>
            </div>
            <div className="overflow-x-auto mt-6">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b-2 border-navy/10">
                    <th className="text-left py-3 pr-4 font-display text-navy">
                      Province
                    </th>
                    <th className="text-right py-3 px-4 font-display text-navy">
                      Domestic (CAD)
                    </th>
                    <th className="text-right py-3 pl-4 font-display text-navy">
                      International (CAD)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-navy/70">
                  {[
                    ["Ontario", "$7,000-$12,000", "$25,000-$60,000"],
                    ["British Columbia", "$6,000-$10,000", "$25,000-$50,000"],
                    ["Alberta", "$5,500-$9,000", "$20,000-$40,000"],
                    ["Quebec (out-of-province)", "$9,000-$11,000", "$20,000-$45,000"],
                    ["Quebec (in-province)", "$3,000-$4,000", "$20,000-$45,000"],
                    ["Atlantic provinces", "$6,000-$9,000", "$15,000-$30,000"],
                  ].map(([prov, dom, intl]) => (
                    <tr key={prov} className="border-b border-navy/5">
                      <td className="py-3 pr-4">{prov}</td>
                      <td className="py-3 px-4 text-right font-mono-label text-sm">
                        {dom}
                      </td>
                      <td className="py-3 pl-4 text-right font-mono-label text-sm">
                        {intl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-body text-navy/50 text-xs mt-4 italic">
              Approximate annual ranges. Amounts vary by university and program.
              Professional programs (medicine, law, MBA) cost significantly
              more. All figures in Canadian dollars.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Top universities
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              Canada has many excellent universities. These are among the most
              internationally recognized, but strong regional universities
              (Dalhousie, Ottawa, Western, Victoria, Simon Fraser) also offer
              outstanding education and value.
            </p>
          </FadeIn>
          <div className="space-y-4">
            {TOP_UNIVERSITIES.map((uni, i) => (
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
                    {uni.known}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pathway from the US */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Applying from the US
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Canadian universities are generally familiar with the US
                education system, which makes the application process relatively
                smooth for American students.
              </p>
              <div className="bg-cream rounded-lg p-6 border border-gold/20 space-y-3">
                <h3 className="font-display text-lg font-bold text-navy">
                  What you need
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong className="text-navy">Transcripts:</strong> Your
                    high school transcript will be evaluated directly. Canadian
                    universities understand the US GPA system. Some may ask for a
                    WES or IQAS credential evaluation, but many do not for US
                    applicants.
                  </li>
                  <li>
                    <strong className="text-navy">SAT/ACT:</strong> Many
                    Canadian universities accept SAT or ACT scores but do not
                    require them from US applicants with strong GPAs. Check each
                    program&apos;s requirements.
                  </li>
                  <li>
                    <strong className="text-navy">Study permit:</strong>{" "}
                    Americans need a Canadian study permit for programs longer
                    than six months. Apply online through IRCC (Immigration,
                    Refugees and Citizenship Canada). You will need your letter
                    of acceptance, proof of financial support, and a valid
                    passport. Processing times vary.
                  </li>
                  <li>
                    <strong className="text-navy">English proficiency:</strong>{" "}
                    Most universities waive English proficiency requirements for
                    students who completed high school in English in the US.
                    French-language programs at Quebec universities may require a
                    French proficiency test.
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Co-op */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Co-op programs: the Waterloo model
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Co-operative education (co-op) is one of Canada&apos;s greatest
                strengths. Co-op students alternate between academic terms and
                paid work terms with real employers. By graduation, you have 16-20
                months of professional experience — and significant earnings to
                offset tuition.
              </p>
              <p>
                The <strong className="text-navy">University of Waterloo</strong>{" "}
                operates the largest co-op program in the world. Students in
                engineering, computer science, and mathematics routinely complete
                six work terms with employers like Google, Apple, Tesla, and
                major Canadian banks. Average co-op earnings for a Waterloo CS
                student over their degree can exceed $100,000 CAD.
              </p>
              <p>
                Other universities with strong co-op programs include Simon
                Fraser University, the University of Victoria, the University of
                Ottawa, and Toronto Metropolitan University. Many Ontario
                universities also offer optional co-op streams.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Scholarships for international students
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Most Canadian universities offer entrance scholarships for
                international students based on academic merit. These are
                typically automatic (no separate application) and range from
                $2,000 to $40,000 CAD.
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-navy">
                    UBC International Scholars:
                  </strong>{" "}
                  Up to full tuition coverage for outstanding international
                  applicants.
                </li>
                <li>
                  <strong className="text-navy">
                    U of T Lester B. Pearson Scholarship:
                  </strong>{" "}
                  Full ride (tuition, books, residence, incidentals) for four
                  years. Nomination-based.
                </li>
                <li>
                  <strong className="text-navy">
                    McGill Entrance Scholarships:
                  </strong>{" "}
                  Range from $3,000 to $12,000/year, automatically considered at
                  admission.
                </li>
                <li>
                  <strong className="text-navy">
                    Schulich Leader Scholarships:
                  </strong>{" "}
                  $100,000 for engineering or $80,000 for science/math at
                  partner universities. Must be nominated by your school.
                </li>
                <li>
                  <strong className="text-navy">Vanier Canada Graduate:</strong>{" "}
                  $50,000/year for three years for graduate students. Highly
                  competitive.
                </li>
              </ul>
              <p>
                Also see our{" "}
                <Link
                  href="/international/global-scholarships"
                  className="text-sage underline underline-offset-2"
                >
                  Global Scholarships
                </Link>{" "}
                page for broader international awards.
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
                { label: "OUAC (Ontario)", url: "https://www.ouac.on.ca" },
                { label: "EducationPlannerBC", url: "https://www.educationplannerbc.ca" },
                { label: "ApplyAlberta", url: "https://www.applyalberta.ca" },
                { label: "EduCanada", url: "https://www.educanada.ca" },
                { label: "IRCC Study Permit", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html" },
                { label: "Universities Canada", url: "https://www.univcan.ca" },
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
