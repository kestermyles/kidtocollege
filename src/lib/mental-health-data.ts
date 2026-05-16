// College mental-health data layer.
//
// Three layers:
//   1. NATIONAL_RESOURCES — universal crisis/support lines families should
//      know about regardless of which college a student attends. These are
//      surfaced on the /college-mental-health hub and on every college page.
//   2. JED_CAMPUS_SLUGS — campuses participating in the JED Foundation's
//      JED Campus program, a 4-year strategic engagement around mental
//      health systems. Published publicly by JED.
//   3. PRINCETON_REVIEW_HONOR_ROLL_SLUGS — schools named to Princeton
//      Review's annual "Best Colleges for Mental Health" recognition list
//      (formerly "Mental Health Honor Roll"). Reset each year by survey.
//
// The two slug sets are deliberately separate because the criteria are
// different — JED Campus is a program participation, Princeton Review is
// a student-survey ranking. A school in both gets both badges.

export interface NationalResource {
  name: string;
  description: string;
  contact: string;
  url: string;
  category: "crisis" | "lgbtq" | "campus_program" | "veterans" | "students";
}

export const NATIONAL_RESOURCES: NationalResource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description:
      "24/7 free, confidential support for anyone in suicidal crisis or emotional distress. Call or text 988. Special pathways for veterans (press 1) and LGBTQ+ youth.",
    contact: "Call or text 988",
    url: "https://988lifeline.org/",
    category: "crisis",
  },
  {
    name: "Crisis Text Line",
    description:
      "24/7 free crisis support over text message. Text HOME to 741741 to connect with a trained crisis counselor.",
    contact: "Text HOME to 741741",
    url: "https://www.crisistextline.org/",
    category: "crisis",
  },
  {
    name: "The Trevor Project",
    description:
      "24/7 crisis services for LGBTQ+ young people under 25. Phone, text, and chat support specifically for LGBTQ+ youth in crisis.",
    contact: "Call 1-866-488-7386 or text START to 678678",
    url: "https://www.thetrevorproject.org/",
    category: "lgbtq",
  },
  {
    name: "JED Foundation",
    description:
      "Nonprofit focused on protecting emotional health and preventing suicide for teens and young adults. Runs JED Campus program (140+ universities), Set to Go (college transition resources), and crisis screening tools.",
    contact: "Resources at jedfoundation.org",
    url: "https://jedfoundation.org/",
    category: "students",
  },
  {
    name: "Active Minds",
    description:
      "Largest network of college mental health student-led organizations. 1,000+ chapters across US colleges/high schools. Peer-to-peer mental health support and stigma reduction.",
    contact: "Find a chapter at activeminds.org",
    url: "https://www.activeminds.org/",
    category: "campus_program",
  },
  {
    name: "Mental Health America (MHA)",
    description:
      "Free, anonymous online screening for depression, anxiety, bipolar disorder, PTSD, eating disorders, ADHD, and more. Used by 12+ million people. Good first step if you're not sure what you're feeling.",
    contact: "Free screening at mhascreening.org",
    url: "https://screening.mhanational.org/",
    category: "students",
  },
  {
    name: "Veterans Crisis Line",
    description:
      "24/7 confidential support for veterans, service members, and their families. Call 988 then press 1, or text 838255.",
    contact: "Call 988 + press 1, or text 838255",
    url: "https://www.veteranscrisisline.net/",
    category: "veterans",
  },
  {
    name: "RAINN (Sexual Assault Hotline)",
    description:
      "24/7 confidential support for survivors of sexual assault. Phone and online chat options.",
    contact: "Call 1-800-656-4673",
    url: "https://www.rainn.org/",
    category: "crisis",
  },
];

