// Federal / national designations for colleges that families often
// want to filter for or signal on a college profile.
//
// Sources:
//   HSI list — HACU's annually-updated set of institutions with 25%+
//   Hispanic FTE undergrad enrollment (~631 schools as of 2024-25). The
//   subset below is the most-recognized R1 / R2 / large-enrollment
//   HSIs. Expand as needed.
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
  // CSU system (selection of largest HSI campuses)
  "california-state-university-fullerton",
  "california-state-university-northridge",
  "california-state-university-los-angeles",
  "california-state-university-long-beach",
  "san-diego-state-university",
  "san-francisco-state-university",
  "san-jose-state-university",
  // Texas
  "the-university-of-texas-at-el-paso",
  "the-university-of-texas-at-san-antonio",
  "the-university-of-texas-rio-grande-valley",
  "texas-state-university",
  "ut-austin",
  "university-of-houston",
  // Florida
  "florida-international-university",
  // New Mexico
  "new-mexico-state-university-main-campus",
  "university-of-new-mexico-main-campus",
  // CUNY
  "cuny-hunter-college",
  "cuny-city-college",
  // Other
  "arizona-state-university",
])

export const HBCU_SLUGS: Set<string> = new Set([
  "howard-university",
  "spelman-college",
  "morehouse-college",
  "hampton-university",
  "tuskegee-university",
  "north-carolina-a-and-t-state-university",
  "florida-am-university",
  "xavier-university-of-louisiana",
  "fisk-university",
  "clark-atlanta-university",
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
