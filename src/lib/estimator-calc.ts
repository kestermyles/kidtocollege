// Pure calculation helpers for the Net Price Estimator.
// COA-based model: avg_cost_instate/outstate from College Scorecard already includes
// tuition + fees + room + board + books. We add a flat personal-expenses bump only.

export type Residency = 'in-state' | 'out-of-state'
// Informational only — does not affect calculation. COA from Scorecard already
// averages room/board, so housing choice changes real-world out-of-pocket
// cost but not the published estimate. Kept here so the form + results share a type.
export type Housing = 'on-campus' | 'off-campus' | 'commuter'

export interface EstimatorInputs {
  collegeName: string
  collegeSlug: string
  residency: Residency
  familyIncome: number // midpoint of chosen income range
  siblingsInCollege: number
  isVeteran: boolean
  isFirstGen: boolean
}

export interface CostBreakdown {
  coa: number       // Published cost of attendance (tuition + fees + room + board + books)
  personal: number  // Added personal expenses (entertainment, toiletries, misc)
  total: number
}

export interface YearlyCost {
  year: number
  breakdown: CostBreakdown
  estimatedAid: number
  netCost: number
}

export interface EstimatorResults {
  sticker: {
    yearly: CostBreakdown
    fourYear: number
  }
  estimated: {
    yearlyAid: number // aid in year 1
    yearlyCosts: YearlyCost[]
    fourYearTotal: number
    fourYearAid: number
  }
  savings: number
}

export const INCOME_RANGES: { label: string; midpoint: number }[] = [
  { label: 'Under $30,000', midpoint: 20000 },
  { label: '$30,000 – $50,000', midpoint: 40000 },
  { label: '$50,000 – $75,000', midpoint: 62500 },
  { label: '$75,000 – $100,000', midpoint: 87500 },
  { label: '$100,000 – $150,000', midpoint: 125000 },
  { label: '$150,000 – $200,000', midpoint: 175000 },
  { label: 'Over $200,000', midpoint: 250000 },
]

export const PERSONAL_EXPENSES = 2500
const INFLATION_RATE = 0.03

function aidPercentageFor(income: number): number {
  if (income < 30000) return 0.85
  if (income < 50000) return 0.7
  if (income < 75000) return 0.5
  if (income < 100000) return 0.3
  if (income < 150000) return 0.15
  return 0.05
}

export function estimateFinancialAid(
  familyIncome: number,
  baseCost: number,
  siblingsInCollege: number,
): number {
  const base = aidPercentageFor(familyIncome)
  const siblingMultiplier = siblingsInCollege > 0 ? 1 + siblingsInCollege * 0.1 : 1
  const raw = baseCost * base * siblingMultiplier
  return Math.min(raw, baseCost * 0.95)
}

function buildBreakdown(coa: number): CostBreakdown {
  return {
    coa,
    personal: PERSONAL_EXPENSES,
    total: coa + PERSONAL_EXPENSES,
  }
}

function inflate(breakdown: CostBreakdown, years: number): CostBreakdown {
  const factor = Math.pow(1 + INFLATION_RATE, years)
  const scaled = (n: number) => Math.round(n * factor)
  return {
    coa: scaled(breakdown.coa),
    personal: scaled(breakdown.personal),
    total: scaled(breakdown.total),
  }
}

export function calculateNetPrice(
  inputs: EstimatorInputs,
  collegeData: { avg_cost_instate: number | null; avg_cost_outstate: number | null },
): EstimatorResults {
  const chosen =
    inputs.residency === 'in-state'
      ? collegeData.avg_cost_instate
      : collegeData.avg_cost_outstate
  const coa = chosen ?? collegeData.avg_cost_instate ?? collegeData.avg_cost_outstate ?? 0

  const year1 = buildBreakdown(coa)
  const yearlyAidY1 = Math.round(
    estimateFinancialAid(inputs.familyIncome, year1.total, inputs.siblingsInCollege),
  )
  const aidRate = year1.total > 0 ? yearlyAidY1 / year1.total : 0

  const yearlyCosts: YearlyCost[] = []
  let fourYearCostTotal = 0
  let fourYearAidTotal = 0
  for (let y = 0; y < 4; y++) {
    const breakdown = inflate(year1, y)
    const estimatedAid = Math.round(breakdown.total * aidRate)
    const netCost = breakdown.total - estimatedAid
    yearlyCosts.push({ year: y + 1, breakdown, estimatedAid, netCost })
    fourYearCostTotal += breakdown.total
    fourYearAidTotal += estimatedAid
  }

  return {
    sticker: {
      yearly: year1,
      fourYear: fourYearCostTotal,
    },
    estimated: {
      yearlyAid: yearlyAidY1,
      yearlyCosts,
      fourYearTotal: fourYearCostTotal - fourYearAidTotal,
      fourYearAid: fourYearAidTotal,
    },
    savings: fourYearAidTotal,
  }
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
