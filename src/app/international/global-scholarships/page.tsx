import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Global Scholarships — KidToCollege",
  description:
    "Major international scholarship awards: Chevening, Fulbright, DAAD, Rhodes, Marshall, Schwarzman, Erasmus Mundus, and more. Eligibility, coverage, and application timelines.",
  openGraph: {
    title: "Global Scholarships — KidToCollege",
    description:
      "The world's most prestigious international scholarships. Coverage, eligibility, deadlines, and how to apply.",
  },
};

const SCHOLARSHIPS = [
  {
    name: "Rhodes Scholarship",
    destination: "University of Oxford, UK",
    type: "Postgraduate (Master's / DPhil)",
    description:
      "The oldest and arguably most prestigious international scholarship. Established in 1903, the Rhodes Scholarship fully funds postgraduate study at the University of Oxford. Scholars join a global network of leaders across every field. The selection process is famously rigorous — academic excellence alone is not enough. Rhodes looks for character, commitment to service, and leadership.",
    eligibility:
      "Citizens of eligible countries (including the US). Typically aged 19-25 at application. Must have completed a bachelor's degree.",
    coverage:
      "Full tuition, college fees, personal stipend (approximately GBP 18,180/year), health insurance, economy flights, and settling-in allowance.",
    timeline:
      "Applications open in June, due in October. Interviews in November. Scholars begin at Oxford the following October.",
    url: "https://www.rhodeshouse.ox.ac.uk/scholarships",
  },
  {
    name: "Marshall Scholarship",
    destination: "Any UK university",
    type: "Postgraduate (1-2 years)",
    description:
      "Funded by the British government, the Marshall Scholarship sends outstanding young Americans to study at any UK university. Up to 50 scholars are selected each year. Like the Rhodes, this is about more than academics — Marshall looks for ambassadors who will strengthen the US-UK relationship.",
    eligibility:
      "US citizens only. Must have a minimum 3.7 GPA. Must have graduated from a US university no more than two years before the start of the scholarship.",
    coverage:
      "Full tuition, living allowance (London and non-London rates), annual book grant, thesis grant, research and travel grants, fares to and from the US.",
    timeline:
      "Applications open in April, due in early October. Interviews in November. Scholars begin the following autumn.",
    url: "https://www.marshallscholarship.org",
  },
  {
    name: "Chevening Scholarship",
    destination: "Any UK university",
    type: "One-year Master's",
    description:
      "The UK government's flagship global scholarship programme, funded by the Foreign, Commonwealth and Development Office. Chevening funds future leaders and influencers from around the world to study a one-year master's in the UK. Over 1,500 scholarships are awarded annually across 160+ countries.",
    eligibility:
      "Citizens of Chevening-eligible countries (US citizens are NOT eligible — this is for citizens of developing and emerging economies). Must have at least two years of work experience. Must return to your home country for at least two years after the scholarship.",
    coverage:
      "Full tuition (up to GBP 18,000), monthly living allowance, economy return flights, arrival allowance, departure allowance, thesis/dissertation grant.",
    timeline:
      "Applications typically open in August and close in early November. Interviews in February-April. Awards announced in June.",
    url: "https://www.chevening.org",
  },
  {
    name: "Commonwealth Scholarships",
    destination: "UK and other Commonwealth countries",
    type: "Postgraduate (Master's and PhD)",
    description:
      "Funded by the UK government through the Commonwealth Scholarship Commission, these scholarships enable talented students from Commonwealth countries to study in the UK. Over 800 awards are made each year across multiple schemes — including master's, split-site PhD, and professional fellowships.",
    eligibility:
      "Citizens of Commonwealth countries (not the US or UK). Must be a permanent resident of an eligible Commonwealth country. Must hold a first degree of at least upper second class standard.",
    coverage:
      "Varies by scheme. Typically includes tuition, living allowance, return airfare, thesis grant, and warm clothing allowance. PhD scholars receive additional allowances.",
    timeline:
      "Applications open in August-September with a December deadline. Interviews in March-April. Awards for the following academic year.",
    url: "https://cscuk.fcdo.gov.uk",
  },
  {
    name: "Fulbright Program",
    destination: "Various countries (US government programme)",
    type: "Study, research, and teaching abroad",
    description:
      "The Fulbright Program is the US government's flagship international exchange programme. It enables Americans to study, research, or teach abroad — and brings international students to the US. For American students, the Fulbright US Student Program funds a year of study or research in one of over 140 countries. It is one of the most recognised awards in the world.",
    eligibility:
      "US citizens for outbound programs. International citizens for inbound programs. Must hold a bachelor's degree by the start of the grant. Must meet country-specific requirements.",
    coverage:
      "Varies by country. Typically includes round-trip transportation, living stipend, health insurance, and sometimes tuition. Some countries offer full tuition coverage; others provide a stipend only.",
    timeline:
      "Applications open in March, due in October. Awards announced in March-May of the following year. Programs begin in the autumn.",
    url: "https://us.fulbrightonline.org",
  },
  {
    name: "DAAD Scholarships",
    destination: "Germany",
    type: "Undergraduate, Master's, PhD, and research",
    description:
      "The German Academic Exchange Service (DAAD) is the world's largest funding organization for international academic exchange. DAAD offers scholarships for virtually every level of study and research in Germany — from summer courses to full PhD funding. Over 150,000 students and researchers are supported each year.",
    eligibility:
      "Open to students and researchers of all nationalities. Specific requirements vary by program. Most require a completed bachelor's degree for master's scholarships.",
    coverage:
      "Varies by program. Master's scholarships typically provide EUR 992/month plus health insurance, travel allowance, and sometimes tuition. PhD scholarships provide EUR 1,300/month plus allowances.",
    timeline:
      "Deadlines vary by program — typically October-November for programs starting the following year. Check the DAAD scholarship database for specific programs.",
    url: "https://www.daad.de/en",
  },
  {
    name: "Erasmus Mundus Joint Master Degrees",
    destination: "Multiple European countries",
    type: "Master's (1-2 years, multi-country)",
    description:
      "Erasmus Mundus Joint Master Degrees are prestigious, integrated study programmes delivered by consortia of at least three universities in different European countries. Students study in at least two countries and receive a joint or multiple degree. These are among the best-funded master's programs in the world for international students.",
    eligibility:
      "Open to students worldwide. Must hold a bachelor's degree. Each programme has specific academic requirements.",
    coverage:
      "Full-scholarship students receive up to EUR 1,400/month for living costs, EUR 1,000/installation costs, tuition coverage, and travel costs. Scholarships are awarded for the full duration of the programme.",
    timeline:
      "Most programmes have deadlines between October and January for the following academic year. Applications are made directly to the programme consortium.",
    url: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
  },
  {
    name: "Schwarzman Scholars",
    destination: "Tsinghua University, Beijing, China",
    type: "One-year Master's in Global Affairs",
    description:
      "Modelled on the Rhodes Scholarship but based in China, the Schwarzman Scholars program brings together 200 students annually from around the world for a one-year master's at Tsinghua University — one of China's top two universities. The programme is designed to prepare future leaders to understand China's role in the world.",
    eligibility:
      "Open to all nationalities. Aged 18-28 at time of application. Must hold a bachelor's degree. English proficiency required (taught in English).",
    coverage:
      "Full tuition, room and board, travel to and from Beijing, in-country study tours, personal stipend, health insurance, and laptop.",
    timeline:
      "Applications open in April, due in September. Interviews in October-November. Scholars begin the following August.",
    url: "https://www.schwarzmanscholars.org",
  },
  {
    name: "Aga Khan Foundation International Scholarship",
    destination: "Various countries",
    type: "Postgraduate (Master's and PhD)",
    description:
      "The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from developing countries. The scholarship is awarded on a 50% grant / 50% loan basis — half is a gift, half must be repaid after graduation. This unusual model encourages a sense of responsibility and gives back to the fund.",
    eligibility:
      "Citizens of select developing countries (primarily in Asia and Africa). Must have no other funding. Must demonstrate financial need.",
    coverage:
      "Tuition and living costs, on a 50% grant / 50% loan basis. The loan portion is interest-free and repayable over five years.",
    timeline:
      "Applications open in January, due in March. Decisions in June-July.",
    url: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
  },
  {
    name: "Jardine Scholarship",
    destination: "University of Oxford or University of Cambridge, UK",
    type: "Undergraduate (3-4 years)",
    description:
      "One of the few fully-funded undergraduate scholarships at Oxford or Cambridge for international students. Funded by the Jardine Matheson Group, the scholarship is available to students from specific Asian countries. Scholars join a close-knit community and receive mentorship throughout their studies.",
    eligibility:
      "Citizens of Cambodia, mainland China, Hong Kong, Indonesia, Malaysia, Myanmar, the Philippines, Singapore, Taiwan, Thailand, and Vietnam. Must apply to Oxford or Cambridge through the normal admissions process.",
    coverage:
      "Full tuition, college fees, and a generous annual living allowance for the full duration of the undergraduate degree.",
    timeline:
      "Applications are typically submitted alongside the UCAS application (October). Shortlisted candidates are interviewed in January-February.",
    url: "https://www.jardinescholarship.org",
  },
];

