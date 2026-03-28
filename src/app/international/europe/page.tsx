import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Studying in Europe — KidToCollege",
  description:
    "Guide to European universities: English-taught degrees, low/no tuition countries, the Netherlands, Germany, Scandinavia, Bologna Process, and application platforms.",
  openGraph: {
    title: "Studying in Europe — KidToCollege",
    description:
      "Free or low-cost tuition, English-taught degrees, and world-class universities across Europe. Everything you need to apply.",
  },
};

const COUNTRIES = [
  {
    name: "The Netherlands",
    headline: "Most popular with international students",
    detail:
      "The Netherlands has the highest concentration of English-taught bachelor's programs in continental Europe. Over 2,100 programs are taught entirely in English. Dutch universities follow a three-year bachelor's model (180 ECTS credits), which is one year shorter than in the US. The academic culture emphasises problem-based learning and group work.",
    tuition: "Approximately EUR 2,500/year for EU/EEA students; EUR 8,000-15,000/year for non-EU students. Still significantly cheaper than the US.",
    application: "Studielink (studielink.nl) — the national application platform. You can apply to up to four programs simultaneously.",
    note: "Numerus fixus: Some popular programs (medicine, psychology, certain business degrees) have limited places and require early application plus a selection process. Deadlines for numerus fixus programs are typically 15 January — months earlier than standard deadlines.",
  },
  {
    name: "Germany",
    headline: "No tuition at public universities",
    detail:
      "Germany charges no tuition fees at public universities for any nationality — bachelor's and master's. You pay only a semester contribution (around EUR 150-350) that includes public transport. This makes Germany one of the most affordable places to study in the world. The catch: most bachelor's programs are taught in German. English-taught bachelor's are growing but still limited. English-taught master's programs are abundant.",
    tuition: "EUR 0 tuition at public universities (all nationalities). The state of Baden-Württemberg charges EUR 1,500/semester for non-EU students.",
    application: "uni-assist (uni-assist.de) handles applications for most universities. TU9 and U15 universities may have separate portals. Some accept direct applications.",
    note: "You will need to open a blocked account (Sperrkonto) with approximately EUR 11,904 to prove you can support yourself for one year. This is a visa requirement.",
  },
  {
    name: "Denmark",
    headline: "Strong design, tech, and sustainability focus",
    detail:
      "Denmark offers numerous English-taught programs at both bachelor's and master's level. The University of Copenhagen, Aarhus University, and the Technical University of Denmark (DTU) are world-ranked. Danish universities are known for a flat hierarchy, project-based learning, and strong industry integration.",
    tuition: "Free for EU/EEA students. Non-EU students pay EUR 6,000-16,000/year depending on the program.",
    application: "optagelse.dk for bachelor's programs. Direct university application for master's. Deadline is typically 15 March for non-EU applicants.",
    note: "Denmark has generous government grants (SU) for EU students who work part-time. Non-EU students can work up to 20 hours/week.",
  },
  {
    name: "Sweden",
    headline: "Innovation, sustainability, Nobel heritage",
    detail:
      "Sweden has a strong tradition of English-taught programs, especially at the master's level. Karolinska Institutet (medicine), KTH Royal Institute of Technology, and Lund University are globally ranked. Swedish universities emphasise independent thinking, sustainability, and innovation.",
    tuition: "Free for EU/EEA/Swiss students. Non-EU students pay SEK 80,000-295,000/year (approximately EUR 7,000-26,000).",
    application: "universityadmissions.se — the central application portal for all Swedish universities. One application, multiple program choices. Application deadline is typically 15 January for autumn semester.",
    note: "The Swedish Institute offers scholarships for non-EU students covering tuition and living costs. Highly competitive but generous.",
  },
  {
    name: "Finland",
    headline: "Free for EU students, affordable for all",
    detail:
      "Finland offers some of the best education in the world and numerous English-taught programs. The University of Helsinki, Aalto University, and the University of Turku are leading institutions. Finland consistently ranks among the top countries for quality of life, safety, and education outcomes.",
    tuition: "Free for EU/EEA students. Non-EU students pay EUR 4,000-18,000/year for bachelor's and master's programs.",
    application: "Opintopolku (studyinfo.fi) — the Finnish application portal. Entrance exams are common, especially for bachelor's programs.",
    note: "Finnish universities often require entrance exams for admission — even for international applicants. This is different from most other European systems. Prepare specifically for these exams.",
  },
  {
    name: "Czech Republic",
    headline: "Free tuition in Czech, affordable in English",
    detail:
      "Public universities in the Czech Republic charge no tuition for programs taught in Czech. English-taught programs are available but carry a fee. Prague is one of the most affordable capital cities in Europe, making the total cost of studying very competitive. Charles University in Prague is one of the oldest universities in the world (founded 1348).",
    tuition: "Free for Czech-language programs (all nationalities). English-taught programs: EUR 2,000-10,000/year.",
    application: "Direct application to each university. No centralised portal. Deadlines vary but are typically February-April for autumn entry.",
    note: "Learning Czech is a realistic option — the language is difficult but free preparatory language courses are offered by some universities.",
  },
];

