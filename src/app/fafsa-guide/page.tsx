import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Calculator,
  GraduationCap,
  BarChart3,
  BookOpen,
  Search,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  Pin,
  Info,
  FileDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FAFSA Guide: How to Pay Less for College",
  description:
    "Understand FAFSA, CSS Profile, Student Aid Index, merit scholarships, and financial aid appeals. A free, fact-checked guide to reducing what your family pays for college.",
  alternates: {
    canonical: "https://kidtocollege.com/fafsa-guide",
  },
  openGraph: {
    title: "FAFSA Guide: How to Pay Less for College",
    description:
      "Free guide covering FAFSA, CSS Profile, SAI, merit aid, scholarships and aid appeals — fact-checked against official federal sources.",
    url: "https://kidtocollege.com/fafsa-guide",
    siteName: "KidToCollege",
    type: "article",
  },
};

export default function FAFSAGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "FAFSA Guide: How to Pay Less for College",
    description:
      "Comprehensive guide to FAFSA, CSS Profile, Student Aid Index, merit aid, scholarships, and reducing college costs.",
    url: "https://kidtocollege.com/fafsa-guide",
    publisher: {
      "@type": "Organization",
      name: "KidToCollege",
      url: "https://kidtocollege.com",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── SECTION A — Hero ─── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="font-mono-label text-xs uppercase tracking-wider text-navy/40 mb-6">
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>{" "}
            /{" "}
            <span className="text-navy/40">Resources</span> /{" "}
            <span className="text-navy/60">FAFSA Guide</span>
          </nav>

          {/* Badge */}
          <span className="inline-block font-mono-label text-xs px-3 py-1 rounded-full bg-gold/20 text-navy mb-6">
            Free Resource &middot; Updated for 2026&ndash;27
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-navy leading-tight mb-4">
            The Complete Aid Picture
          </h1>
          <p className="font-display text-xl sm:text-2xl text-navy/70 mb-6">
            Your free guide to FAFSA, financial aid, and paying less for college
          </p>
          <p className="font-body text-navy/70 max-w-2xl mb-10">
            College financial aid is one of the most complex and consequential
            processes a family will navigate. This guide covers the key things
            every family needs to understand — in plain English, sourced entirely
            from official federal data and College Board guidance.
          </p>

          {/* Stat chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "$100K+", label: "Average 4-year private college cost (2026)" },
              { value: "4 Types", label: "of financial aid most families underuse" },
              { value: "2 Years", label: "how far back the FAFSA looks at your income" },
              { value: "Annual", label: "how often you must re-file" },
            ].map((stat) => (
              <div key={stat.value} className="ktc-card p-4 text-center">
                <p className="font-mono-label text-gold text-lg sm:text-xl font-bold">
                  {stat.value}
                </p>
                <p className="text-navy/60 text-xs font-body mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inline educational disclaimer ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 mb-8 max-w-3xl mx-auto">
          <p className="text-sm text-amber-900">
            <strong>Educational guide only.</strong> This content explains the FAFSA
            process using official federal and College Board data. It is not financial,
            tax, or legal advice. Every family&apos;s situation is different — always
            verify with your school&apos;s financial aid office or a qualified financial
            advisor before making decisions.
          </p>
        </div>
      </div>

      {/* ─── SECTION B — Disclaimer bar ─── */}
      <section className="bg-cream border-l-4 border-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="font-body text-sm text-navy leading-relaxed">
            <strong>Important:</strong> This guide is for educational purposes
            only. KidToCollege is not a financial advisor, tax professional, or
            legal advisor. Every family&apos;s situation is different — always
            consult a qualified professional before making financial decisions
            based on this information. FAFSA rules change annually; verify all
            current figures at{" "}
            <a
              href="https://studentaid.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 underline transition-colors"
            >
              studentaid.gov
            </a>
            .
          </p>
        </div>
      </section>

      {/* ─── SECTION C — Table of contents ─── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-navy mb-6">
            What&apos;s in this guide
          </h2>
          <nav>
            <ol className="space-y-2 font-body text-navy/80">
              {[
                { label: "Key Terms Explained", href: "#key-terms" },
                { label: "How Your SAI Is Calculated", href: "#sai-calculation" },
                { label: "What to Report — and What Not To", href: "#asset-reporting" },
                { label: "The Four Types of Financial Aid", href: "#aid-types" },
                { label: "Merit Aid: Three Types You Need to Know", href: "#merit-aid" },
                { label: "Private Scholarships and Displacement", href: "#private-scholarships" },
                { label: "Your Financial Aid Timeline", href: "#timeline" },
                { label: "Frequently Asked Questions", href: "#faqs" },
                { label: "Official Free Resources", href: "#resources" },
              ].map((item, i) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:text-gold transition-colors"
                  >
                    <span className="font-mono-label text-gold text-sm mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* ─── SECTION D — Key Terms Explained ─── */}
      <section id="key-terms" className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            Key Terms Explained
          </h2>
          <p className="font-body text-navy/70 mb-8">
            Before filling out any form, these are the six terms you will see
            everywhere.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              {
                term: "Cost of Attendance (COA)",
                definition:
                  "The all-in annual sticker price — tuition, room, board, books, fees, and personal expenses combined. This is what you would pay with zero financial aid.",
              },
              {
                term: "Student Aid Index (SAI)",
                definition:
                  "Replaced the old Expected Family Contribution (EFC). An index number — not a bill — that colleges use to estimate how much your family can contribute each year toward college costs. The lower your SAI, the more need-based aid you may be eligible for.",
              },
              {
                term: "Financial Need",
                definition:
                  "Simply COA minus SAI. This is your eligibility for need-based aid at a given school — not what that college will actually award you.",
              },
              {
                term: "Need Met %",
                definition:
                  "The percentage of your financial need that a college actually covers with grants and scholarships. Two schools with identical sticker prices can leave your family with bills that differ by tens of thousands of dollars annually purely because of this number. Always research it before applying.",
              },
              {
                term: "Prior-Prior Year (PPY)",
                definition:
                  "The FAFSA uses your tax return from two years before the enrollment year. For a student starting college in autumn 2026, that means your 2024 tax return. This means financial planning needs to happen well before senior year of high school.",
              },
              {
                term: "CSS Profile",
                definition:
                  "A second financial aid form required by approximately 200–300 selective colleges — mostly private universities. It uses a different formula to the FAFSA, is more detailed, and counts assets (like home equity) that the FAFSA excludes. Find the full list of schools requiring it at cssprofile.collegeboard.org.",
              },
              {
                term: "Income Protection Allowance",
                definition:
                  "A portion of family income that the FAFSA formula automatically excludes from the SAI calculation — it is set aside to cover basic living expenses and is never counted as available for college costs. The allowance varies by family size. This means the SAI formula does not assume your entire income is available to pay for college.",
              },
            ].map((item) => (
              <div key={item.term} className="ktc-card p-6">
                <h3 className="font-display text-lg font-bold text-navy mb-2">
                  {item.term}
                </h3>
                <p className="font-body text-sm text-navy/70">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>

          {/* Core formula */}
          <div className="bg-navy rounded-lg p-8 text-center">
            <p className="font-display text-xl sm:text-2xl font-bold text-white">
              Cost of Attendance &minus; Student Aid Index = Financial Need
            </p>
            <p className="font-body text-sm text-white/60 mt-3">
              Financial Need is your eligibility — not what each college will
              actually award you.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION E — How Your SAI Is Calculated ─── */}
      <section id="sai-calculation" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            How Your SAI Is Calculated
          </h2>
          <p className="font-body text-navy/70 mb-8">
            Three factors drive most families&apos; SAI. Understanding them is
            the first step to planning ahead.
          </p>

          <div className="space-y-6 mb-10">
            {[
              {
                num: "1",
                title: "Adjusted Gross Income (AGI)",
                color: "border-gold",
                text: "Your AGI — found on Line 11 of your 1040 tax return — is the single largest driver of your SAI. Parent income is assessed at progressive rates ranging from 22% to 47% of available income. Student income above $11,770 (2026–27 threshold) is assessed at 50% — meaning a student's part-time earnings can meaningfully raise the family's college bill.",
              },
              {
                num: "2",
                title: "Assets",
                color: "border-sage",
                text: "Parent assets are assessed at up to approximately 5.64% of their value annually on the FAFSA (the formula applies 12% to discretionary net worth after allowances). Student assets are assessed at a flat 20% — roughly four times higher. Keeping savings in a parent's name rather than a student's name therefore matters significantly.",
              },
              {
                num: "3",
                title: "Home Equity (CSS Profile schools only)",
                color: "border-crimson",
                text: "Your primary home is excluded from the FAFSA entirely. However, the CSS Profile always includes it, and schools using the CSS Profile typically cap home equity at between 1.2× and 3× annual income. Investment properties and vacation homes count on both forms.",
              },
            ].map((card) => (
              <div
                key={card.num}
                className={`ktc-card p-6 border-l-4 ${card.color}`}
              >
                <h3 className="font-display text-lg font-bold text-navy mb-2">
                  <span className="font-mono-label text-gold mr-2">
                    {card.num}
                  </span>
                  {card.title}
                </h3>
                <p className="font-body text-sm text-navy/70">{card.text}</p>
              </div>
            ))}
          </div>

          {/* How to read a Common Data Set */}
          <div className="bg-cream border border-card rounded-lg p-6 mb-8">
            <h3 className="font-display text-lg font-bold text-navy mb-3">
              <Info className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" />{" "}
              How to read a Common Data Set
            </h3>
            <div className="font-body text-sm text-navy/70 space-y-3 leading-relaxed">
              <p>
                The Common Data Set is a standardised document every college
                publishes annually. To find one, search &ldquo;[School Name]
                Common Data Set&rdquo; — it will be a PDF, usually 30–50 pages
                long.
              </p>
              <p>
                The number you are looking for is in Section H, Row I:
                &ldquo;Percent of need met of students who were awarded any
                need-based aid.&rdquo; This tells you how much of demonstrated
                financial need the school actually covers.
              </p>
              <p>
                <strong>Important caveat:</strong> read the fine print carefully.
                Many schools include loans inside this percentage. A school
                claiming to meet 80% of need may be counting a $25,000 loan as
                part of that figure. Look specifically for the breakdown showing
                grants and scholarships separately from loans. The grants-only
                figure is what actually reduces your bill.
              </p>
            </div>
          </div>

          {/* Need Met % callout */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-8">
            <p className="font-body text-sm text-navy leading-relaxed">
              <Lightbulb className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" /> The Need Met % is what actually
              determines your bill. Two schools can have the same cost of
              attendance and your family the same SAI — yet your annual bill
              could differ by tens of thousands of dollars depending on each
              school&apos;s policy. Research this number for every school on your
              list. Find it in each school&apos;s Common Data Set (search
              &ldquo;[School Name] Common Data Set&rdquo;) and look at Section
              H.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://studentaid.gov/aid-estimator/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
            >
              Use the free official Federal Aid Estimator at studentaid.gov
              &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ─── SECTION F — What to Report — and What Not To ─── */}
      <section id="asset-reporting" className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            What to Report — and What Not To
          </h2>
          <p className="font-body text-navy/70 mb-8">
            Reporting errors on the FAFSA — in either direction — can cost
            families significant aid. The form cannot be corrected retroactively
            for a prior award year. Here is what the official federal guidelines
            require.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Must Report */}
            <div className="ktc-card p-6 border-t-4 border-crimson">
              <h3 className="font-display text-lg font-bold text-navy mb-4">
                Must Report as Assets (FAFSA)
              </h3>
              <ul className="space-y-2 font-body text-sm text-navy/70">
                {[
                  "Checking and savings accounts",
                  "Money market accounts and certificates of deposit",
                  "Brokerage and non-retirement investment accounts",
                  "Stocks, bonds, and mutual funds",
                  "529 college savings plans (if parent-owned, reported as a parent asset)",
                  "Coverdell Education Savings Accounts",
                  "UGMA / UTMA custodial accounts",
                  "Trust assets (where the family has accessible discretion)",
                  "Investment real estate equity (excluding primary home)",
                  "Vacation homes and rental properties",
                  "Child support received",
                  "Business net worth (businesses with more than 100 full-time employees)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-crimson mt-0.5 shrink-0">
                      &bull;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* NOT Reported */}
            <div className="ktc-card p-6 border-t-4 border-sage">
              <h3 className="font-display text-lg font-bold text-navy mb-4">
                NOT Reported on FAFSA
              </h3>
              <ul className="space-y-2 font-body text-sm text-navy/70">
                {[
                  "401(k), 403(b), 457 plan balances",
                  "Traditional and Roth IRA balances",
                  "SEP-IRA, SIMPLE IRA, Keogh plan balances",
                  "Pension plans and qualified annuities",
                  "Health Savings Accounts (HSA)",
                  "Primary home equity",
                  "Cars, furniture, and personal possessions",
                  "Timeshares",
                  "Small businesses with 100 or fewer full-time employees (new for 2026–27)",
                  "Family farms where the family resides (new for 2026–27)",
                  "Grandparent-owned 529 distributions (no longer counted as student income from 2026–27)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-sage mt-0.5 shrink-0">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Callout boxes */}
          <div className="space-y-4">
            {/* Warning */}
            <div className="bg-crimson/5 border border-crimson/20 rounded-lg p-5">
              <p className="font-body text-sm text-navy leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-crimson inline-block mr-1 -mt-0.5" /> Retirement account balances
                are not reported as FAFSA assets — but retirement account
                withdrawals count as income in the year taken, which will
                increase your SAI if they fall in your base income year. Plan any
                distributions carefully.
              </p>
            </div>

            {/* CSS Profile note */}
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-5">
              <p className="font-body text-sm text-navy leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" /> The CSS Profile is different.
                Colleges using the CSS Profile ask for retirement account
                balances and always include primary home equity. Most schools do
                not factor retirement balances heavily into their formula — but
                practices vary. Contact each school&apos;s financial aid office
                directly if you have questions about how they treat specific
                assets.
              </p>
            </div>

            {/* 529 tip */}
            <div className="bg-sage/5 border border-sage/20 rounded-lg p-5">
              <p className="font-body text-sm text-navy leading-relaxed">
                <Lightbulb className="w-4 h-4 text-sage inline-block mr-1 -mt-0.5" /> Keep 529 plans in a
                parent&apos;s name where possible. A parent-owned 529 is
                assessed at the lower parent asset rate. From 2026–27,
                distributions from grandparent-owned 529 plans no longer count
                as student income — a significant improvement from prior years.
              </p>
            </div>

            {/* Low-income asset exemption */}
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-5">
              <p className="font-body text-sm text-navy leading-relaxed">
                <Info className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" />{" "}
                <strong>Low-income asset exemption:</strong> If a dependent
                student&apos;s parents have a combined AGI of $60,000 or less
                and meet certain other criteria, assets do not need to be
                reported on the FAFSA at all — they are automatically excluded
                from the SAI calculation. This is called the Simplified Needs
                Test exemption. Check the current criteria at{" "}
                <a
                  href="https://studentaid.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold/80 underline transition-colors"
                >
                  studentaid.gov
                </a>{" "}
                before filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION G — The Four Types of Financial Aid ─── */}
      <section id="aid-types" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            The Four Types of Financial Aid
          </h2>
          <p className="font-body text-navy/70 mb-8">
            Most families focus on just one or two sources of aid and leave money
            on the table. The following four categories are standard
            classifications used by the Department of Education and College
            Board.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "1",
                title: "Need-Based Aid",
                text: "Driven by your SAI. Accessed through the FAFSA and CSS Profile. Includes federal Pell Grants, institutional grants, subsidised loans, and work-study. Available at many schools even for middle- and higher-income families, depending on the school's endowment and aid policy. Families who don't expect to qualify sometimes are — filing is free and takes little additional time.",
              },
              {
                num: "2",
                title: "Merit-Based Aid",
                text: "Based on academic achievement, test scores, or specific talents — not income or financial need. Available at hundreds of schools regardless of family finances. Ranges from automatic awards tied to GPA thresholds to highly competitive scholarships requiring separate applications and interviews.",
              },
              {
                num: "3",
                title: "Private Scholarships",
                text: "External awards from individuals, companies, community organizations, and foundations. Requires proactive research and applications. Important: check each school's outside scholarship policy before applying — some schools reduce their own institutional grants when outside awards are received.",
              },
              {
                num: "4",
                title: "Strategic Aid",
                text: "Bonus opportunities that many families discover too late: honours college awards, departmental scholarships, in-state tuition reciprocity programmes, CLEP credit to reduce degree length, co-operative education programmes, financial aid appeals, and accelerated degree pathways. These require research but can add up to significant savings.",
              },
            ].map((card) => (
              <div key={card.num} className="ktc-card p-6">
                <span className="font-mono-label text-gold text-sm font-bold">
                  {card.num}
                </span>
                <h3 className="font-display text-lg font-bold text-navy mt-1 mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-navy/70">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION H — Merit Aid ─── */}
      <section id="merit-aid" className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            Merit Aid: Three Types You Need to Know
          </h2>
          <p className="font-body text-navy/70 mb-8">
            Not all merit scholarships work the same way. Knowing the difference
            can prevent expensive surprises.
          </p>

          <div className="space-y-6 mb-8">
            {[
              {
                title: "Automatic Merit Aid",
                badge: "No extra steps needed",
                badgeColor: "bg-sage/20 text-sage",
                text: "Awarded automatically based on GPA and/or test scores — appears with the admission offer, no separate application required. Many schools offer substantial automatic awards even to families with no financial need. These are worth researching by GPA band before your student applies.",
              },
              {
                title: "Competitive Merit Aid",
                badge: "Extra steps required",
                badgeColor: "bg-gold/20 text-navy",
                text: "Requires additional work — a separate application, essay prompts, portfolio, or interview. Critical timing note: the majority of competitive scholarship deadlines fall before a student has received all their acceptance letters, sometimes as early as October or November of senior year. Research these deadlines in junior year (Grade 11), not senior year.",
              },
              {
                title: "Front-Loaded Merit Aid",
                badge: "Ask before committing",
                badgeColor: "bg-crimson/20 text-crimson",
                text: 'Some schools offer generous scholarships in Year 1 as a recruitment tool, then reduce or eliminate them in subsequent years. Always ask directly: "Is this award renewable for all four years, and what GPA is required to maintain it?" Get the answer in writing before submitting an enrollment deposit.',
              },
            ].map((card) => (
              <div key={card.title} className="ktc-card p-6">
                <span
                  className={`inline-block font-mono-label text-xs px-2 py-0.5 rounded ${card.badgeColor} mb-3`}
                >
                  {card.badge}
                </span>
                <h3 className="font-display text-lg font-bold text-navy mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-navy/70">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
            <p className="font-body text-sm text-navy leading-relaxed">
              <Pin className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" /> The May 1 enrollment deposit
              deadline is a school&apos;s administrative preference — it is not
              the end of all financial conversations. Financial aid appeals and
              some scholarship applications continue after this date. Always ask
              each school&apos;s financial aid office what options remain open.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION I — Private Scholarships and Displacement ─── */}
      <section id="private-scholarships" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
            Private Scholarships and Displacement
          </h2>

          <div className="space-y-8 mb-8">
            <div>
              <h3 className="font-display text-xl font-bold text-navy mb-3">
                What is scholarship displacement?
              </h3>
              <p className="font-body text-navy/70">
                Scholarship displacement occurs when a college reduces its own
                institutional grant when your student receives an outside
                scholarship. The result: your family&apos;s total bill stays the
                same despite your student&apos;s effort securing external
                funding. This practice is legal, not uncommon, and rarely
                explained proactively by schools.
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-navy mb-3">
                How to protect yourself
              </h3>
              <p className="font-body text-navy/70">
                Before your student invests time applying to outside
                scholarships, contact each college&apos;s financial aid office
                and ask directly: &ldquo;If my student receives an outside
                scholarship, will it reduce the institutional grant already
                offered?&rdquo; Request a written response. Schools whose policy
                allows students to keep all outside awards on top of
                institutional aid are worth prioritising on your college list.
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-navy mb-3">
                Where to find legitimate private scholarships
              </h3>
              <p className="font-body text-navy/70 mb-4">
                Focus on awards from verifiable sources — local businesses,
                community organizations, professional associations, and
                foundations. Free databases:
              </p>
              <ul className="space-y-2 font-body text-sm text-navy/70">
                {[
                  { name: "Fastweb", url: "https://www.fastweb.com" },
                  {
                    name: "Scholarships.com",
                    url: "https://www.scholarships.com",
                  },
                  {
                    name: "College Board Scholarship Search",
                    url: "https://bigfuture.collegeboard.org/scholarship-search",
                  },
                  {
                    name: "Your state's higher education commission website",
                    url: "",
                  },
                  {
                    name: "Local community foundations and your employer's HR department",
                    url: "",
                  },
                ].map((item) => (
                  <li key={item.name} className="flex items-start gap-2">
                    <span className="text-gold mt-0.5 shrink-0">&bull;</span>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 underline transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6">
            <p className="font-body text-sm text-navy leading-relaxed">
              <Lightbulb className="w-4 h-4 text-gold inline-block mr-1 -mt-0.5" /> Prioritise renewable awards. A
              $2,000 scholarship renewable for four years is worth $8,000 total.
              A one-time $5,000 award requires the same application effort but
              delivers less overall value.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION J — Your Financial Aid Timeline ─── */}
      <section id="timeline" className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            Your Financial Aid Timeline
          </h2>
          <p className="font-body text-navy/70 mb-10">
            Financial aid planning starts earlier than most families expect.
          </p>

          <div className="space-y-0">
            {[
              {
                grade: "Grades 7–9",
                title: "Build the Foundation",
                text: "Review how family assets are held — ensure retirement savings are in qualified accounts and investment assets are not held in the student's name. Encourage strong academic performance, which will matter for merit aid. No urgent FAFSA actions are required at this stage, but no harmful ones should be taken either.",
              },
              {
                grade: "Grade 10",
                title: "The Income Clock Starts",
                text: "The FAFSA for a student enrolling in autumn 2026 uses 2024 income — a current 10th grader's family income right now. Review your Adjusted Gross Income. Consider whether maximising qualified retirement contributions (which reduce AGI) makes sense for your situation. Speak to a financial professional about any significant financial moves this year.",
              },
              {
                grade: "Grade 11",
                title: "Research and Prepare",
                text: "Look up the Common Data Set for schools on your list — understand their need-met percentages and whether loans are included in aid packages. Identify competitive scholarship deadlines, which often open during junior year. Take the SAT/ACT to understand merit aid eligibility. Use the Federal Aid Estimator to model your likely SAI range.",
              },
              {
                grade: "Grade 12",
                title: "File, Apply, and Appeal",
                text: "The FAFSA opens 1 October. File as early as possible — some aid is first-come, first-served. Apply for competitive scholarships per each school's specific deadlines. Compare financial aid award letters carefully, not just the headline numbers. Consider a Professional Judgment appeal if family circumstances have changed significantly, or if a comparable school offered more.",
              },
              {
                grade: "College Years",
                title: "Re-File and Stay Active",
                text: "The FAFSA must be completed every year. Continue researching private scholarships. Verify that merit awards are being maintained on schedule. If income changes significantly — job loss, major medical expenses, or other substantial changes — file a Professional Judgment appeal with the financial aid office promptly.",
              },
            ].map((entry, i) => (
              <div key={entry.grade} className="flex gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gold shrink-0 mt-1.5" />
                  {i < 4 && (
                    <div className="w-0.5 bg-gold/30 flex-1 min-h-[2rem]" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <span className="font-mono-label text-xs uppercase tracking-wider text-gold">
                    {entry.grade}
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy mt-1 mb-2">
                    {entry.title}
                  </h3>
                  <p className="font-body text-sm text-navy/70">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION K — FAQs ─── */}
      <section id="faqs" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "We earn too much for need-based aid. Is there still any point filing the FAFSA?",
                a: "Yes — always file. The FAFSA is required to access federal student loans at competitive rates, and many merit scholarships use it as a prerequisite. Families earning well above median household income can still receive significant need-based grants at selective universities with large endowments and high need-met percentages. The income level above which need-based aid fully phases out at every college in the country is approximately $300,000+ annually — and even above that threshold, merit aid, private scholarships, and strategic options remain available.",
              },
              {
                q: "What if our income this year is much lower than the year the FAFSA uses?",
                a: "The FAFSA uses prior-prior year income and cannot be updated to reflect your current situation directly. If circumstances have changed significantly — job loss, retirement, divorce, a one-time income spike from severance or a business sale — the mechanism for addressing this is a Professional Judgment request, also called a financial aid appeal. You write to the college's financial aid office with supporting documentation explaining the change. Schools are not required to adjust your award, but many will for well-documented, significant changes. Be specific, factual, and professional.",
              },
              {
                q: "My student is a senior applying right now. Is it too late?",
                a: "No. Even late in senior year there are meaningful steps available: filing or correcting a FAFSA, requesting financial aid appeals, researching whether any competitive scholarship deadlines are still open (some run through March and April), and comparing aid offers carefully before committing. The May 1 enrollment deposit deadline is an administrative preference — it does not end all financial conversations with colleges.",
              },
              {
                q: "Does having savings in my student's name hurt our financial aid eligibility?",
                a: "Yes, significantly. Student assets are assessed at 20% on the FAFSA — nearly four times the effective parent asset rate of approximately 5.64%. Money in a UGMA/UTMA account in a student's name, or savings in their personal checking account, will increase your SAI more than the same amount held in a parent's account. If your student has savings earmarked for college, moving it into a parent-owned 529 plan (assessed at the parent rate) may be worth considering — speak to a financial professional before making changes.",
              },
              {
                q: "Do retirement accounts affect financial aid?",
                a: "On the FAFSA: no. Retirement account balances — 401k, IRA, Roth IRA, 403b, pension, and similar qualified plans — are not reported as FAFSA assets under any circumstances. Two important caveats however: withdrawals from retirement accounts count as income in the year taken, which will increase your SAI if they fall in your base income year. And the CSS Profile does ask for retirement account balances — most schools do not factor them heavily, but individual institutional policies vary.",
              },
              {
                q: "Which parent fills out the FAFSA in a divorce or separation?",
                a: "The FAFSA uses the parent who provided the most financial support to the student over the prior 12 months — not necessarily the parent with primary custody. If support was equal, the parent with higher income and assets is used. The CSS Profile typically requires both parents to submit their financial information regardless of custody arrangements. In complex situations — divorce, separation, remarriage, or unmarried parents living together — the rules have significant nuance. It is worth consulting a qualified college financial planning professional before completing either form.",
              },
              {
                q: "What is a financial aid appeal and how does it work?",
                a: "A financial aid appeal — formally called a Professional Judgment request — is a written request to a college's financial aid office asking them to reconsider your aid award based on circumstances not reflected in your tax return. Valid grounds include: significant income reduction since the base year, major unreimbursed medical expenses, death or disability of a contributing family member, or a stronger competing offer from a comparable school. There is no guarantee of a positive outcome, but many colleges adjust awards for compelling, well-documented cases. Be concise, polite, and factual — focus on documented circumstances and attach evidence. Both parents and students can submit appeals, to different offices where appropriate.",
              },
              {
                q: "What is the CSS Profile and which schools require it?",
                a: "The CSS Profile is a supplementary financial aid form administered by College Board, required by approximately 200–300 colleges in addition to the FAFSA — mostly selective private universities, though some public flagships require it too. It uses the Institutional Methodology, which is more detailed than the FAFSA's Federal Methodology. Key differences: it always includes primary home equity, asks about retirement account balances, and requires non-custodial parent information in divorce situations. There is a fee to submit it (approximately $25 for the first school, $16 per additional school). The full list of schools requiring it is at cssprofile.collegeboard.org.",
              },
              {
                q: "Is there an income level where financial aid simply is not worth pursuing?",
                a: "For federal need-based aid, families earning approximately $300,000+ annually will typically not qualify at most schools. But that does not mean nothing is available. Merit-based aid, competitive institutional scholarships, private scholarships, departmental awards, honours college funding, and tuition reciprocity programmes are available regardless of income level. Families who assume high income means no options often leave significant money on the table by not applying.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="ktc-card group"
              >
                <summary className="cursor-pointer p-6 font-body font-medium text-navy flex items-start justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <span className="text-gold shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 -mt-2">
                  <p className="font-body text-sm text-navy/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION L — Official Free Resources ─── */}
      <section id="resources" className="py-12 sm:py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-4">
            Official Free Resources
          </h2>
          <p className="font-body text-navy/70 mb-8">
            All of the following resources are free and from official sources.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <FileText className="w-6 h-6 text-gold" />,
                title: "FAFSA Application",
                desc: "Submit or update your Free Application for Federal Student Aid.",
                url: "https://studentaid.gov/h/apply-for-aid/fafsa",
              },
              {
                icon: <Calculator className="w-6 h-6 text-gold" />,
                title: "Federal Aid Estimator",
                desc: "Estimate your SAI and federal aid eligibility before you file.",
                url: "https://studentaid.gov/aid-estimator/",
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-gold" />,
                title: "CSS Profile",
                desc: "Required by ~200–300 selective colleges in addition to FAFSA.",
                url: "https://cssprofile.collegeboard.org",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-gold" />,
                title: "College Scorecard",
                desc: "Official federal database of college costs, graduation rates, and earnings.",
                url: "https://collegescorecard.ed.gov",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-gold" />,
                title: "Federal Student Aid Handbook",
                desc: "The official source for how the SAI formula is calculated.",
                url: "https://fsapartners.ed.gov/knowledge-center/fsa-handbook",
              },
              {
                icon: <Search className="w-6 h-6 text-gold" />,
                title: "Common Data Sets",
                desc: 'Find need-met %, aid statistics, and more for any college. Search "[School Name] Common Data Set".',
                url: "https://www.google.com/search?q=common+data+set",
              },
              {
                icon: <FileDown className="w-6 h-6 text-gold" />,
                title: "2026–27 FAFSA Form (PDF)",
                desc: "The actual blank FAFSA form — useful to review all questions before you file.",
                url: "https://studentaid.gov/sites/default/files/2026-27-fafsa-form.pdf",
              },
              {
                icon: <Calculator className="w-6 h-6 text-gold" />,
                title: "Official SAI Formula Guide (PDF)",
                desc: "The federal government's full Student Aid Index formula — the exact document used to calculate your number.",
                url: "https://fsapartners.ed.gov/sites/default/files/2025-06/202627StudentAidIndexSAIandPellGrantEligibilityGuide.pdf",
              },
            ].map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ktc-card p-5 hover:shadow-card transition-shadow group"
              >
                {resource.icon}
                <h3 className="font-display text-base font-bold text-navy mt-2 mb-1 group-hover:text-gold transition-colors">
                  {resource.title}
                </h3>
                <p className="font-body text-xs text-navy/60">{resource.desc}</p>
                <span className="inline-block font-mono-label text-xs text-gold mt-2">
                  Visit &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION M — Bottom CTA banner ─── */}
      <section className="py-16 sm:py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to find colleges that fit your budget?
          </h2>
          <p className="text-white/60 font-body mb-8">
            KidToCollege searches thousands of colleges and surfaces scholarships
            matched to your student&apos;s profile — free, with no sign-up
            required to start.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="bg-gold hover:bg-gold/90 text-navy font-body font-medium px-8 py-4 rounded-md transition-colors"
            >
              Find Your College &rarr;
            </Link>
            <Link
              href="/scholarships"
              className="bg-white/10 hover:bg-white/20 text-white font-body font-medium px-8 py-4 rounded-md transition-colors border border-white/20"
            >
              Search Scholarships
            </Link>
            <Link
              href="/coach/appeal-letter"
              className="bg-white/10 hover:bg-white/20 text-white font-body font-medium px-8 py-4 rounded-md transition-colors border border-white/20"
            >
              Appeal Your Aid Offer &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
