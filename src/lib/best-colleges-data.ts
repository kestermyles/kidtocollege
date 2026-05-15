// Curated "Best X Colleges" rankings.
//
// Each topic page lives at /best-colleges/[topic] and gets a real
// ranked list of colleges. Slugs reference rows in the `colleges`
// Supabase table — the listicle page fetches their live data
// (acceptance rate, cost, location) and renders the list with
// editorial commentary.
//
// Slugs were verified against the prod DB at creation time. If the
// cron renames a slug, the entry will simply be skipped at render time.

export interface BestCollegesTopic {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  methodology: string;
  colleges: { slug: string; note: string }[];
  faqs: { q: string; a: string }[];
}

export const BEST_COLLEGES_TOPICS: BestCollegesTopic[] = [
  {
    slug: "engineering",
    h1: "Best Engineering Colleges 2026",
    metaTitle: "Best Engineering Colleges 2026: Top 10 US Engineering Programs",
    metaDescription:
      "The 10 best engineering colleges in the US for 2026, ranked by program quality, research output, ABET accreditation, and career placement. Free guide with acceptance rates, costs, and how to apply.",
    intro:
      "Engineering is one of the most competitive — and most rewarding — paths in US higher education. The schools on this list combine deep research budgets, strong industry pipelines, ABET-accredited programs, and consistent placement into top employers and graduate schools. They're not the only good engineering schools (there are dozens more), but they're the ones where a degree opens the most doors.",
    methodology:
      "Rankings weigh program reputation (US News engineering scores, industry surveys), undergraduate research access, co-op/internship pipelines, ABET accreditation across disciplines, faculty research output (NSF funding), and median early-career engineering salaries. We exclude schools whose engineering programs are graduate-only or recently founded (under 20 years).",
    colleges: [
      { slug: "massachusetts-institute-of-technology", note: "The benchmark. Every engineering discipline ranks in the top 5 nationally. Unmatched faculty research, undergraduate access to grad-level labs, and the strongest industry network in the country." },
      { slug: "stanford-university", note: "Silicon Valley's home campus. Strongest in CS, EE, and bio-engineering. Easier acceptance for engineering than humanities applicants — but still single-digit overall." },
      { slug: "california-institute-of-technology", note: "Tiny (under 1,000 undergrads), intense, and entirely STEM-focused. Best per-capita Nobel rate of any US engineering school. Not for everyone — but if it fits, nowhere else compares." },
      { slug: "university-of-california-berkeley", note: "Public Ivy. EECS, civil, and chemical engineering all rank top 3. In-state students get a world-class engineering degree for under $20k/year — one of the best public values in the country." },
      { slug: "carnegie-mellon-university", note: "Specializes hard: CS and robotics are tied for #1 nationally with MIT. Engineering admissions are stricter than CMU's other colleges — apply directly to the program, not undeclared." },
      { slug: "georgia-institute-of-technology-main-campus", note: "Top 5 in every engineering discipline at a fraction of private-school cost. Co-op program is among the strongest in the US. Georgia residents pay under $13k/year." },
      { slug: "university-of-michigan-ann-arbor", note: "Best engineering school in the Midwest. Mechanical and aerospace are especially strong; auto-industry pipeline is unmatched. In-state cost is reasonable; out-of-state is closer to private." },
      { slug: "university-of-illinois-urbana-champaign", note: "Quiet powerhouse. CS, ECE, and civil engineering all top 5. Lower profile than the coastal schools but a similar career outcome — and roughly half the cost." },
      { slug: "purdue-university-main-campus", note: "Engineering identity is the school's identity. 12,000+ engineering undergrads. Aerospace and industrial engineering are especially strong. In-state tuition is one of the cheapest on this list." },
      { slug: "cornell-university", note: "Ivy League engineering. Strong in chemical, biomedical, and mechanical. The College of Engineering admits separately from the rest of Cornell — slightly higher acceptance rate." },
    ],
    faqs: [
      {
        q: "Do I need to apply directly to the engineering school?",
        a: "Most of these schools (CMU, Cornell, Michigan, Purdue, Georgia Tech) admit you directly into the engineering college — not into 'undeclared.' Switching in later is sometimes possible but competitive. Apply to engineering specifically if it's what you want.",
      },
      {
        q: "What GPA and test scores do I need?",
        a: "For the top 5 (MIT, Stanford, Caltech, Berkeley, CMU): 3.9+ unweighted GPA and 1500+ SAT or 33+ ACT are typical. For Georgia Tech, Michigan, UIUC, Purdue, Cornell: 3.7+ GPA and 1400+ SAT / 31+ ACT are competitive. Test-optional doesn't usually help engineering applicants — submit if you have them.",
      },
      {
        q: "Are state public engineering schools as good as the privates?",
        a: "Yes, often. Berkeley, Michigan, Georgia Tech, UIUC, and Purdue produce engineers who go to the same companies (Google, Tesla, Boeing, Lockheed, ExxonMobil) as MIT and Stanford grads. The big difference is cost — in-state public can be $15-25k/year vs $85k+ for the privates.",
      },
      {
        q: "What's the easiest engineering specialization to get into?",
        a: "Civil and environmental engineering tend to have higher acceptance rates than EECS, biomedical, and aerospace at most schools. If you're flexible about specialty, applying for a less-saturated track can help.",
      },
    ],
  },

  {
    slug: "computer-science",
    h1: "Best Computer Science Colleges 2026",
    metaTitle: "Best Computer Science Colleges 2026: Top 10 CS Programs",
    metaDescription:
      "The 10 best CS colleges in the US for 2026, ranked by program depth, research access, industry recruiting, and grad outcomes. Acceptance rates, costs, and a free admissions roadmap.",
    intro:
      "Computer Science is the most competitive undergraduate major in the US right now — at many schools the CS program has a lower admit rate than the overall school. The list below isn't 'the most prestigious CS schools' — it's the schools where you'll learn the most, get the best internships, and graduate into the broadest set of opportunities. Some of them are public; one is a tiny tech institute. Cost differences are enormous.",
    methodology:
      "We weigh CS-specific reputation (CSrankings.org publication data, NRC ranks), recruiting strength (FAANG return-offer rates, average starting salary), curriculum depth (whether you can specialize in ML, systems, security, theory), undergraduate research access, and program-specific acceptance rate vs whole-school acceptance rate.",
    colleges: [
      { slug: "massachusetts-institute-of-technology", note: "CSAIL is the most-cited CS research lab in the world. Course 6 (EECS) is the largest major at MIT for a reason. Strong in everything from theory to systems to AI." },
      { slug: "stanford-university", note: "Geographically inseparable from Silicon Valley. The CS faculty has produced an unusual number of company founders. Internship-to-offer pipeline is the strongest of any school." },
      { slug: "carnegie-mellon-university", note: "School of Computer Science is its own college with separate admissions — and one of the toughest CS admits in the country (single-digit acceptance). Unmatched in ML, robotics, and HCI." },
      { slug: "university-of-california-berkeley", note: "EECS is split across two colleges. EECS in the College of Engineering is a direct-admit major and very competitive; L&S CS is slightly easier to declare. Top-tier research either way." },
      { slug: "university-of-illinois-urbana-champaign", note: "Quiet but consistently top 5 for CS. PhD program is elite; undergrad benefits from the same faculty. Lower national name recognition = slightly easier to get in than CMU or Berkeley." },
      { slug: "cornell-university", note: "Strong theory and systems programs. Ithaca's isolation forces more intensive academics — less Silicon Valley distraction. Cornell Tech in NYC adds an applied-AI track." },
      { slug: "georgia-institute-of-technology-main-campus", note: "Among the best CS values in the country. Co-op program funds the degree. Strong specializations include cybersecurity, computational biology, and HCI." },
      { slug: "university-of-washington-seattle-campus", note: "Direct neighbor to Microsoft and Amazon — internship density is unmatched. The Paul Allen School of CSE admits separately and very competitively." },
      { slug: "ucla", note: "Top public CS in California after Berkeley. LA proximity to entertainment-tech and growing aerospace presence. In-state cost is a major advantage." },
      { slug: "ut-austin", note: "UT Austin's CS program (Turing Scholars Honors) is consistently top 10. Austin's tech scene (Apple, Indeed, Bumble, plus a wave of HQ relocations) feeds local recruiting hard." },
    ],
    faqs: [
      {
        q: "Is CS impacted at these schools?",
        a: "Yes — CS at MIT, Stanford, CMU, Berkeley, UIUC, Washington, and UCLA all have lower acceptance rates than the overall school. Some schools (like Berkeley) require declaring CS at application time. Check each school's specific path.",
      },
      {
        q: "Do I need to know how to code already?",
        a: "Not for admission. But most top CS programs assume you can pick up programming quickly — they don't slow down for beginners. If you've never coded, do an intro course (CS50 free on edX, or any AP CS class) before freshman year.",
      },
      {
        q: "Is a top-10 CS degree worth the cost vs an in-state public?",
        a: "Honest answer: only if you can't get into a good in-state CS program. Big-tech recruiting reaches deeply into state schools now. A Berkeley, UIUC, or UT Austin CS degree at $25-40k total can be a better ROI than a $300k Stanford CS degree.",
      },
    ],
  },

  {
    slug: "nursing",
    h1: "Best Nursing Colleges 2026",
    metaTitle: "Best Nursing Colleges 2026: Top BSN Programs in the US",
    metaDescription:
      "The 10 best nursing colleges for 2026, ranked by NCLEX pass rates, clinical placements, hospital partnerships, and program depth. Find the right BSN program for you — free.",
    intro:
      "Nursing is one of the few college majors where ranking really matters — not for prestige, but for clinical placement and NCLEX pass rates. The schools below all have CCNE accreditation, NCLEX pass rates above 90%, and strong teaching-hospital partnerships. Beyond the top 10 there are dozens of regionally strong BSN programs; this list focuses on national leaders.",
    methodology:
      "We weigh NCLEX-RN first-time pass rate, CCNE accreditation, clinical placement quality (which hospitals partner with the school), faculty-to-student ratio in clinicals, and entry options (direct-admit BSN vs upper-division). We don't weigh graduate program rankings — this is an undergrad-focused list.",
    colleges: [
      { slug: "university-of-pennsylvania", note: "Penn Nursing is the top-ranked undergraduate nursing program in the US. Direct-admit BSN. Clinical placement at HUP and CHOP is unmatched. Single-digit acceptance." },
      { slug: "johns-hopkins-university", note: "Nursing is graduate-only at JHU — but for those finishing a BSN elsewhere, Hopkins' MSN/DNP programs are the gold standard. (Listed here because it shapes the field even though there's no direct undergrad route.)" },
      { slug: "duke-university", note: "Accelerated BSN for second-degree students; competitive. Duke Health system provides clinical rotations across one of the top medical centers in the Southeast." },
      { slug: "emory-university", note: "Nell Hodgson Woodruff School of Nursing. Strong public health crossover, partnerships with the CDC and Emory Healthcare. BSN takes 2 years after pre-nursing coursework." },
      { slug: "vanderbilt-university", note: "Pre-licensure MSN model — you enter as a graduate student after any bachelor's. Strongest second-career pathway on this list." },
      { slug: "ucla", note: "UCLA School of Nursing has one of the highest NCLEX pass rates in California. Clinical partnerships with Ronald Reagan UCLA Medical Center, a top-10 US hospital." },
      { slug: "university-of-washington-seattle-campus", note: "Consistently top-5 nationally for nursing. UW Medicine partnership for clinicals. Direct-admit BSN — extremely competitive." },
      { slug: "university-of-pittsburgh", note: "Top NIH-funded nursing school. UPMC clinical placement is one of the largest and most varied in the country. Strong undergraduate research opportunities." },
      { slug: "unc-chapel-hill", note: "Carolina's BSN is one of the strongest public nursing programs. NCLEX pass rate consistently above 95%. UNC Health partnership feeds direct hiring." },
      { slug: "new-york-university", note: "Rory Meyers College of Nursing. NYC clinical access is unrivaled — Bellevue, NYU Langone, Tisch. Direct-admit and accelerated options." },
    ],
    faqs: [
      {
        q: "What's the difference between a BSN and an ADN?",
        a: "BSN (Bachelor of Science in Nursing) is a 4-year degree from a college or university. ADN (Associate Degree in Nursing) is a 2-year community college program. Both qualify you to take the NCLEX and become an RN — but most hospitals now require or strongly prefer BSN for new hires, especially Magnet-status hospitals.",
      },
      {
        q: "How important is the school's NCLEX pass rate?",
        a: "Critical. Aim for schools with first-time NCLEX-RN pass rates above 90%. The schools on this list are all above 92%. Many lower-ranked nursing programs have pass rates below 80%, meaning a meaningful share of grads don't pass on the first try.",
      },
      {
        q: "Should I apply to nursing programs as a freshman or transfer in later?",
        a: "Direct-admit (apply as a freshman) is the surest path — competition for transfer slots is usually much higher. If a school you want is upper-division only (Emory, some UC campuses), plan to ace your pre-nursing prereqs.",
      },
    ],
  },

  {
    slug: "business",
    h1: "Best Business Colleges 2026",
    metaTitle: "Best Business Colleges 2026: Top 10 Undergraduate Business Schools",
    metaDescription:
      "The top 10 undergraduate business programs for 2026, with acceptance rates, average starting salaries, and what each school is known for. Free college admissions help.",
    intro:
      "An undergraduate business degree opens different doors than an MBA — and a top business program is one of the few undergraduate experiences where school name still affects starting salary years later. Wall Street recruiting, top consulting firms, and Big Four accounting recruit heavily and selectively from a handful of business programs. The list below covers those programs.",
    methodology:
      "We weigh AACSB accreditation (universal here), recruiting outcomes (firms that recruit on campus, median starting salary, top-feeder ranks at McKinsey/BCG/Bain and Goldman/Morgan Stanley/JP Morgan), faculty research strength, alumni network reach, and specific program reputation (Wharton finance, Sloan tech, McCombs energy, etc.).",
    colleges: [
      { slug: "university-of-pennsylvania", note: "Wharton — the most selective undergraduate business program in the US. Finance, statistics, and management concentrations all dominant. Sub-10% acceptance." },
      { slug: "massachusetts-institute-of-technology", note: "Sloan undergrad business is tightly tied to MIT's engineering and CS. Strongest if you want quantitative finance or tech management. Smaller class size than peers." },
      { slug: "university-of-california-berkeley", note: "Haas — sophomore-level admit (you apply during freshman year). Cohort model creates strong alumni network. Best public business program in the country." },
      { slug: "university-of-michigan-ann-arbor", note: "Ross — direct-admit option for freshmen plus preferred-admit transfer. Strongest in consulting and general management. Huge alumni network." },
      { slug: "new-york-university", note: "Stern — Wall Street's training ground. NYC location is the curriculum. Finance is the calling card; tech management is rising fast." },
      { slug: "university-of-virginia-main-campus", note: "McIntire — apply to UVA, declare McIntire end of sophomore year. Top consulting and i-banking placement in the mid-Atlantic." },
      { slug: "ut-austin", note: "McCombs — top-10 business school nationally, top in the country for energy/oil-gas finance. Texas-residency tuition makes it one of the highest-ROI business degrees anywhere." },
      { slug: "carnegie-mellon-university", note: "Tepper — quant-heavy business education. Strongest for finance and analytics. Smaller than the others on this list but punches above its weight." },
      { slug: "cornell-university", note: "Dyson (applied economics + management) and Hotel School are Cornell's business programs — both highly ranked but very different. Choose carefully." },
      { slug: "university-of-southern-california", note: "Marshall — strong on-campus recruiting from Los Angeles' entertainment, real estate, and tech industries. World Bachelor in Business (WBB) is the most selective sub-program." },
    ],
    faqs: [
      {
        q: "Is an undergraduate business degree worth it, or should I major in econ?",
        a: "Both work for most paths. A business degree from one of these schools gives you direct recruiting access to investment banks and consulting firms as a sophomore — econ + a strong overall school does similar but requires more self-driven networking. Engineering or CS plus a business minor is also a respected path.",
      },
      {
        q: "Do I need to know I want business when I apply?",
        a: "Direct-admit schools (Wharton, Stern, Ross, Cornell Dyson) — yes. Apply specifically to the business school. Sophomore-admit schools (Haas, McIntire) — no, you apply to the university first and decide during freshman year. Each path is harder than the other in different ways.",
      },
      {
        q: "What's the difference between a BBA, BS in Business, and BA in Business?",
        a: "Mostly cosmetic. The actual curriculum (accounting, finance, marketing, operations, strategy) is consistent across AACSB-accredited programs. What matters more: which concentrations the school is known for, and which firms recruit there.",
      },
    ],
  },

  {
    slug: "in-texas",
    h1: "Best Colleges in Texas 2026",
    metaTitle: "Best Colleges in Texas 2026: Top 10 Texas Universities",
    metaDescription:
      "Texas's 10 best universities for 2026 — UT Austin, Rice, Texas A&M, Baylor, and more. Acceptance rates, in-state tuition, and what each school is known for.",
    intro:
      "Texas has more high-quality universities than most non-residents realize. The state's top public schools combine R1 research output with in-state tuition that's a fraction of comparable private schools out of state. The list below covers the 10 schools you should know — public and private, large and small. Texas's automatic admission rule (top 6% of your HS class guarantees admission to UT Austin) makes the ranking dynamic for Texas residents specifically.",
    methodology:
      "Ranked by overall academic reputation, selectivity, graduate outcomes (earnings + employment), undergraduate research access, and value (especially in-state cost). For Texas residents, the rankings would shift somewhat — UT Dallas, UT San Antonio, and Texas Tech all offer strong programs at lower cost than the top three.",
    colleges: [
      { slug: "ut-austin", note: "The flagship of Texas higher education. Top 10 publics in the country, top 5 in business (McCombs), engineering (Cockrell), and natural sciences. Austin's tech and creative industries feed into hiring. Top 6% auto-admit for Texas residents." },
      { slug: "rice-university", note: "Small (about 4,000 undergrads), elite, and one of the best per-dollar private schools in the country. Generous need-based aid. Houston Medical Center adjacency for pre-med." },
      { slug: "texas-am-university", note: "Texas A&M's College Station campus has one of the largest engineering programs in the US and strong agriculture, business, and veterinary medicine. Aggies network is famously deep." },
      { slug: "southern-methodist-university", note: "SMU — strong business (Cox) and law school. Dallas's private school of choice. Generous merit scholarships for high-stat applicants." },
      { slug: "baylor-university", note: "Baylor's pre-med, nursing, and business programs are strong. Christian-affiliated (Baptist) but academically open. Waco location keeps cost-of-living down." },
      { slug: "texas-christian-university", note: "TCU — Fort Worth-based, strong nursing and business, with rising national recognition. Smaller than UT or A&M; more residential feel." },
      { slug: "the-university-of-texas-at-dallas", note: "UT Dallas — STEM-heavy. Computer science and engineering are highlights. Lower acceptance bar than UT Austin; AT&T Performing Arts adjacency for creative students." },
      { slug: "university-of-houston", note: "U of H — Houston's flagship state school. Energy, business, hotel & restaurant management, and engineering all strong. Tier-One research designation since 2011." },
      { slug: "texas-state-university", note: "Texas State (San Marcos) — fastest-growing R1 in Texas. Strong in education, criminal justice, healthcare administration. Cost is one of the lowest in-state options." },
      { slug: "texas-tech-university", note: "Texas Tech (Lubbock) — engineering, agriculture, animal sciences, and a strong law school. West Texas's flagship; lower-cost Tier-One option." },
    ],
    faqs: [
      {
        q: "Am I guaranteed admission to UT Austin if I'm in the top 6%?",
        a: "Yes — Texas's automatic admission law guarantees admission to UT Austin if you're in the top 6% of your high school class (was 7% through 2023, now 6%). It does NOT guarantee admission to your major. Engineering and business have separate program admissions even for top-6% admits.",
      },
      {
        q: "Should I apply to UT or A&M as my safety?",
        a: "Neither, for most applicants. Both have acceptance rates near 30% and competitive academic profiles. Better Texas safeties: UT Dallas, Texas State, Texas Tech, U of H — all have higher acceptance rates and strong programs.",
      },
      {
        q: "What's Texas's tuition advantage worth?",
        a: "In-state tuition at UT Austin is about $11,500/year. A comparable out-of-state private (Rice, SMU) runs $60-80k. Over four years that's a $200k difference. For Texas residents, the public flagships are often the better ROI even if you also got into a private.",
      },
    ],
  },

  {
    slug: "no-loan-need",
    h1: "Best Colleges That Meet 100% of Demonstrated Need",
    metaTitle: "Colleges That Meet 100% of Need: No-Loan Financial Aid Policies",
    metaDescription:
      "About 70 US colleges commit to meeting 100% of demonstrated financial need — and a smaller group replace loans with grants entirely. Find the schools, the income thresholds, and how to apply.",
    intro:
      "If your family's adjusted gross income is below a certain threshold, attending one of these colleges can actually be cheaper than attending your in-state public school. The trick: these schools commit to meeting 100% of demonstrated financial need with grants (not loans). For high-need families, that means tuition, room, board, and books can be fully covered — often with no expectation that you'll borrow. The catch is admission: these are some of the most selective schools in the country.",
    methodology:
      "We list schools that publicly commit to meeting 100% of demonstrated financial need AND either eliminate loans entirely from financial aid packages or cap them at very low levels. Income thresholds shown are public policy floors below which loans are replaced with grants. Selection: top-10 most aid-generous schools by income threshold and average aid package.",
    colleges: [
      { slug: "harvard-university", note: "Families earning under $85k pay nothing. Families under $150k pay 0-10% of income. No loans in any aid package. About 55% of undergrads receive need-based aid." },
      { slug: "princeton-university", note: "First school to eliminate loans, in 2001. Families under $100k typically pay nothing. Above that, no loans — only grants and a modest work-study expectation." },
      { slug: "stanford-university", note: "Families under $100k pay no tuition, room, or board. Families under $150k pay no tuition. Significant aid extends well past $200k household income." },
      { slug: "yale-university", note: "Families under $75k typically pay nothing. No loans in financial aid packages. Average grant for aided students exceeds $60k/year." },
      { slug: "massachusetts-institute-of-technology", note: "Families earning under $75k attend tuition-free. No-loan policy across all aid recipients. Aid extends to families earning $200k+." },
      { slug: "duke-university", note: "Meets full demonstrated need without loans for families under $150k. Above that, loans are capped at modest levels." },
      { slug: "amherst-college", note: "One of the most aid-generous small colleges. No loans in aid packages. Strong international financial aid." },
      { slug: "williams-college", note: "Replaces loans with grants for all aided students. Average aid package over $65k. Endowment per student is one of the highest in the country." },
      { slug: "pomona-college", note: "No-loan financial aid for all aided students. About 50% of undergrads receive aid. Strong Claremont-consortium course access." },
      { slug: "bowdoin-college", note: "Need-blind admissions and full no-loan aid for all aided students. Maine residents and low-income applicants strongly supported." },
    ],
    faqs: [
      {
        q: "What does 'meets 100% of demonstrated need' actually mean?",
        a: "It means the school commits to filling the gap between your Student Aid Index (SAI, formerly EFC) and the cost of attendance — entirely with grants, work-study, and (at non-no-loan schools) some loans. So if SAI is $5,000 and cost is $80,000, the school pledges to provide $75,000 in aid. 'No-loan' versions promise that aid won't include loans.",
      },
      {
        q: "How do I know if my family qualifies for need-based aid?",
        a: "Run the school's Net Price Calculator (every college has one). For a quick estimate: families earning under $75-100k generally qualify for significant need-based aid at meets-full-need schools. Families above $200-250k usually don't qualify for need-based aid (though merit and institutional aid may still apply).",
      },
      {
        q: "Are these schools easier to get into if I'm low-income?",
        a: "Not directly — these are all single-digit-acceptance schools. But many are 'need-blind' (admissions don't consider your ability to pay) AND specifically recruit low-income students. Programs like QuestBridge, Posse, and the schools' own first-gen initiatives help.",
      },
      {
        q: "What about international students?",
        a: "Harvard, Yale, Princeton, MIT, and Amherst are need-blind for international applicants — your finances don't affect admissions decisions, and they still meet full need. Most other 'meets full need' schools are need-aware for internationals.",
      },
    ],
  },

  {
    slug: "hbcus",
    h1: "Best HBCUs 2026",
    metaTitle: "Best HBCUs 2026: Top 10 Historically Black Colleges & Universities",
    metaDescription:
      "The 10 best Historically Black Colleges and Universities for 2026, with acceptance rates, tuition, scholarships, and what each school is known for. Free admissions guide.",
    intro:
      "HBCUs — Historically Black Colleges and Universities — represent about 3% of US higher-ed institutions but produce a disproportionate share of Black professionals, including more than 70% of Black doctors and dentists and 80% of Black judges. They range from small private liberal arts colleges to large public research universities. The list below covers the top 10 by academic reputation, graduate outcomes, and program strength.",
    methodology:
      "We weigh academic reputation (US News, Princeton Review HBCU rankings), graduation rate, post-grad earnings (College Scorecard data), endowment per student, and program-specific strength (Howard's law, Spelman's STEM, Hampton's nursing, etc.). All HBCUs on this list are accredited by their regional accreditors.",
    colleges: [
      { slug: "howard-university", note: "The Mecca. The most academically prestigious HBCU and one of only two HBCUs classified as R2 research institutions. Strong law, medicine, business, communications. DC location feeds federal and Wall Street pipelines." },
      { slug: "spelman-college", note: "Top women's HBCU. Atlanta. Sister school to Morehouse. Disproportionate share of Black women earning STEM PhDs come from Spelman." },
      { slug: "morehouse-college", note: "The leading men's HBCU. Atlanta. Alumni include Martin Luther King Jr., Spike Lee, Samuel L. Jackson. Strong in business, political science, pre-med." },
      { slug: "hampton-university", note: "Hampton, Virginia. Strong in business, nursing, and physical therapy. One of the highest endowments among HBCUs." },
      { slug: "tuskegee-university", note: "Alabama. Founded by Booker T. Washington. Veterinary medicine, engineering, and aerospace science are flagship programs." },
      { slug: "north-carolina-a-and-t-state-university", note: "Largest HBCU by enrollment. Top engineering program among HBCUs — one of the top producers of Black engineers in the country. Greensboro, NC." },
      { slug: "florida-am-university", note: "FAMU — Tallahassee. Strong business, journalism, and pharmacy. State-funded; in-state cost is among the lowest on this list." },
      { slug: "xavier-university-of-louisiana", note: "New Orleans. Tiny (3,000 undergrads) but produces more Black students who go on to medical school than any other school in the country." },
      { slug: "fisk-university", note: "Nashville. Liberal arts focus. Strong in science, particularly biology and chemistry. Historic — produced the first Black PhD in chemistry." },
      { slug: "clark-atlanta-university", note: "Atlanta. Part of the Atlanta University Center consortium with Spelman, Morehouse, and Morehouse School of Medicine — students cross-register freely." },
    ],
    faqs: [
      {
        q: "Are HBCUs only for Black students?",
        a: "No. HBCUs accept students of any race. Many have meaningful non-Black enrollment (international students, white students, Latino students). The historical mission and majority-Black student body remain, but admissions are not race-restricted.",
      },
      {
        q: "How does academic rigor at HBCUs compare to PWIs?",
        a: "Varies by school and program — same as predominantly white institutions (PWIs). Howard, Spelman, Xavier, and Morehouse are nationally competitive in their best programs (law, STEM, pre-med). For pre-med specifically, Xavier outperforms most PWIs in medical school placement.",
      },
      {
        q: "What's the financial aid like at HBCUs?",
        a: "Varies widely. Public HBCUs (NCAT, FAMU, Tennessee State) have in-state tuition well under $10k. Privates (Spelman, Morehouse, Hampton, Tuskegee) charge $25-40k but offer institutional aid. UNCF (United Negro College Fund) is a major source of scholarships specifically for HBCU students.",
      },
    ],
  },
];

export function getBestCollegesTopic(slug: string): BestCollegesTopic | undefined {
  return BEST_COLLEGES_TOPICS.find((t) => t.slug === slug);
}
