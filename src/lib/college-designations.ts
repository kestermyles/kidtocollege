// Federal / national designations for colleges that families often
// want to filter for or signal on a college profile.
//
// Sources:
//   HSI list — HACU's annually-updated set of institutions with 25%+
//   Hispanic FTE undergrad enrollment (~631 schools as of 2024-25). The
//   list below covers most R1 / R2 / large-enrollment HSIs and the
//   most-searched campuses; HACU's full list also includes ~200
//   community colleges and smaller institutions not listed here.
//
//   HBCU list — federally designated Historically Black Colleges and
//   Universities (107 institutions). KidToCollege already covers
//   these in /best-colleges/hbcus. The slug set below provides a
//   programmatic way to badge them on individual college pages.

export const HSI_SLUGS: Set<string> = new Set([
  // UC system
  "university-of-california-riverside",
  "university-of-california-santa-cruz",
  "university-of-california-irvine",
  "university-of-california-merced",
  "university-of-california-santa-barbara",
  "university-of-california-san-diego",
  "university-of-california-davis",
  // CSU system (most are HSIs)
  "california-state-university-bakersfield",
  "california-state-university-channel-islands",
  "california-state-university-chico",
  "california-state-university-dominguez-hills",
  "california-state-university-east-bay",
  "california-state-university-fresno",
  "california-state-university-fullerton",
  "california-state-university-long-beach",
  "california-state-university-los-angeles",
  "california-state-university-monterey-bay",
  "california-state-university-northridge",
  "california-state-university-sacramento",
  "california-state-university-san-bernardino",
  "california-state-university-san-marcos",
  "california-state-university-stanislaus",
  "san-diego-state-university",
  "san-francisco-state-university",
  "san-jose-state-university",
  "sonoma-state-university",
  "california-state-polytechnic-university-pomona",
  "california-polytechnic-state-university-san-luis-obispo",
  // California private/independent HSIs
  "university-of-la-verne",
  "loyola-marymount-university",
  "california-lutheran-university",
  "mount-saint-marys-university",
  "whittier-college",
  "notre-dame-de-namur-university",
  "saint-marys-college-of-california",
  // Texas
  "ut-austin",
  "the-university-of-texas-at-el-paso",
  "the-university-of-texas-at-san-antonio",
  "the-university-of-texas-rio-grande-valley",
  "the-university-of-texas-at-arlington",
  "the-university-of-texas-at-dallas",
  "the-university-of-texas-at-tyler",
  "the-university-of-texas-permian-basin",
  "texas-state-university",
  "texas-aandm-university-kingsville",
  "texas-aandm-university-san-antonio",
  "texas-a-and-m-university-corpus-christi",
  "texas-tech-university",
  "texas-womans-university",
  "texas-lutheran-university",
  "texas-christian-university",
  "trinity-university",
  "university-of-houston",
  "university-of-houston-downtown",
  "university-of-houston-clear-lake",
  "university-of-houston-victoria",
  "houston-christian-university",
  "university-of-north-texas",
  "university-of-north-texas-at-dallas",
  "our-lady-of-the-lake-university",
  "saint-edwards-university",
  "sul-ross-state-university",
  "schreiner-university",
  "angelo-state-university",
  "tarleton-state-university",
  // Florida
  "florida-international-university",
  "university-of-central-florida",
  "university-of-south-florida",
  "florida-atlantic-university",
  "florida-memorial-university",
  "st-thomas-university",
  "barry-university",
  // New Mexico (state is majority Hispanic — most schools are HSIs)
  "university-of-new-mexico",
  "university-of-new-mexico-main-campus",
  "new-mexico-state-university-main-campus",
  "new-mexico-highlands-university",
  "eastern-new-mexico-university-main-campus",
  "new-mexico-institute-of-mining-and-technology",
  "northern-new-mexico-college",
  // Colorado
  "adams-state-university",
  "metropolitan-state-university-of-denver",
  "university-of-northern-colorado",
  "university-of-colorado-colorado-springs",
  // Arizona
  "arizona-state-university",
  "arizona-state-university-campus-immersion",
  "arizona-state-university-digital-immersion",
  "northern-arizona-university",
  "grand-canyon-university",
  // Nevada
  "university-of-nevada-las-vegas",
  // Utah
  "utah-valley-university",
  // CUNY (most are HSIs)
  "cuny-hunter-college",
  "cuny-city-college",
  "cuny-lehman-college",
  "cuny-john-jay-college-of-criminal-justice",
  "cuny-brooklyn-college",
  "cuny-queens-college",
  "cuny-bernard-m-baruch-college",
  "cuny-medgar-evers-college",
  "cuny-new-york-city-college-of-technology",
  "cuny-hostos-community-college",
  "cuny-laguardia-community-college",
  "cuny-borough-of-manhattan-community-college",
  "cuny-bronx-community-college",
  "cuny-kingsborough-community-college",
  "cuny-queensborough-community-college",
  "cuny-york-college",
  "college-of-staten-island-cuny",
  "boricua-college",
  // New York non-CUNY
  "adelphi-university",
  "hofstra-university",
  "pace-university",
  "dominican-university-new-york",
  // New Jersey
  "rutgers-university-newark",
  "new-jersey-institute-of-technology",
  "saint-peters-university",
  "william-paterson-university-of-new-jersey",
  "kean-university",
  "montclair-state-university",
  "bloomfield-college-of-montclair-state-university",
  "new-jersey-city-university",
  // Illinois
  "university-of-illinois-chicago",
  "northern-illinois-university",
  "northeastern-illinois-university",
  "dominican-university",
  "lewis-university",
  "depaul-university",
  "loyola-university-chicago",
  // Washington / Oregon
  "heritage-university",
  "yakima-valley-college",
  "eastern-oregon-university",
  "oregon-institute-of-technology",
  // Indiana
  "university-of-saint-francis-fort-wayne",
  // Puerto Rico (every Puerto Rico institution is automatically an HSI)
  "university-of-puerto-rico-mayaguez",
  "inter-american-university-of-puerto-rico-metro",
  "inter-american-university-of-puerto-rico-ponce",
  "inter-american-university-of-puerto-rico-barranquitas",
  "pontifical-catholic-university-of-puerto-rico-arecibo",
  "polytechnic-university-of-puerto-rico-miami",
])

