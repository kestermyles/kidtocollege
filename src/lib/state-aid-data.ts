export interface StateGrant {
  name: string;
  amount: string;
  type: "need-based" | "merit-based" | "hybrid";
  eligibility: string[];
  deadline: string;
  url: string;
}

export interface StateAidData {
  slug: string;
  name: string;
  abbreviation: string;
  agencyName: string;
  agencyUrl: string;
  overview: string;
  grants: StateGrant[];
  tips: string[];
  fafsaDeadline: string;
  stateAppRequired: boolean;
  stateAppName?: string;
  stateAppUrl?: string;
}

export const STATE_AID_DATA: StateAidData[] = [
  {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    agencyName: "Texas Higher Education Coordinating Board",
    agencyUrl: "https://www.highered.texas.gov",
    overview:
      "Texas offers several major grant programs for in-state students, with the TEXAS Grant being the flagship need-based program covering tuition and fees at public universities. Texas does not have a separate state aid application — filing the FAFSA is the primary step.",
    grants: [
      {
        name: "TEXAS Grant (Toward EXcellence, Access & Success)",
        amount: "Up to $10,000/year at universities; up to $3,200/year at community colleges",
        type: "need-based",
        eligibility: [
          "Texas resident",
          "Demonstrate financial need via FAFSA",
          "Enroll at a public Texas college or university within 16 months of high school graduation",
          "Complete the Recommended or Distinguished high school curriculum",
          "No felony conviction or crime involving a controlled substance",
        ],
        deadline: "FAFSA priority deadline: January 15",
        url: "https://www.highered.texas.gov/institutional-resources-programs/student-financial-aid-programs/texas-grant/",
      },
      {
        name: "Texas Educational Opportunity Grant (TEOG)",
        amount: "Up to $2,000/year",
        type: "need-based",
        eligibility: [
          "Texas resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at a Texas public community or technical college",
          "Not awarded a TEXAS Grant",
        ],
        deadline: "Varies by institution — file FAFSA early",
        url: "https://www.highered.texas.gov/institutional-resources-programs/student-financial-aid-programs/texas-educational-opportunity-grant-teog/",
      },
      {
        name: "Tuition Equalization Grant (TEG)",
        amount: "Up to $5,000/year",
        type: "need-based",
        eligibility: [
          "Texas resident",
          "Demonstrate financial need",
          "Enrolled at an eligible private Texas college or university",
          "Not a theology or divinity major",
        ],
        deadline: "Varies by institution",
        url: "https://www.highered.texas.gov/institutional-resources-programs/student-financial-aid-programs/tuition-equalization-grant-teg/",
      },
    ],
    tips: [
      "File your FAFSA by January 15 — Texas awards are first-come, first-served and funds run out quickly.",
      "Complete the Recommended or Distinguished high school graduation plan to qualify for the TEXAS Grant.",
      "If attending a community college, apply for TEOG even if you plan to transfer — it bridges the gap before transferring to a university with TEXAS Grant eligibility.",
      "Texas public university tuition is set by each institution — compare net costs carefully since aid amounts vary.",
      "The Hazelwood Act provides full tuition at Texas public schools for eligible veterans and their dependents — one of the most generous veteran education benefits in the country.",
    ],
    fafsaDeadline: "January 15 (priority)",
    stateAppRequired: false,
  },
  {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    agencyName: "California Student Aid Commission (CSAC)",
    agencyUrl: "https://www.csac.ca.gov",
    overview:
      "California has the largest state grant program in the country. The Cal Grant covers tuition and fees at UC, CSU, and eligible private colleges. There are multiple Cal Grant types targeting different student profiles, plus the Middle Class Scholarship for families earning up to $217,000.",
    grants: [
      {
        name: "Cal Grant A",
        amount: "Up to $14,312/year (UC); up to $7,046/year (CSU); up to $9,358/year (private)",
        type: "hybrid",
        eligibility: [
          "California resident for 1+ year",
          "Minimum 3.0 GPA",
          "Demonstrate financial need (family income/asset ceilings apply)",
          "Enroll at an eligible California college at least half-time",
          "Submit GPA verification form from high school",
        ],
        deadline: "March 2 (high school seniors); September 2 (community college transfer students)",
        url: "https://www.csac.ca.gov/cal-grants",
      },
      {
        name: "Cal Grant B",
        amount: "Up to $1,672/year living allowance in year 1; tuition + living allowance in subsequent years",
        type: "need-based",
        eligibility: [
          "California resident",
          "Minimum 2.0 GPA",
          "Demonstrate significant financial need",
          "For disadvantaged students from low-income families",
        ],
        deadline: "March 2 (high school seniors); September 2 (transfers)",
        url: "https://www.csac.ca.gov/cal-grants",
      },
      {
        name: "Middle Class Scholarship",
        amount: "Up to 40% of tuition at UC or CSU",
        type: "need-based",
        eligibility: [
          "California resident",
          "Family income up to $217,000",
          "Enrolled at UC or CSU",
          "File FAFSA or CA Dream Act Application",
        ],
        deadline: "March 2 priority; awards continue until funds are exhausted",
        url: "https://www.csac.ca.gov/middle-class-scholarship",
      },
    ],
    tips: [
      "The March 2 deadline is a hard cutoff — miss it and you lose a full year of Cal Grant eligibility.",
      "Your high school must submit a GPA verification form to CSAC — confirm with your counselor that this was done.",
      "The Middle Class Scholarship significantly expanded in 2024 — families earning up to $217K may now qualify. Don't assume you earn too much.",
      "Undocumented students who meet AB 540 criteria can access Cal Grants through the CA Dream Act Application instead of FAFSA.",
      "Community college students get a second Cal Grant application window on September 2 — use this if transferring to a UC or CSU.",
    ],
    fafsaDeadline: "March 2 (hard deadline)",
    stateAppRequired: false,
  },
  {
    slug: "florida",
    name: "Florida",
    abbreviation: "FL",
    agencyName: "Florida Department of Education, Office of Student Financial Assistance",
    agencyUrl: "https://www.floridastudentfinancialaidsg.com",
    overview:
      "Florida's Bright Futures Scholarship Program is one of the best-known merit-based state aid programs in the country, rewarding academic achievement with tuition coverage at Florida public colleges. Florida also offers need-based grants through the Florida Student Assistance Grant (FSAG).",
    grants: [
      {
        name: "Florida Bright Futures — Florida Academic Scholars (FAS)",
        amount: "100% tuition + fees at public institutions; equivalent at private; $300/semester books",
        type: "merit-based",
        eligibility: [
          "Florida resident",
          "Weighted GPA of 3.5+",
          "SAT 1330+ or ACT 29+",
          "100 hours of community service",
          "Complete required high school coursework",
        ],
        deadline: "August 31 after high school graduation (apply during senior year)",
        url: "https://www.floridastudentfinancialaidsg.com/SAPBFMAIN/SAPBFMAIN",
      },
      {
        name: "Florida Bright Futures — Florida Medallion Scholars (FMS)",
        amount: "75% tuition + fees at public institutions",
        type: "merit-based",
        eligibility: [
          "Florida resident",
          "Weighted GPA of 3.0+",
          "SAT 1210+ or ACT 25+",
          "75 hours of community service",
          "Complete required high school coursework",
        ],
        deadline: "August 31 after high school graduation",
        url: "https://www.floridastudentfinancialaidsg.com/SAPBFMAIN/SAPBFMAIN",
      },
      {
        name: "Florida Student Assistance Grant (FSAG)",
        amount: "Up to $5,000/year (varies by institution)",
        type: "need-based",
        eligibility: [
          "Florida resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled full-time at an eligible Florida college",
          "U.S. citizen or eligible noncitizen",
        ],
        deadline: "File FAFSA as early as possible — first-come, first-served",
        url: "https://www.floridastudentfinancialaidsg.com/SAPFSAG/SAPFSAG",
      },
    ],
    tips: [
      "Start tracking community service hours in 9th grade — you need 100 hours for the top Bright Futures tier.",
      "Bright Futures GPA is weighted — AP and Honors classes help significantly.",
      "If you miss the FAS tier by a few SAT points, you can retake the test. The scholarship uses your best score.",
      "FSAG funds are limited and awarded first-come, first-served — file your FAFSA the day it opens (October 1).",
      "Bright Futures can be used at Florida private colleges too, though the award amount differs. Compare net costs carefully.",
    ],
    fafsaDeadline: "May 15 (state deadline); file much earlier for FSAG",
    stateAppRequired: false,
  },
  {
    slug: "new-york",
    name: "New York",
    abbreviation: "NY",
    agencyName: "New York State Higher Education Services Corporation (HESC)",
    agencyUrl: "https://www.hesc.ny.gov",
    overview:
      "New York offers the Tuition Assistance Program (TAP), one of the largest need-based state grant programs in the country, plus the Excelsior Scholarship for middle-income families. New York requires a separate state application in addition to the FAFSA.",
    grants: [
      {
        name: "Tuition Assistance Program (TAP)",
        amount: "Up to $5,665/year",
        type: "need-based",
        eligibility: [
          "New York State resident for 12+ months",
          "U.S. citizen or eligible noncitizen",
          "Family net taxable income of $80,000 or less",
          "Enrolled full-time at an approved NY college",
          "Maintain good academic standing",
        ],
        deadline: "June 30 (but apply as early as possible)",
        url: "https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html",
      },
      {
        name: "Excelsior Scholarship",
        amount: "Covers remaining tuition at SUNY or CUNY after TAP and other grants",
        type: "hybrid",
        eligibility: [
          "New York State resident for 12+ months",
          "Family adjusted gross income of $125,000 or less",
          "Enrolled full-time (30 credits/year) at a SUNY or CUNY school",
          "Maintain a 2.0 GPA or higher",
          "Agree to live and work in New York for the same number of years you received the award",
        ],
        deadline: "Typically July — check HESC website for current year",
        url: "https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/the-excelsior-scholarship.html",
      },
      {
        name: "NYS STEM Incentive Program",
        amount: "Full SUNY or CUNY tuition",
        type: "merit-based",
        eligibility: [
          "Top 10% of high school class",
          "Enrolled in an approved STEM program at SUNY or CUNY",
          "Agree to work in a STEM field in New York after graduation",
        ],
        deadline: "Varies — check HESC website",
        url: "https://www.hesc.ny.gov",
      },
    ],
    tips: [
      "TAP requires a separate application at hesc.ny.gov — filing the FAFSA alone is not enough.",
      "The Excelsior Scholarship has a live-and-work-in-NY requirement. If you move out of state after graduation, the scholarship converts to a loan.",
      "Stack TAP + Excelsior: TAP is applied first, then Excelsior covers remaining tuition. Together they can mean zero tuition at SUNY/CUNY.",
      "Excelsior requires 30 credits per year (not per semester) — plan your course load carefully including summer sessions if needed.",
      "Private college students can still use TAP — it applies at eligible private NY colleges too, though the award is smaller.",
    ],
    fafsaDeadline: "June 30 (state deadline); file early for priority",
    stateAppRequired: true,
    stateAppName: "TAP Application",
    stateAppUrl: "https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html",
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbreviation: "PA",
    agencyName: "Pennsylvania Higher Education Assistance Agency (PHEAA)",
    agencyUrl: "https://www.pheaa.org",
    overview:
      "Pennsylvania offers the PA State Grant, one of the larger need-based state grant programs. Pennsylvania requires students to file the FAFSA to be considered for state aid. The state also offers targeted programs for STEM fields and high-need communities.",
    grants: [
      {
        name: "Pennsylvania State Grant",
        amount: "Up to $5,750/year (2024-25); varies by enrollment and school type",
        type: "need-based",
        eligibility: [
          "Pennsylvania resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at least half-time at an approved school",
          "Maintain satisfactory academic progress",
          "U.S. citizen or eligible noncitizen",
        ],
        deadline: "May 1 (for FAFSA completion); August 1 (state grant deadline)",
        url: "https://www.pheaa.org/grants/state-grant-program/",
      },
      {
        name: "PA Targeted Industry Program (PA-TIP)",
        amount: "Up to $8,000/year",
        type: "need-based",
        eligibility: [
          "Pennsylvania resident",
          "Enrolled in a high-priority occupation program (healthcare, IT, advanced manufacturing, etc.)",
          "Demonstrate financial need",
          "Attend an eligible PA school",
        ],
        deadline: "Varies — check PHEAA website",
        url: "https://www.pheaa.org",
      },
    ],
    tips: [
      "PHEAA uses both the FAFSA and institutional data — file the FAFSA by May 1 for best consideration.",
      "The PA State Grant is portable to some out-of-state schools — check the approved school list if you're considering schools outside Pennsylvania.",
      "Pennsylvania is one of few states where the state grant can follow you to an out-of-state college. This is a significant advantage for PA residents.",
      "Community college students are eligible for the PA State Grant — don't skip it even if tuition seems low.",
      "Check with your college's financial aid office about institutional matching — many PA schools supplement the state grant with their own funds.",
    ],
    fafsaDeadline: "May 1 (priority); August 1 (final)",
    stateAppRequired: false,
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbreviation: "IL",
    agencyName: "Illinois Student Assistance Commission (ISAC)",
    agencyUrl: "https://www.isac.org",
    overview:
      "Illinois offers the Monetary Award Program (MAP) grant, the largest need-based grant program in the state. MAP funds are extremely limited and typically run out within weeks of the FAFSA opening — filing immediately on October 1 is critical.",
    grants: [
      {
        name: "Monetary Award Program (MAP) Grant",
        amount: "Up to $7,044/year (varies by institution)",
        type: "need-based",
        eligibility: [
          "Illinois resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at an eligible Illinois college at least half-time",
          "U.S. citizen or eligible noncitizen",
          "Not in default on student loans",
        ],
        deadline: "As early as possible — MAP funds run out within weeks of FAFSA opening",
        url: "https://www.isac.org/students/during-college/types-of-financial-aid/grants/monetary-award-program/",
      },
      {
        name: "AIM HIGH Grant",
        amount: "Varies — supplements other institutional aid",
        type: "hybrid",
        eligibility: [
          "Illinois resident",
          "Enrolled at a participating Illinois public university",
          "Meet university-specific academic and financial criteria",
        ],
        deadline: "Varies by institution",
        url: "https://www.isac.org",
      },
    ],
    tips: [
      "MAP funds are first-come, first-served and historically run out by late January. File your FAFSA on October 1 — not January, not March, October.",
      "MAP is only for Illinois colleges — if you attend school out of state, you cannot use MAP funds.",
      "Even if MAP runs out, filing the FAFSA still qualifies you for federal grants and institutional aid.",
      "The AIM HIGH program at Illinois public universities can provide additional tuition discounts — ask each school's financial aid office.",
      "Illinois does not require a separate state application — the FAFSA is your only application for MAP.",
    ],
    fafsaDeadline: "As soon as possible after October 1 (MAP funds exhaust quickly)",
    stateAppRequired: false,
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbreviation: "OH",
    agencyName: "Ohio Department of Higher Education",
    agencyUrl: "https://www.ohiohighered.org",
    overview:
      "Ohio offers the Ohio College Opportunity Grant (OCOG) for low-income students and the Choose Ohio First scholarship for STEM students. Ohio's grant amounts are modest compared to some states, making federal and institutional aid even more important for Ohio families.",
    grants: [
      {
        name: "Ohio College Opportunity Grant (OCOG)",
        amount: "Up to $3,000/year at public colleges; up to $4,500 at private",
        type: "need-based",
        eligibility: [
          "Ohio resident",
          "Expected Family Contribution (EFC) of $2,190 or less",
          "Enrolled at an eligible Ohio college",
          "U.S. citizen or eligible noncitizen",
        ],
        deadline: "October 1 FAFSA filing; rolling until funds exhausted",
        url: "https://www.ohiohighered.org/ocog",
      },
      {
        name: "Choose Ohio First Scholarship",
        amount: "Varies by institution — typically $1,500–$9,600/year",
        type: "merit-based",
        eligibility: [
          "Ohio resident (or eligible non-resident in some programs)",
          "Enrolled in an approved STEM program at a participating Ohio college",
          "Meet program-specific academic requirements",
        ],
        deadline: "Varies by institution and program",
        url: "https://www.ohiohighered.org/cof",
      },
    ],
    tips: [
      "OCOG has a very low income threshold — only the most financially disadvantaged families qualify. Focus on institutional merit aid and federal grants if you're above the cutoff.",
      "Choose Ohio First is underused — if you're interested in STEM, ask each Ohio college whether they participate.",
      "Ohio's public university tuition guarantee locks in your tuition rate for 4 years — factor this into your cost comparison.",
      "Ohio does not require a separate state application — the FAFSA drives all state grant consideration.",
      "Many Ohio private colleges offer significant institutional discounts that dwarf state aid — always compare the net price, not the sticker price.",
    ],
    fafsaDeadline: "October 1 (file early for best consideration)",
    stateAppRequired: false,
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbreviation: "GA",
    agencyName: "Georgia Student Finance Commission (GSFC)",
    agencyUrl: "https://www.gafutures.org",
    overview:
      "Georgia's HOPE Scholarship is one of the most well-known merit-based state programs in the country, funded by the Georgia Lottery. The Zell Miller Scholarship provides full tuition for the highest-achieving students. Georgia also offers the HOPE Grant for technical and certificate programs.",
    grants: [
      {
        name: "HOPE Scholarship",
        amount: "Covers a percentage of tuition at Georgia public colleges (currently ~90%)",
        type: "merit-based",
        eligibility: [
          "Georgia resident",
          "Graduate high school with a 3.0 GPA",
          "Maintain a 3.0 GPA in college (checked at 30, 60, 90 credit hour checkpoints)",
          "Enrolled at an eligible Georgia college",
          "No felony drug convictions",
        ],
        deadline: "No separate application — automatic with FAFSA and Georgia residency",
        url: "https://www.gafutures.org/hope-state-aid-programs/hope-zell-miller-scholarships/hope-scholarship/",
      },
      {
        name: "Zell Miller Scholarship",
        amount: "100% tuition at Georgia public colleges",
        type: "merit-based",
        eligibility: [
          "Georgia resident",
          "Graduate high school with a 3.7 GPA",
          "SAT 1200+ (math + reading) or ACT 26+",
          "Maintain a 3.3 GPA in college",
          "All HOPE eligibility requirements",
        ],
        deadline: "Automatic — no separate application",
        url: "https://www.gafutures.org/hope-state-aid-programs/hope-zell-miller-scholarships/zell-miller-scholarship/",
      },
      {
        name: "HOPE Grant",
        amount: "Covers a percentage of tuition for certificate/diploma programs at technical colleges",
        type: "merit-based",
        eligibility: [
          "Georgia resident",
          "Enrolled in a diploma or certificate program at a Georgia technical college",
          "Maintain satisfactory academic progress",
        ],
        deadline: "Automatic — no separate application",
        url: "https://www.gafutures.org/hope-state-aid-programs/hope-zell-miller-grants/hope-grant/",
      },
    ],
    tips: [
      "HOPE and Zell Miller are not need-based — family income does not affect eligibility. It's purely academic merit.",
      "The college GPA checkpoints (30, 60, 90 hours) are strict. If your GPA drops below 3.0, you lose HOPE. Strategic course selection early matters.",
      "Zell Miller covers 100% of tuition — the difference between HOPE (~90%) and Zell Miller can save $1,000+/year.",
      "HOPE applies at private Georgia colleges too, but as a fixed dollar amount (~$4,000/year) rather than a percentage of tuition.",
      "You can regain HOPE if you lose it — bring your cumulative GPA back above 3.0 by the next checkpoint.",
    ],
    fafsaDeadline: "File FAFSA for federal aid; HOPE/Zell Miller do not require FAFSA but filing is recommended",
    stateAppRequired: false,
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbreviation: "NC",
    agencyName: "North Carolina State Education Assistance Authority (NCSEAA)",
    agencyUrl: "https://www.cfnc.org",
    overview:
      "North Carolina offers several need-based grants for students attending in-state public and private colleges. The UNC Need-Based Grant is the largest program, covering significant portions of cost at UNC System schools. NC requires FAFSA filing but no separate state application.",
    grants: [
      {
        name: "UNC Need-Based Grant",
        amount: "Varies — up to full demonstrated need at UNC System schools",
        type: "need-based",
        eligibility: [
          "North Carolina resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at a UNC System school",
          "U.S. citizen or eligible noncitizen",
        ],
        deadline: "FAFSA priority deadline varies by UNC campus (typically March 1)",
        url: "https://www.cfnc.org/pay-for-college/financial-aid/types-of-aid/grants/",
      },
      {
        name: "NC Community College Grant",
        amount: "Up to $2,800/year",
        type: "need-based",
        eligibility: [
          "North Carolina resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at a North Carolina community college at least half-time",
        ],
        deadline: "File FAFSA as early as possible",
        url: "https://www.cfnc.org",
      },
      {
        name: "NC Need-Based Scholarship (private colleges)",
        amount: "Up to $4,600/year",
        type: "need-based",
        eligibility: [
          "North Carolina resident",
          "Demonstrate financial need",
          "Enrolled full-time at an eligible NC private college",
          "Maintain satisfactory academic progress",
        ],
        deadline: "Varies by institution",
        url: "https://www.cfnc.org",
      },
    ],
    tips: [
      "UNC Chapel Hill's Carolina Covenant covers 100% of cost for families below 200% of the federal poverty level — no loans required. Check eligibility.",
      "Each UNC System campus has its own FAFSA priority deadline — check your specific school's date, not just the state deadline.",
      "NC community college tuition is among the lowest in the country (~$2,500/year). Combined with the CC Grant, costs can be near zero.",
      "North Carolina does not have a merit-based state scholarship — focus on institutional merit aid and federal programs.",
      "Use the CFNC.org website to plan — it's North Carolina's official college planning portal with cost estimators and application tools.",
    ],
    fafsaDeadline: "Varies by campus (typically March 1 for UNC System)",
    stateAppRequired: false,
  },
  {
    slug: "michigan",
    name: "Michigan",
    abbreviation: "MI",
    agencyName: "Michigan Department of Treasury, Student Financial Services Bureau",
    agencyUrl: "https://www.michigan.gov/mistudentaid",
    overview:
      "Michigan recently launched the Michigan Achievement Scholarship (2024), a major new program covering community college tuition for all Michigan residents and providing grants toward 4-year university costs. This is one of the most significant new state aid programs in the country.",
    grants: [
      {
        name: "Michigan Achievement Scholarship",
        amount: "Up to $5,500/year at universities; up to full tuition at community colleges",
        type: "hybrid",
        eligibility: [
          "Michigan resident",
          "Graduate from a Michigan high school (starting class of 2023)",
          "Complete the FAFSA",
          "Enroll at an eligible Michigan college or university",
          "No minimum GPA (for community college tier); academic requirements for university tier vary",
        ],
        deadline: "FAFSA filing required; check Michigan.gov/MiStudentAid for current deadlines",
        url: "https://www.michigan.gov/mistudentaid",
      },
      {
        name: "Michigan Competitive Scholarship",
        amount: "Up to $1,500/year",
        type: "hybrid",
        eligibility: [
          "Michigan resident",
          "SAT score meets qualifying threshold",
          "Demonstrate financial need via FAFSA",
          "Enrolled at an eligible Michigan college",
        ],
        deadline: "March 1 FAFSA filing deadline",
        url: "https://www.michigan.gov/mistudentaid",
      },
      {
        name: "Michigan Tuition Grant",
        amount: "Up to $3,400/year",
        type: "need-based",
        eligibility: [
          "Michigan resident",
          "Demonstrate financial need via FAFSA",
          "Enrolled at an eligible Michigan private college at least half-time",
        ],
        deadline: "March 1 FAFSA filing deadline",
        url: "https://www.michigan.gov/mistudentaid",
      },
    ],
    tips: [
      "The Michigan Achievement Scholarship is brand new (2024) — many families don't know about it yet. It can cover full community college tuition for all Michigan grads regardless of GPA.",
      "File the FAFSA by March 1 for Michigan state aid consideration — this is a firm priority deadline.",
      "Stack the Michigan Achievement Scholarship with federal Pell Grants — low-income students at community college may have costs fully covered plus money left over.",
      "The Michigan Competitive Scholarship uses SAT scores — if you took the SAT and scored well, you may qualify even if you didn't apply separately.",
      "Michigan state aid generally cannot be used at out-of-state schools — factor this into your college list if you're considering leaving Michigan.",
    ],
    fafsaDeadline: "March 1 (priority deadline for state aid)",
    stateAppRequired: false,
  },
];

export function getStateBySlug(slug: string): StateAidData | undefined {
  return STATE_AID_DATA.find((s) => s.slug === slug);
}