export default function GlobalScholarshipsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / Global Scholarships
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Global scholarships
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              The world&apos;s most prestigious and generous international
              scholarship programmes. From the Rhodes to Erasmus Mundus, these
              awards can fully fund your education abroad.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                International scholarships are intensely competitive but
                extraordinarily rewarding. A single award can cover tuition,
                living costs, flights, and insurance — and the network you join
                often matters as much as the funding itself.
              </p>
              <p>
                Below are ten of the most significant international scholarship
                programmes. Each has different eligibility criteria, so read
                carefully — some are for Americans going abroad, some are for
                international students coming to specific countries, and some are
                open to everyone.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scholarship Cards */}
      <section className="py-12 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-8">
            {SCHOLARSHIPS.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.04}>
                <div className="ktc-card p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h3 className="font-display text-xl font-bold text-navy">
                      {s.name}
                    </h3>
                    <span className="font-mono-label text-gold text-xs tracking-wider whitespace-nowrap">
                      {s.type}
                    </span>
                  </div>
                  <p className="font-mono-label text-sage text-xs tracking-wider mb-4">
                    {s.destination}
                  </p>

                  <p className="font-body text-navy/70 text-sm leading-relaxed mb-4">
                    {s.description}
                  </p>

                  <div className="bg-cream rounded-lg p-4 space-y-2 text-sm font-body">
                    <p>
                      <strong className="text-navy">Eligibility:</strong>{" "}
                      <span className="text-navy/70">{s.eligibility}</span>
                    </p>
                    <p>
                      <strong className="text-navy">Coverage:</strong>{" "}
                      <span className="text-navy/70">{s.coverage}</span>
                    </p>
                    <p>
                      <strong className="text-navy">Timeline:</strong>{" "}
                      <span className="text-navy/70">{s.timeline}</span>
                    </p>
                  </div>

                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 font-body text-sm font-medium text-navy border-2 border-gold rounded-md px-5 py-2.5 hover:bg-gold hover:text-navy transition-colors"
                  >
                    Official website &rarr;
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Advice */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              How to approach international scholarships
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                These scholarships are not like filling out a FAFSA. They are
                competitive awards that require months of preparation. Here is
                what the strongest applicants do:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-navy">Start early.</strong> Most
                  deadlines are 12-18 months before the programme begins.
                  Research opens even earlier. Build a timeline that works
                  backwards from the deadline.
                </li>
                <li>
                  <strong className="text-navy">
                    Know what makes each scholarship different.
                  </strong>{" "}
                  Rhodes values character and service. Marshall wants ambassadors.
                  Fulbright emphasises cultural exchange. Tailor every word of your
                  application to the specific values of the award.
                </li>
                <li>
                  <strong className="text-navy">
                    Get your references right.
                  </strong>{" "}
                  Referees should know you well enough to write specifically about
                  why you are suited to this award — not just that you are a good
                  student.
                </li>
                <li>
                  <strong className="text-navy">
                    Apply to multiple awards.
                  </strong>{" "}
                  These are highly competitive. The acceptance rate for most
                  programmes listed here is under 5%. Apply to every award you
                  are eligible for.
                </li>
                <li>
                  <strong className="text-navy">
                    Use your university&apos;s scholarship office.
                  </strong>{" "}
                  Many US universities have dedicated offices for nationally
                  competitive awards. They review applications, conduct mock
                  interviews, and connect you with past winners.
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-12 bg-cream border-t border-card">
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