// 107 federally designated HBCUs. The list below covers all 4-year
// institutions in the federal list that are in our colleges table.
export const HBCU_SLUGS: Set<string> = new Set([
  "alabama-a-and-m-university",
  "alabama-state-university",
  "albany-state-university",
  "alcorn-state-university",
  "allen-university",
  "arkansas-baptist-college",
  "benedict-college",
  "bennett-college",
  "bethune-cookman-university",
  "bluefield-state-university",
  "bowie-state-university",
  "central-state-university",
  "cheyney-university-of-pennsylvania",
  "claflin-university",
  "clark-atlanta-university",
  "coppin-state-university",
  "delaware-state-university",
  "dillard-university",
  "edward-waters-university",
  "elizabeth-city-state-university",
  "fayetteville-state-university",
  "fisk-university",
  "florida-am-university",
  "florida-memorial-university",
  "fort-valley-state-university",
  "grambling-state-university",
  "hampton-university",
  "harris-stowe-state-university",
  "howard-university",
  "huston-tillotson-university",
  "jackson-state-university",
  "jarvis-christian-university",
  "johnson-c-smith-university",
  "kentucky-state-university",
  "lane-college",
  "langston-university",
  "lawson-state-community-college",
  "le-moyne-owen-college",
  "lincoln-university",
  "livingstone-college",
  "miles-college",
  "mississippi-valley-state-university",
  "morehouse-college",
  "morgan-state-university",
  "morris-college",
  "norfolk-state-university",
  "north-carolina-a-and-t-state-university",
  "north-carolina-central-university",
  "oakwood-university",
  "paine-college",
  "paul-quinn-college",
  "philander-smith-university",
  "prairie-view-a-and-m-university",
  "rust-college",
  "saint-augustines-university",
  "savannah-state-university",
  "selma-university",
  "shaw-university",
  "simmons-college-of-kentucky",
  "south-carolina-state-university",
  "southern-university-and-a-and-m-college",
  "southern-university-at-shreveport",
  "spelman-college",
  "stillman-college",
  "talladega-college",
  "tennessee-state-university",
  "texas-southern-university",
  "tougaloo-college",
  "tuskegee-university",
  "university-of-arkansas-at-pine-bluff",
  "university-of-the-district-of-columbia",
  "university-of-the-virgin-islands",
  "virginia-state-university",
  "virginia-union-university",
  "voorhees-university",
  "west-virginia-state-university",
  "wilberforce-university",
  "wiley-university",
  "winston-salem-state-university",
  "xavier-university-of-louisiana",
])

export interface CollegeDesignation {
  code: "HSI" | "HBCU"
  label: string
  tooltip: string
  href: string
}

export function getCollegeDesignations(slug: string): CollegeDesignation[] {
  const out: CollegeDesignation[] = []
  if (HSI_SLUGS.has(slug)) {
    out.push({
      code: "HSI",
      label: "HSI",
      tooltip:
        "Hispanic-Serving Institution — federally designated for 25%+ Hispanic undergraduate enrollment. Eligible for Title V grants and dedicated support programs.",
      href: "/blog/hispanic-serving-institutions-guide",
    })
  }
  if (HBCU_SLUGS.has(slug)) {
    out.push({
      code: "HBCU",
      label: "HBCU",
      tooltip:
        "Historically Black College or University — federally designated. Strong cultural community and post-graduate mobility for Black students.",
      href: "/best-colleges/hbcus",
    })
  }
  return out
}
