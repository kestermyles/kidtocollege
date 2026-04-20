// Pure calculation helpers for the Net Price Estimator.
// All math happens here so the UI can stay presentational and testable.

export type Residency = 'in-state' | 'out-of-state'
export type Housing = 'on-campus' | 'off-campus' | 'commuter'

export interface EstimatorInputs {
  collegeName: string
  collegeSlug: string
  residency: Residency
  housing: Housing
  familyIncome: number // midpoint of chosen income range
  siblingsInCollege: number
  isVeteran: boolean
  isFirstGen: boolean
}

export interface CostBreakdown {
  tuition: number
  housing: number
  meals: number
  books: number
  transportation: number
  personal: number
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

// Income range option for the form dropdown. `midpoint` is what the calc uses.
export const INCOME_RANGES: { label: string; midpoint: number }[] = [
  { label: 'Under $30,000', midpoint: 20000 },
  { label: '$30,000 – $50,000', midpoint: 40000 },
  { label: '$50,000 – $75,000', midpoint: 62500 },
  { label: '$75,000 – $100,000', midpoint: 87500 },
  { label: '$100,000 – $150,000', midpoint: 125000 },
  { label: '$150,000 – $200,000', midpoint: 175000 },
  { label: 'Over $200,000', midpoint: 250000 },
]

const HOUSING_COST: Record<Housing, number> = {
  'on-campus': 12000,
  'off-campus': 10000,
  commuter: 0,
}

const MEAL_COST: Record<Housing, number> = {
  'on-campus': 5000,
  'off-campus': 4000,
  commuter: 2000,
}

const TRANSPORT_COST: Record<Housing, number> = {
  'on-campus': 1500,
  'off-campus': 1500,
  commuter: 3000,
}

const BOOKS = 1200
const PERSONAL = 2500
const INFLATION_RATE = 0.03

// Aid percentage by income bracket (midpoint). Intentionally simplified.
// Covered by the disclaimers on the page: this is a rough ballpark, not EFC.
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
  // Never estimate >95% of cost — keep a realistic floor of family contribution.
  return Math.min(raw, baseCost * 0.95)
}

function buildBreakdown(
  tuition: number,
  housing: Housing,
): CostBreakdown {
  const h = HOUSING_COST[housing]
  const m = MEAL_COST[housing]
  const t = TRANSPORT_COST[housing]
  return {
    tuition,
    housing: h,
    meals: m,
    books: BOOKS,
    transportation: t,
    personal: PERSONAL,
    total: tuition + h + m + BOOKS + t + PERSONAL,
  }
}

function inflate(breakdown: CostBreakdown, years: number): CostBreakdown {
  const factor = Math.pow(1 + INFLATION_RATE, years)
  const scaled = (n: number) => Math.round(n * factor)
  return {
    tuition: scaled(breakdown.tuition),
    housing: scaled(breakdown.housing),
    meals: scaled(breakdown.meals),
    books: scaled(breakdown.books),
    transportation: scaled(breakdown.transportation),
    personal: scaled(breakdown.personal),
    total: scaled(breakdown.total),
  }
}

export function calculateNetPrice(
  inputs: EstimatorInputs,
  collegeData: { avg_cost_instate: number | null; avg_cost_outstate: number | null },
): EstimatorResults {
  const tuitionRaw =
    inputs.residency === 'in-state'
      ? collegeData.avg_cost_instate
      : collegeData.avg_cost_outstate
  // Fallback to the other residency value if one is missing, then 0.
  const tuition = tuitionRaw ?? collegeData.avg_cost_instate ?? collegeData.avg_cost_outstate ?? 0

  const year1 = buildBreakdown(tuition, inputs.housing)
  const yearlyAidY1 = Math.round(
    estimateFinancialAid(inputs.familyIncome, year1.total, inputs.siblingsInCollege),
  )

  const aidRate = year1.total > 0 ? yearlyAidY1 / year1.total : 0
  const yearlyCosts: YearlyCost[] = []
  let fourYearTotal = 0
  let fourYearAid = 0
  for (let y = 0; y < 4; y++) {
    const breakdown = inflate(year1, y)
    const estimatedAid = Math.round(breakdown.total * aidRate)
    const netCost = breakdown.total - estimatedAid
    yearlyCosts.push({ year: y + 1, breakdown, estimatedAid, netCost })
    fourYearTotal += breakdown.total
    fourYearAid += estimatedAid
  }

  const stickerFourYear = yearlyCosts.reduce((s, y) => s + y.breakdown.total, 0)

  return {
    sticker: {
      yearly: year1,
      fourYear: stickerFourYear,
    },
    estimated: {
      yearlyAid: yearlyAidY1,
      yearlyCosts,
      fourYearTotal: fourYearTotal - fourYearAid,
      fourYearAid,
    },
    savings: fourYearAid,
  }
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