export default function EuropePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <p className="font-mono-label text-gold text-sm tracking-widest uppercase mb-4">
              International / Europe
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Studying in Europe
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="font-body text-xl text-white/75 max-w-2xl mx-auto">
              Free tuition in Germany. World-class universities in the
              Netherlands. English-taught degrees across the continent. Europe
              offers extraordinary value — if you know where to look.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Bologna Process */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              The Bologna Process: how European degrees work
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Since the Bologna Process was adopted across Europe, most
                countries follow a three-cycle degree structure:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 my-6">
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-gold text-2xl font-bold">
                    3 yrs
                  </p>
                  <p className="font-display text-navy font-bold mt-1">
                    Bachelor&apos;s
                  </p>
                  <p className="text-sm text-navy/60 mt-1">180 ECTS credits</p>
                </div>
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-gold text-2xl font-bold">
                    1-2 yrs
                  </p>
                  <p className="font-display text-navy font-bold mt-1">
                    Master&apos;s
                  </p>
                  <p className="text-sm text-navy/60 mt-1">
                    60-120 ECTS credits
                  </p>
                </div>
                <div className="ktc-card p-5 text-center">
                  <p className="font-mono-label text-gold text-2xl font-bold">
                    3-4 yrs
                  </p>
                  <p className="font-display text-navy font-bold mt-1">
                    Doctorate
                  </p>
                  <p className="text-sm text-navy/60 mt-1">Research-based</p>
                </div>
              </div>
              <p>
                This means a European bachelor&apos;s degree is typically{" "}
                <strong className="text-navy">one year shorter</strong> than a
                US bachelor&apos;s. You specialise from day one rather than
                taking general education courses. A bachelor&apos;s plus
                master&apos;s in Europe (4-5 years) is roughly equivalent to a
                US bachelor&apos;s (4 years) in terms of depth, but with more
                specialisation.
              </p>
              <p>
                ECTS (European Credit Transfer System) credits make it easy to
                transfer between universities and have your qualifications
                recognised across Europe.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Country Guides */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Country-by-country guide
            </h2>
            <p className="font-body text-navy/70 leading-relaxed mb-8">
              These are the countries with the strongest English-taught degree
              programs and the most international-student-friendly systems. Each
              has its own application platform, deadlines, and quirks.
            </p>
          </FadeIn>
          <div className="space-y-8">
            {COUNTRIES.map((country, i) => (
              <FadeIn key={country.name} delay={i * 0.05}>
                <div className="ktc-card p-6">
                  <h3 className="font-display text-xl font-bold text-navy mb-1">
                    {country.name}
                  </h3>
                  <p className="font-mono-label text-sage text-xs tracking-wider mb-3">
                    {country.headline}
                  </p>
                  <div className="font-body text-navy/70 text-sm space-y-3 leading-relaxed">
                    <p>{country.detail}</p>
                    <div className="bg-cream rounded p-4 space-y-2">
                      <p>
                        <strong className="text-navy">Tuition:</strong>{" "}
                        {country.tuition}
                      </p>
                      <p>
                        <strong className="text-navy">How to apply:</strong>{" "}
                        {country.application}
                      </p>
                      <p className="text-navy/60 italic">
                        {country.note}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Erasmus */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Erasmus and exchange programmes
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                <strong className="text-navy">Erasmus+</strong> is the EU&apos;s
                flagship programme for education and training. It funds student
                exchanges, giving you the opportunity to study at a partner
                university in another European country for one or two semesters
                — usually with no additional tuition.
              </p>
              <p>
                If you enrol at a European university for your degree, you may be
                eligible for an Erasmus exchange during your studies. For
                American students, some US universities have bilateral exchange
                agreements with European institutions that function similarly.
                Check your home university&apos;s study abroad office.
              </p>
              <p>
                <strong className="text-navy">Erasmus Mundus Joint Masters</strong>{" "}
                are particularly noteworthy — these are prestigious master&apos;s
                programs taught across multiple European universities, with
                generous scholarships for international students. See the{" "}
                <Link
                  href="/international/global-scholarships"
                  className="text-sage underline underline-offset-2"
                >
                  Global Scholarships
                </Link>{" "}
                section for details.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Cost of Living */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Cost of living comparison
            </h2>
            <div className="font-body text-navy/70 space-y-4 leading-relaxed">
              <p>
                Tuition is only part of the picture. Living costs vary
                dramatically across Europe. Here is a rough monthly estimate for
                student living (accommodation, food, transport, personal):
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="border-b-2 border-navy/10">
                      <th className="text-left py-3 pr-4 font-display text-navy">
                        City
                      </th>
                      <th className="text-right py-3 pl-4 font-display text-navy">
                        Monthly cost (EUR)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-navy/70">
                    {[
                      ["Amsterdam", "EUR 1,200-1,600"],
                      ["Munich", "EUR 1,100-1,500"],
                      ["Copenhagen", "EUR 1,200-1,500"],
                      ["Stockholm", "EUR 1,000-1,400"],
                      ["Helsinki", "EUR 900-1,200"],
                      ["Berlin", "EUR 900-1,200"],
                      ["Prague", "EUR 600-900"],
                      ["Lisbon", "EUR 700-1,000"],
                      ["Vienna", "EUR 900-1,200"],
                    ].map(([city, cost]) => (
                      <tr key={city} className="border-b border-navy/5">
                        <td className="py-3 pr-4">{city}</td>
                        <td className="py-3 pl-4 text-right font-mono-label text-sm">
                          {cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-navy/50 italic">
                Estimates for 2025-2026. Accommodation is the biggest variable —
                university housing is significantly cheaper where available.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Application Platforms */}
      <section className="py-20 bg-white border-t border-card">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy mb-4">
              Application platforms at a glance
            </h2>
            <div className="space-y-3 mt-6">
              {[
                {
                  platform: "Studielink",
                  country: "Netherlands",
                  url: "https://www.studielink.nl",
                  note: "National portal. Up to 4 programmes. Deadline: 1 May (standard) or 15 Jan (numerus fixus).",
                },
                {
                  platform: "uni-assist",
                  country: "Germany",
                  url: "https://www.uni-assist.de",
                  note: "Evaluates international credentials for German universities. Some unis accept direct applications.",
                },
                {
                  platform: "universityadmissions.se",
                  country: "Sweden",
                  url: "https://www.universityadmissions.se",
                  note: "Central portal for all Swedish universities. Deadline: 15 January for autumn start.",
                },
                {
                  platform: "Opintopolku / Studyinfo",
                  country: "Finland",
                  url: "https://studyinfo.fi",
                  note: "Finnish national portal. Entrance exams common. Joint application rounds in January and March.",
                },
                {
                  platform: "optagelse.dk",
                  country: "Denmark",
                  url: "https://www.optagelse.dk",
                  note: "For bachelor's programmes in Denmark. Master's: apply directly to universities.",
                },
              ].map((item) => (
                <div key={item.platform} className="ktc-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-bold text-navy">
                        {item.platform}
                      </span>
                      <span className="font-mono-label text-gold text-xs">
                        {item.country}
                      </span>
                    </div>
                    <p className="font-body text-navy/60 text-sm mt-1">
                      {item.note}
                    </p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-sage hover:underline underline-offset-2 whitespace-nowrap"
                  >
                    Visit &rarr;
                  </a>
                </div>
              ))}
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
                { label: "Study in Holland", url: "https://www.studyinholland.nl" },
                { label: "Study in Germany (DAAD)", url: "https://www.study-in-germany.de" },
                { label: "Study in Sweden", url: "https://studyinsweden.se" },
                { label: "Study in Denmark", url: "https://studyindenmark.dk" },
                { label: "Study in Finland", url: "https://www.studyinfinland.fi" },
                { label: "Erasmus+", url: "https://erasmus-plus.ec.europa.eu" },
                { label: "Study in Europe (EU)", url: "https://education.ec.europa.eu/study-in-europe" },
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