// JED Campus program participants — schools that have committed to JED's
// 4-year systemic mental-health framework. Published publicly by JED.
// Source: jedfoundation.org/jed-campus (subset of larger list)
export const JED_CAMPUS_SLUGS: Set<string> = new Set([
  "university-of-southern-california",
  "boston-university",
  "tulane-university",
  "george-washington-university",
  "syracuse-university",
  "university-of-texas-at-austin",
  "ut-austin",
  "the-university-of-texas-at-austin",
  "ohio-state-university-main-campus",
  "indiana-university-bloomington",
  "purdue-university-main-campus",
  "purdue-university",
  "university-of-michigan-ann-arbor",
  "michigan-state-university",
  "university-of-iowa",
  "university-of-minnesota-twin-cities",
  "university-of-wisconsin-madison",
  "northwestern-university",
  "university-of-illinois-urbana-champaign",
  "university-of-illinois-chicago",
  "university-of-pittsburgh-main-campus",
  "university-of-pittsburgh",
  "penn-state",
  "university-of-virginia",
  "virginia-polytechnic-institute-and-state-university",
  "university-of-maryland-college-park",
  "georgetown-university",
  "rutgers-university-new-brunswick",
  "rutgers-university-newark",
  "new-york-university",
  "fordham-university",
  "binghamton-university",
  "university-at-buffalo",
  "stony-brook-university",
  "syracuse-university",
  "university-of-rochester",
  "yale-university",
  "harvard-university",
  "brown-university",
  "princeton-university",
  "columbia-university-in-the-city-of-new-york",
  "cornell-university",
  "dartmouth-college",
  "university-of-pennsylvania",
  "massachusetts-institute-of-technology",
  "tufts-university",
  "boston-college",
  "northeastern-university",
  "university-of-massachusetts-amherst",
  "william-and-mary",
  "wake-forest-university",
  "duke-university",
  "unc-chapel-hill",
  "vanderbilt-university",
  "emory-university",
  "georgia-institute-of-technology-main-campus",
  "georgia-tech",
  "university-of-georgia",
  "florida-state-university",
  "university-of-florida",
  "university-of-miami",
  "florida-international-university",
  "university-of-alabama",
  "auburn-university",
  "louisiana-state-university-and-agricultural-mechanical-college",
  "university-of-kansas",
  "university-of-oklahoma-norman-campus",
  "oklahoma-state-university-main-campus",
  "university-of-missouri-columbia",
  "washington-university-in-st-louis",
  "saint-louis-university",
  "university-of-arizona",
  "arizona-state-university",
  "university-of-colorado-boulder",
  "university-of-denver",
  "university-of-utah",
  "brigham-young-university",
  "university-of-oregon",
  "oregon-state-university",
  "university-of-washington-seattle-campus",
  "washington-state-university",
  "stanford-university",
  "university-of-california-berkeley",
  "ucla",
  "university-of-california-los-angeles",
  "university-of-california-san-diego",
  "university-of-california-davis",
  "university-of-california-irvine",
  "university-of-california-santa-barbara",
  "university-of-california-santa-cruz",
  "university-of-california-riverside",
  "san-diego-state-university",
  "san-francisco-state-university",
  "california-state-university-long-beach",
  "california-state-university-fullerton",
  "california-state-university-northridge",
]);

// Princeton Review "Best Schools for Mental Health Services" recognition.
// Based on student survey responses about counseling availability, wait
// times, and helpfulness. Updated annually.
export const PRINCETON_REVIEW_MENTAL_HEALTH_SLUGS: Set<string> = new Set([
  "kenyon-college",
  "amherst-college",
  "swarthmore-college",
  "haverford-college",
  "williams-college",
  "bowdoin-college",
  "vassar-college",
  "wesleyan-university",
  "macalester-college",
  "carleton-college",
  "claremont-mckenna-college",
  "harvey-mudd-college",
  "scripps-college",
  "pomona-college",
  "pitzer-college",
  "saint-marys-college-of-california",
  "rice-university",
  "tufts-university",
  "brown-university",
  "princeton-university",
  "yale-university",
  "duke-university",
  "vanderbilt-university",
  "northwestern-university",
  "university-of-virginia",
  "wake-forest-university",
  "elon-university",
  "trinity-college",
  "hamilton-college",
  "colgate-university",
  "lafayette-college",
  "dickinson-college",
  "lehigh-university",
  "bucknell-university",
  "smith-college",
  "wellesley-college",
  "mount-holyoke-college",
  "barnard-college",
  "bryn-mawr-college",
]);

export interface MentalHealthBadge {
  code: "JED_CAMPUS" | "MH_HONOR_ROLL";
  label: string;
  tooltip: string;
  href: string;
}

export function getMentalHealthBadges(slug: string): MentalHealthBadge[] {
  const out: MentalHealthBadge[] = [];
  if (JED_CAMPUS_SLUGS.has(slug)) {
    out.push({
      code: "JED_CAMPUS",
      label: "JED Campus",
      tooltip:
        "Participates in JED Foundation's JED Campus program — a 4-year strategic engagement to strengthen mental-health systems on campus. Indicates institutional commitment to systemic support.",
      href: "/college-mental-health#jed-campus",
    });
  }
  if (PRINCETON_REVIEW_MENTAL_HEALTH_SLUGS.has(slug)) {
    out.push({
      code: "MH_HONOR_ROLL",
      label: "MH Honor Roll",
      tooltip:
        "Named to Princeton Review's 'Best Schools for Mental Health Services' list, based on student-survey responses about counseling availability, wait times, and helpfulness.",
      href: "/college-mental-health#honor-roll",
    });
  }
  return out;
}
