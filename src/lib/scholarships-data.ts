import type { Scholarship } from "@/lib/types";

export const scholarships: Scholarship[] = [
  // ── Federal ──────────────────────────────────────────────────────────
  {
    name: "Federal Pell Grant",
    amount: "Up to $7,395/year",
    type: "federal",
    eligibility:
      "Undergraduate students with demonstrated financial need (determined by FAFSA EFC).",
    deadline: "June 30 (FAFSA deadline for current award year)",
    url: "https://studentaid.gov/understand-aid/types/grants/pell",
  },
  {
    name: "Federal Supplemental Educational Opportunity Grant (FSEOG)",
    amount: "$100 – $4,000/year",
    type: "federal",
    eligibility:
      "Undergraduates with exceptional financial need. Pell Grant recipients get priority. Funds vary by school.",
    deadline: "Varies by school (apply early via FAFSA)",
    url: "https://studentaid.gov/understand-aid/types/grants/fseog",
  },
  {
    name: "Federal Work-Study",
    amount: "Varies (hourly wages, typically $10–$20/hr)",
    type: "federal",
    eligibility:
      "Students with financial need who want to earn money through part-time employment while enrolled.",
    deadline: "Varies by school (apply via FAFSA)",
    url: "https://studentaid.gov/understand-aid/types/work-study",
  },

  // ── National Merit & Achievement ─────────────────────────────────────
  {
    name: "National Merit Scholarship",
    amount: "$2,500 one-time (corporate/college-sponsored awards vary)",
    type: "national",
    eligibility:
      "High school juniors who score in the top 1% on the PSAT/NMSQT and advance through the selection process.",
    deadline: "October (PSAT taken junior year)",
    url: "https://www.nationalmerit.org/s/1758/interior.aspx?sid=1758&gid=2&pgid=424",
  },
  {
    name: "Coca-Cola Scholars Program",
    amount: "$20,000",
    type: "national",
    eligibility:
      "High school seniors with a minimum 3.0 GPA who demonstrate leadership and community service.",
    deadline: "October 31",
    url: "https://www.coca-colascholarsfoundation.org/apply/",
  },
  {
    name: "Gates Scholarship",
    amount: "Full cost of attendance (last-dollar funding)",
    type: "national",
    eligibility:
      "Pell-eligible high school seniors who are Black, Hispanic, Asian/Pacific Islander, or Native American with a minimum 3.3 GPA.",
    deadline: "September 15",
    url: "https://www.thegatesscholarship.org/",
    subject: "Any",
  },
  {
    name: "Dell Scholars Program",
    amount: "$20,000 over 4 years + laptop + textbook credits",
    type: "national",
    eligibility:
      "Students who have participated in an approved college-readiness program, demonstrate financial need, and have a minimum 2.4 GPA.",
    deadline: "December 1",
    url: "https://www.dellscholars.org/",
  },
  {
    name: "Jack Kent Cooke Foundation College Scholarship",
    amount: "Up to $55,000/year",
    type: "national",
    eligibility:
      "High-achieving high school seniors with financial need (family income under $95,000). Minimum 3.5 GPA.",
    deadline: "November 18",
    url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
  },
  {
    name: "QuestBridge National College Match",
    amount: "Full 4-year scholarship at partner colleges",
    type: "national",
    eligibility:
      "High-achieving, low-income high school seniors (generally household income under $65,000).",
    deadline: "September 26",
    url: "https://www.questbridge.org/high-school-students/national-college-match",
  },

  // ── Activity-Based: STEM ─────────────────────────────────────────────
  {
    name: "Regeneron Science Talent Search",
    amount: "Up to $250,000 (top award)",
    type: "activity",
    eligibility:
      "High school seniors who complete an independent science, math, or engineering research project.",
    deadline: "November (registration opens in June)",
    url: "https://www.societyforscience.org/regeneron-sts/",
    subject: "STEM",
  },
  {
    name: "Siemens Competition (now part of Regeneron ISEF)",
    amount: "Up to $100,000",
    type: "activity",
    eligibility:
      "High school students who compete in regional and national ISEF-affiliated science fairs.",
    deadline: "Varies by regional fair",
    url: "https://www.societyforscience.org/isef/",
    subject: "STEM",
  },
  {
    name: "FIRST Robotics Scholarships",
    amount: "Varies ($500 – $80,000)",
    type: "activity",
    eligibility:
      "Students who have participated in FIRST Robotics competitions. Over $80 million in scholarships from 200+ providers.",
    deadline: "Varies by provider",
    url: "https://www.firstinspires.org/alumni/scholarships",
    subject: "STEM",
  },
  {
    name: "Barry Goldwater Scholarship",
    amount: "$7,500/year for up to 2 years",
    type: "activity",
    eligibility:
      "College sophomores and juniors pursuing research careers in STEM fields. Must be nominated by their institution.",
    deadline: "January 31 (campus deadline varies)",
    url: "https://goldwaterscholarship.gov/",
    subject: "STEM",
  },
  {
    name: "Amazon Future Engineer Scholarship",
    amount: "$40,000 (4 years) + paid internship at Amazon",
    type: "activity",
    eligibility:
      "High school seniors planning to study computer science at an accredited US university.",
    deadline: "January (varies annually)",
    url: "https://www.amazonfutureengineer.com/scholarships",
    subject: "STEM",
  },

  // ── Activity-Based: Arts & Writing ───────────────────────────────────
  {
    name: "Scholastic Art & Writing Awards",
    amount: "$1,000 – $10,000 (Gold Medal Portfolio awards)",
    type: "activity",
    eligibility:
      "Students in grades 7–12 who submit original works of art or writing in 29 categories.",
    deadline: "December (varies by region)",
    url: "https://www.artandwriting.org/",
    subject: "Arts",
  },
  {
    name: "YoungArts Foundation",
    amount: "Up to $10,000 cash + mentorship",
    type: "activity",
    eligibility:
      "Students ages 15–18 (or grades 10–12) in visual, literary, or performing arts.",
    deadline: "October 11",
    url: "https://www.youngarts.org/",
    subject: "Arts",
  },
  {
    name: "National YoungArts Week",
    amount: "Up to $10,000 + Presidential Scholar nomination",
    type: "activity",
    eligibility:
      "YoungArts winners invited to Miami for masterclasses and performances with top artists.",
    deadline: "By invitation after YoungArts application",
    url: "https://www.youngarts.org/programs",
    subject: "Arts",
  },

  // ── Activity-Based: Business & Entrepreneurship ──────────────────────
  {
    name: "DECA Scholarships",
    amount: "Varies ($500 – $10,000)",
    type: "activity",
    eligibility:
      "DECA members who have competed at state or international events in marketing, finance, hospitality, or management.",
    deadline: "March (varies by scholarship)",
    url: "https://www.deca.org/high-school-programs/high-school-scholarships/",
    subject: "Business",
  },
  {
    name: "NFTE (Network for Teaching Entrepreneurship) Awards",
    amount: "Up to $25,000",
    type: "activity",
    eligibility:
      "Students who participate in NFTE entrepreneurship programs and compete in the national business plan competition.",
    deadline: "Varies (through school programs)",
    url: "https://www.nfte.com/",
    subject: "Business",
  },

  // ── Activity-Based: Vocational & Trades ──────────────────────────────
  {
    name: "SkillsUSA Scholarships",
    amount: "$1,000 – $10,000",
    type: "activity",
    eligibility:
      "SkillsUSA members pursuing careers in trade, technical, or skilled service occupations.",
    deadline: "Varies by chapter and state",
    url: "https://www.skillsusa.org/membership-resources/scholarships/",
    subject: "Vocational",
  },
  {
    name: "Mike Rowe Works Foundation Work Ethic Scholarship",
    amount: "Varies (typically $5,000 – $10,000)",
    type: "activity",
    eligibility:
      "Students planning to pursue a career in the skilled trades. Must demonstrate work ethic and commitment to a trade skill.",
    deadline: "March 31",
    url: "https://www.mikeroweworks.org/scholarship/",
    subject: "Vocational",
  },

  // ── Activity-Based: Agriculture ──────────────────────────────────────
  {
    name: "National FFA Organization Scholarships",
    amount: "$1,000 – $25,000",
    type: "activity",
    eligibility:
      "Current or former FFA members pursuing degrees in agriculture or related fields.",
    deadline: "January 15",
    url: "https://www.ffa.org/participate/grants-and-scholarships/",
    subject: "Agriculture",
  },

  // ── Activity-Based: Leadership & Community Service ───────────────────
  {
    name: "Prudential Emerging Visionaries (formerly Spirit of Community)",
    amount: "$2,500 – $15,000",
    type: "activity",
    eligibility:
      "Students in grades 5–12 who have demonstrated outstanding community service and social impact.",
    deadline: "November 7",
    url: "https://www.prudential.com/emerging-visionaries",
    subject: "Leadership",
  },
  {
    name: "Elks National Foundation Most Valuable Student",
    amount: "Up to $60,000 over 4 years",
    type: "activity",
    eligibility:
      "High school seniors who are US citizens. Judged on academics, leadership, and financial need.",
    deadline: "November 1",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    subject: "Leadership",
  },
  {
    name: "AXA Achievement Scholarship",
    amount: "$10,000 – $25,000",
    type: "activity",
    eligibility:
      "High school seniors who demonstrate ambition and drive through outstanding achievement in school or community activities.",
    deadline: "December 15",
    url: "https://us.axa.com/axa-foundation/AXA-achievement-scholarship.html",
    subject: "Leadership",
  },

  // ── Activity-Based: Gaming & Esports ─────────────────────────────────
  {
    name: "NACE (National Association of Collegiate Esports) Scholarships",
    amount: "Varies ($500 – full tuition at member schools)",
    type: "activity",
    eligibility:
      "Students who compete in varsity esports at NACE member colleges. Over 170 member schools offer scholarships.",
    deadline: "Varies by school (apply directly to esports programs)",
    url: "https://nacesports.org/",
    subject: "Gaming",
  },

  // ── Activity-Based: Faith-Based ──────────────────────────────────────
  {
    name: "Lilly Endowment Community Scholarship",
    amount: "Full tuition at any Indiana college + $900/year stipend",
    type: "activity",
    eligibility:
      "Indiana residents with strong academics, leadership, and community involvement. Awarded through local community foundations.",
    deadline: "Varies by county (typically September–October)",
    url: "https://www.cicf.org/giving-receiving/receive-a-scholarship/lilly-endowment-community-scholarship/",
    subject: "Faith",
    state: "IN",
  },
  {
    name: "United Methodist Church Scholarships",
    amount: "$500 – $5,000",
    type: "activity",
    eligibility:
      "Active members of the United Methodist Church who are enrolled or planning to enroll at UMC-related colleges.",
    deadline: "March 1",
    url: "https://www.gbhem.org/loans-and-scholarships/scholarships/",
    subject: "Faith",
  },

  // ── Activity-Based: Military/Service ─────────────────────────────────
  {
    name: "Civil Air Patrol Scholarships",
    amount: "$1,000 – $7,500",
    type: "activity",
    eligibility:
      "CAP cadet members pursuing aerospace, aviation, or STEM studies.",
    deadline: "January 31",
    url: "https://www.gocivilairpatrol.com/programs/cadets/cadet-scholarship-program",
    subject: "Military",
  },

  // ── Minority & First-Gen ─────────────────────────────────────────────
  {
    name: "UNCF Scholarships (United Negro College Fund)",
    amount: "Varies ($500 – $10,000+, many specific programs)",
    type: "minority",
    eligibility:
      "African American students with financial need attending UNCF member institutions or other accredited colleges.",
    deadline: "Varies by program (rolling)",
    url: "https://uncf.org/scholarships",
  },
  {
    name: "Hispanic Scholarship Fund",
    amount: "$500 – $5,000",
    type: "minority",
    eligibility:
      "Students of Hispanic heritage with a minimum 3.0 GPA who are US citizens, permanent residents, or DACA-eligible.",
    deadline: "February 15",
    url: "https://www.hsf.net/scholarship",
  },
  {
    name: "APIA Scholars (Asian & Pacific Islander American)",
    amount: "Up to $20,000",
    type: "minority",
    eligibility:
      "Asian or Pacific Islander American students with financial need and community involvement.",
    deadline: "January 11",
    url: "https://apiascholars.org/scholarship/apia-scholarship/",
  },
  {
    name: "American Indian College Fund",
    amount: "Varies ($1,000 – $10,000)",
    type: "minority",
    eligibility:
      "Native American and Alaska Native students attending tribal colleges or mainstream universities.",
    deadline: "May 31 (varies by program)",
    url: "https://collegefund.org/students/scholarships/",
  },
  {
    name: "Point Foundation (LGBTQ+ Scholarships)",
    amount: "Varies (average $10,000–$15,000/year, renewable)",
    type: "minority",
    eligibility:
      "LGBTQ+ students with strong academics and leadership who face financial barriers to education.",
    deadline: "January 28",
    url: "https://pointfoundation.org/point-apply/",
  },
  {
    name: "First Scholars Network (NASPA)",
    amount: "Varies by institution",
    type: "minority",
    eligibility:
      "First-generation college students at First Scholars Network member institutions. Support includes mentorship and financial aid.",
    deadline: "Varies by school",
    url: "https://firstgen.naspa.org/scholarly-article/first-scholars-network",
  },
  {
    name: "TheDream.US Scholarship",
    amount: "Up to $33,000 (national) or $80,000 (Opportunity)",
    type: "minority",
    eligibility:
      "DREAMers (DACA/TPS recipients or those who meet the DREAM Act criteria) with financial need.",
    deadline: "February (varies annually)",
    url: "https://www.thedream.us/scholarships/",
  },
  {
    name: "Ron Brown Scholar Program",
    amount: "$40,000 over 4 years",
    type: "minority",
    eligibility:
      "African American high school seniors who demonstrate academic excellence, leadership, and community service.",
    deadline: "January 9",
    url: "https://www.ronbrown.org/",
  },

  // ── Military & ROTC ──────────────────────────────────────────────────
  {
    name: "Post-9/11 GI Bill",
    amount: "Full tuition + housing + books (at public in-state rates, or private cap)",
    type: "military",
    eligibility:
      "Veterans and service members with at least 90 days of aggregate active duty service after 9/10/2001. Benefits transferable to dependents.",
    deadline: "No deadline (apply anytime after service)",
    url: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
  },
  {
    name: "Army ROTC Scholarship",
    amount: "Full tuition + $1,200/year books + monthly stipend",
    type: "military",
    eligibility:
      "High school seniors or current college students who commit to Army service after graduation. Must meet physical and academic standards.",
    deadline: "February 4",
    url: "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc/scholarships.html",
  },
  {
    name: "Navy ROTC Scholarship",
    amount: "Full tuition + books + fees + monthly stipend",
    type: "military",
    eligibility:
      "US citizens age 17–23 who meet academic and physical requirements and commit to Navy or Marine Corps service.",
    deadline: "January 31",
    url: "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/",
  },
  {
    name: "Air Force ROTC Scholarship",
    amount: "Full tuition + $900/year books + monthly stipend",
    type: "military",
    eligibility:
      "US citizens who meet academic (GPA/SAT/ACT) and physical requirements. Available for 3- and 4-year awards.",
    deadline: "January 12",
    url: "https://www.afrotc.com/scholarships/",
  },
  {
    name: "Pat Tillman Foundation Scholarship",
    amount: "Varies (covers unmet educational expenses)",
    type: "military",
    eligibility:
      "Active-duty service members, veterans, and military spouses pursuing undergraduate, graduate, or professional degrees.",
    deadline: "February 28",
    url: "https://pattillmanfoundation.org/apply/",
  },
  {
    name: "Fisher House Foundation Scholarships for Military Children",
    amount: "$2,000",
    type: "military",
    eligibility:
      "Unmarried children (under 23) of active duty, reserve, or retired military members. Must have a minimum 3.0 GPA.",
    deadline: "February 13",
    url: "https://www.militaryscholar.org/",
  },
  {
    name: "Marine Corps Scholarship Foundation",
    amount: "Up to $10,000 (higher for STEM)",
    type: "military",
    eligibility:
      "Children of Marines, Navy Corpsmen, and other eligible sponsors with family income below $108,000.",
    deadline: "March 1",
    url: "https://www.mcsf.org/",
  },

  // ── State-Specific ───────────────────────────────────────────────────
  {
    name: "Cal Grant (California)",
    amount: "Up to $14,296/year (Cal Grant A) or $1,656/year (Cal Grant B)",
    type: "state",
    eligibility:
      "California residents attending eligible California colleges. Based on GPA and financial need via FAFSA/CADAA.",
    deadline: "March 2",
    url: "https://www.csac.ca.gov/cal-grants",
    state: "CA",
  },
  {
    name: "TEXAS Grant",
    amount: "Up to $10,614/year (varies by institution)",
    type: "state",
    eligibility:
      "Texas residents with financial need attending public Texas universities. Must complete FAFSA and meet academic requirements.",
    deadline: "January 15 (priority FAFSA deadline)",
    url: "https://www.thecb.state.tx.us/apps/financialaid/",
    state: "TX",
  },
  {
    name: "New York TAP (Tuition Assistance Program)",
    amount: "Up to $5,665/year",
    type: "state",
    eligibility:
      "New York State residents attending approved NY colleges. Based on taxable income (under $80,000 for dependent students).",
    deadline: "June 30 (apply via FAFSA)",
    url: "https://www.hesc.ny.gov/pay-for-college/financial-aid/types-of-financial-aid/grants/tap.html",
    state: "NY",
  },
  {
    name: "Florida Bright Futures Scholarship",
    amount: "75% – 100% of tuition (depending on tier)",
    type: "state",
    eligibility:
      "Florida residents with strong academics (GPA + SAT/ACT) who attend eligible Florida institutions. Three tiers based on achievement.",
    deadline: "August 31 (after high school graduation)",
    url: "https://www.floridastudentfinancialaidsg.com/SAPBrightFutures/",
    state: "FL",
  },
  {
    name: "Illinois MAP Grant",
    amount: "Up to $7,044/year",
    type: "state",
    eligibility:
      "Illinois residents with financial need attending approved Illinois colleges. Based on FAFSA (funds run out quickly).",
    deadline: "As soon as possible after October 1 FAFSA opens",
    url: "https://www.isac.org/students/during-college/types-of-financial-aid/grants/monetary-award-program/",
    state: "IL",
  },
  {
    name: "Ohio College Opportunity Grant",
    amount: "Up to $3,500/year",
    type: "state",
    eligibility:
      "Ohio residents with an EFC of $2,190 or less attending eligible Ohio or Pennsylvania institutions.",
    deadline: "October 1 (apply via FAFSA, funds limited)",
    url: "https://www.ohiohighered.org/ocog",
    state: "OH",
  },
  {
    name: "Georgia HOPE Scholarship",
    amount: "Covers tuition at Georgia public colleges (or partial at private)",
    type: "state",
    eligibility:
      "Georgia residents who graduate from an eligible high school with a minimum 3.0 GPA. Must maintain 3.0 GPA in college.",
    deadline: "Last day of classes each term",
    url: "https://www.gafutures.org/hope-state-aid-programs/hope-zell-miller-scholarships/hope-scholarship/",
    state: "GA",
  },
  {
    name: "North Carolina Education Lottery Scholarship (ELS)",
    amount: "Up to $3,200/year at UNC schools",
    type: "state",
    eligibility:
      "NC residents attending UNC system schools with financial need (EFC of $5,846 or less).",
    deadline: "Varies by institution (apply via FAFSA)",
    url: "https://www.cfnc.org/pay-for-college/",
    state: "NC",
  },
  {
    name: "Pennsylvania State Grant",
    amount: "Up to $5,750/year",
    type: "state",
    eligibility:
      "Pennsylvania residents attending approved PA or reciprocal-state schools. Based on financial need via FAFSA.",
    deadline: "May 1 (August 1 for renewals)",
    url: "https://www.pheaa.org/grants/state-grant-program/",
    state: "PA",
  },
  {
    name: "Washington College Bound Scholarship",
    amount: "Full tuition + $500/books at public WA colleges",
    type: "state",
    eligibility:
      "WA students who sign up in 7th or 8th grade, graduate high school, and have family income at or below 65% of state MFI.",
    deadline: "June 30 of 8th grade year (sign-up)",
    url: "https://wsac.wa.gov/college-bound",
    state: "WA",
  },

  // ── University Auto Merit (concept card) ─────────────────────────────
  {
    name: "University Automatic Merit Scholarships",
    amount: "$2,000 – $25,000+/year (varies by school)",
    type: "university",
    eligibility:
      "Many universities automatically award merit scholarships based on GPA and test scores at admission. No separate application needed. Examples: University of Alabama, Arizona State, University of Kentucky, Iowa State, and hundreds more.",
    deadline: "No separate deadline (awarded with admission)",
    url: "https://www.niche.com/colleges/search/best-colleges-with-merit-scholarships/",
  },
  {
    name: "University Competitive Merit Scholarships",
    amount: "$5,000 – full tuition",
    type: "university",
    eligibility:
      "Prestigious named scholarships at individual universities that require a separate application, essays, and often interviews. Examples: Stamps Scholarship, Morehead-Cain (UNC), Robertson (Duke), Jefferson (UVA).",
    deadline: "Varies by university (typically November–January)",
    url: "https://www.stampsscholars.org/",
  },

  // ── Local Community Foundation (concept card) ────────────────────────
  {
    name: "Local Community Foundation Scholarships",
    amount: "$500 – $10,000 (typically)",
    type: "local",
    eligibility:
      "Community foundations in nearly every US county offer scholarships with very few applicants. Search your local community foundation's website. Eligibility often based on residency, high school attended, or field of study.",
    deadline: "Varies (typically January–April)",
    url: "https://www.cof.org/community-foundation-locator",
  },
  {
    name: "Rotary Club Scholarships",
    amount: "$500 – $30,000",
    type: "local",
    eligibility:
      "Students in the local Rotary Club district. Awards vary widely by club. Contact your local Rotary Club or search their district website.",
    deadline: "Varies by club (typically February–April)",
    url: "https://www.rotary.org/en/our-programs/scholarships",
  },
  {
    name: "Kiwanis Club Scholarships",
    amount: "$500 – $5,000",
    type: "local",
    eligibility:
      "Students connected to local Kiwanis clubs through Key Club membership or community involvement.",
    deadline: "Varies by club",
    url: "https://www.kiwanis.org/",
  },
  {
    name: "Local Elks Lodge Scholarships",
    amount: "$1,000 – $4,000",
    type: "local",
    eligibility:
      "Students who live within the jurisdiction of a local Elks Lodge. Separate from the national MVS award.",
    deadline: "Varies by lodge (typically January–March)",
    url: "https://www.elks.org/scholars/scholarships/",
  },
];

export const SCHOLARSHIP_TYPES = [
  { value: "federal", label: "Federal", color: "bg-navy text-white" },
  { value: "national", label: "National", color: "bg-gold text-navy" },
  { value: "state", label: "State", color: "bg-sage text-white" },
  { value: "activity", label: "Activity-Based", color: "bg-crimson text-white" },
  { value: "minority", label: "Minority & First-Gen", color: "bg-purple-600 text-white" },
  { value: "military", label: "Military & ROTC", color: "bg-emerald-700 text-white" },
  { value: "university", label: "University Merit", color: "bg-blue-600 text-white" },
  { value: "local", label: "Local", color: "bg-amber-700 text-white" },
] as const;

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;

export const SUBJECT_AREAS = [
  "Any",
  "STEM",
  "Arts",
  "Business",
  "Vocational",
  "Agriculture",
  "Leadership",
  "Gaming",
  "Faith",
  "Military",
] as const;

export const DEADLINE_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;
