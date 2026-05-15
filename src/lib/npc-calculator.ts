// EFC (Expected Family Contribution) Calculator
// Simplified federal methodology
export function calculateEFC(
  familyIncome: number,
  assets: number,
  numInHousehold: number,
  numInCollege: number
): number {
  const incomeProtection: { [key: number]: number } = {
    2: 19500,
    3: 24270,
    4: 30000,
    5: 35380,
    6: 41380,
  };

  const protectionAllowance = incomeProtection[numInHousehold] || 35000;
  const availableIncome = Math.max(0, familyIncome - protectionAllowance);

  let incomeContribution = 0;
  if (availableIncome <= 17000) {
    incomeContribution = availableIncome * 0.22;
  } else if (availableIncome <= 21500) {
    incomeContribution = 3740 + (availableIncome - 17000) * 0.25;
  } else if (availableIncome <= 26000) {
    incomeContribution = 4865 + (availableIncome - 21500) * 0.29;
  } else if (availableIncome <= 30500) {
    incomeContribution = 6170 + (availableIncome - 26000) * 0.34;
  } else {
    incomeContribution = 7700 + (availableIncome - 30500) * 0.47;
  }

  const assetProtection = 10000;
  const availableAssets = Math.max(0, assets - assetProtection);
  const assetContribution = availableAssets * 0.12;

  const parentContribution = incomeContribution + assetContribution;
  const efc = Math.round(parentContribution / numInCollege);

  return Math.max(0, efc);
}

export function calculatePellGrant(efc: number): number {
  const maxPellGrant = 7395;
  if (efc >= 6656) return 0;
  if (efc === 0) return maxPellGrant;
  return Math.round(maxPellGrant * (1 - efc / 6656));
}

export interface NPCInput {
  familyIncome: number;
  assets: number;
  gpa: number;
  satScore?: number;
  numInHousehold: number;
  numInCollege: number;
  stateResident?: string;
}

export interface CollegeAidProfile {
  costOfAttendance: number;
  avgGrantPercentage: number;
  meetsFullNeed: boolean;
  meritAidAvailable: boolean;
  noLoanThreshold?: number;
}

export interface NPCResult {
  costOfAttendance: number;
  expectedFamilyContribution: number;
  federalPellGrant: number;
  institutionalGrant: number;
  totalGrants: number;
  netPrice: number;
  recommendedLoans: number;
  recommendedWorkStudy: number;
  estimatedDebt: number;
  confidence: 'high' | 'medium' | 'low';
}

export function simulateNPC(
  input: NPCInput,
  college: CollegeAidProfile
): NPCResult {
  const coa = college.costOfAttendance;
  const efc = calculateEFC(
    input.familyIncome,
    input.assets,
    input.numInHousehold,
    input.numInCollege
  );

  const need = Math.max(0, coa - efc);
  const pellGrant = calculatePellGrant(efc);

  let institutionalGrant = 0;

  if (college.meetsFullNeed) {
    institutionalGrant = need - pellGrant;
  } else {
    const needAfterPell = need - pellGrant;
    institutionalGrant = needAfterPell * (college.avgGrantPercentage / 100);
  }

  if (college.meritAidAvailable && input.gpa >= 3.7 && (input.satScore || 0) >= 1400) {
    institutionalGrant += 5000;
  }

  let recommendedLoans = 0;
  if (college.noLoanThreshold && input.familyIncome < college.noLoanThreshold) {
    institutionalGrant = Math.max(institutionalGrant, need - pellGrant);
  } else {
    recommendedLoans = Math.min(5500, Math.max(0, coa - efc - pellGrant - institutionalGrant));
  }

  const recommendedWorkStudy = 2500;
  const totalGrants = pellGrant + institutionalGrant;
  const netPrice = Math.max(0, coa - totalGrants);
  const estimatedDebt = recommendedLoans * 4;

  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (college.meetsFullNeed) {
    confidence = 'high';
  } else if (college.avgGrantPercentage < 50) {
    confidence = 'low';
  }

  return {
    costOfAttendance: Math.round(coa),
    expectedFamilyContribution: efc,
    federalPellGrant: Math.round(pellGrant),
    institutionalGrant: Math.round(institutionalGrant),
    totalGrants: Math.round(totalGrants),
    netPrice: Math.round(netPrice),
    recommendedLoans: Math.round(recommendedLoans),
    recommendedWorkStudy,
    estimatedDebt: Math.round(estimatedDebt),
    confidence,
  };
}
