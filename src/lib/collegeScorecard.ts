const SCORECARD_API =
  "https://api.data.gov/ed/collegescorecard/v1/schools";
const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;

export interface ScorecardData {
  medianEarnings6yr: number | null;
  medianEarnings10yr: number | null;
  employmentRate: number | null;
  graduationRate4yr: number | null;
  loanDefaultRate: number | null;
}

export async function fetchScorecardData(
  collegeName: string
): Promise<ScorecardData | null> {
  if (!API_KEY) {
    console.error("COLLEGE_SCORECARD_API_KEY not set");
    return null;
  }

  try {
    const params = new URLSearchParams({
      "school.name": collegeName,
      fields: [
        "school.name",
        "latest.earnings.6_yrs_after_entry.median",
        "latest.earnings.10_yrs_after_entry.median",
        "latest.completion.rate_suppressed.four_year",
        "latest.repayment.3_yr_default_rate",
        "latest.employment.employed_2_yrs_after_completion.rate_suppressed",
      ].join(","),
      api_key: API_KEY,
      per_page: "1",
    });

    const res = await fetch(`${SCORECARD_API}?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const school = data.results?.[0];
    if (!school) return null;

    return {
      medianEarnings6yr:
        school["latest.earnings.6_yrs_after_entry.median"] ?? null,
      medianEarnings10yr:
        school["latest.earnings.10_yrs_after_entry.median"] ?? null,
      employmentRate:
        school[
          "latest.employment.employed_2_yrs_after_completion.rate_suppressed"
        ] ?? null,
      graduationRate4yr:
        school["latest.completion.rate_suppressed.four_year"] ?? null,
      loanDefaultRate:
        school["latest.repayment.3_yr_default_rate"] ?? null,
    };
  } catch (err) {
    console.error("Scorecard fetch error:", err);
    return null;
  }
}
