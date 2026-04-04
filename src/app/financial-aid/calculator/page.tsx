"use client";

import { useState } from "react";
import Link from "next/link";

const INCOME_BRACKETS = [
  { label: "Under $30,000", value: 15000, needPct: 0.85 },
  { label: "$30,000 – $48,000", value: 39000, needPct: 0.75 },
  { label: "$48,000 – $75,000", value: 60000, needPct: 0.55 },
  { label: "$75,000 – $110,000", value: 90000, needPct: 0.35 },
  { label: "$110,000 – $150,000", value: 130000, needPct: 0.15 },
  { label: "$150,000 – $200,000", value: 175000, needPct: 0.05 },
  { label: "Over $200,000", value: 250000, needPct: 0 },
];

const ASSET_BRACKETS = [
  { label: "Under $50,000", multiplier: 1.0 },
  { label: "$50,000 – $200,000", multiplier: 0.85 },
  { label: "Over $200,000", multiplier: 0.65 },
];

function formatCurrency(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

export default function NetPriceCalculatorPage() {
  const [incomeIdx, setIncomeIdx] = useState<number | null>(null);
  const [assetIdx, setAssetIdx] = useState<number | null>(null);
  const [childrenInCollege, setChildrenInCollege] = useState(1);
  const [gpa, setGpa] = useState("");
  const [sat, setSat] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Example colleges for estimation
  const SAMPLE_COLLEGES = [
    { name: "Public University (In-State)", coa: 28000, meritBase: 3000 },
    { name: "Public University (Out-of-State)", coa: 48000, meritBase: 5000 },
    { name: "Private University", coa: 62000, meritBase: 8000 },
  ];

  function calculateResults() {
    if (incomeIdx === null || assetIdx === null) return [];

    const income = INCOME_BRACKETS[incomeIdx];
    const asset = ASSET_BRACKETS[assetIdx];
    const gpaNum = parseFloat(gpa) || 3.0;
    const satNum = parseInt(sat) || 0;

    const childMultiplier = childrenInCollege > 1 ? 1 + (childrenInCollege - 1) * 0.15 : 1;
    const meritMultiplier = gpaNum >= 3.8 ? 1.5 : gpaNum >= 3.5 ? 1.2 : gpaNum >= 3.0 ? 1.0 : 0.5;
    const satBonus = satNum >= 1400 ? 3000 : satNum >= 1200 ? 1500 : 0;

    return SAMPLE_COLLEGES.map((college) => {
      const needGrant = Math.round(college.coa * income.needPct * asset.multiplier * childMultiplier);
      const meritAid = Math.round(college.meritBase * meritMultiplier + satBonus);
      const totalAid = Math.min(needGrant + meritAid, college.coa * 0.9);
      const netPrice = Math.max(college.coa - totalAid, college.coa * 0.08);
      const monthly = Math.round(netPrice / 120); // 10 years

      return {
        name: college.name,
        coa: college.coa,
        needGrant,
        meritAid,
        netPrice: Math.round(netPrice),
        monthly,
      };
    });
  }

  function handleCalculate() {
    setShowResults(true);
  }

  const results = showResults ? calculateResults() : [];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            Net Price Estimator
          </h1>
          <p className="font-body text-navy/60">
            Estimate what you&apos;ll actually pay after financial aid and merit
            scholarships.
          </p>
        </div>

        <div className="ktc-card p-6 sm:p-8 mb-8">
          {/* Step 1: Income */}
          <div className="mb-6">
            <label className="font-body font-medium text-navy text-sm block mb-3">
              1. Household income
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INCOME_BRACKETS.map((b, i) => (
                <button
                  key={b.label}
                  onClick={() => setIncomeIdx(i)}
                  className={`px-3 py-2 rounded-md text-sm font-body border transition-all ${
                    incomeIdx === i
                      ? "bg-gold text-navy border-gold font-medium"
                      : "bg-white text-navy/60 border-gray-200 hover:border-gold/40"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Assets */}
          <div className="mb-6">
            <label className="font-body font-medium text-navy text-sm block mb-3">
              2. Total household assets (savings, investments — excluding home and retirement)
            </label>
            <div className="flex flex-wrap gap-2">
              {ASSET_BRACKETS.map((b, i) => (
                <button
                  key={b.label}
                  onClick={() => setAssetIdx(i)}
                  className={`px-4 py-2 rounded-md text-sm font-body border transition-all ${
                    assetIdx === i
                      ? "bg-gold text-navy border-gold font-medium"
                      : "bg-white text-navy/60 border-gray-200 hover:border-gold/40"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Children */}
          <div className="mb-6">
            <label className="font-body font-medium text-navy text-sm block mb-3">
              3. Children in college at the same time
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setChildrenInCollege(n)}
                  className={`w-12 h-12 rounded-md text-sm font-body font-medium border transition-all ${
                    childrenInCollege === n
                      ? "bg-gold text-navy border-gold"
                      : "bg-white text-navy/60 border-gray-200 hover:border-gold/40"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: GPA/SAT */}
          <div className="mb-6">
            <label className="font-body font-medium text-navy text-sm block mb-3">
              4. Academic profile (for merit aid estimate)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="GPA e.g. 3.7"
                className="w-32 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
              />
              <input
                type="number"
                min="400"
                max="1600"
                value={sat}
                onChange={(e) => setSat(e.target.value)}
                placeholder="SAT (optional)"
                className="w-36 px-3 py-2 border border-gray-200 rounded-md font-body text-sm text-navy focus:outline-none focus:border-gold/60"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={incomeIdx === null || assetIdx === null}
            className="w-full bg-gold hover:bg-gold/90 text-navy font-body font-medium py-4 rounded-md text-lg transition-colors disabled:opacity-40"
          >
            Estimate my net price &rarr;
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="font-display text-2xl font-bold text-navy">
              Estimated costs
            </h2>
            {results.map((r) => (
              <div key={r.name} className="ktc-card p-6">
                <h3 className="font-display text-lg font-bold text-navy mb-4">
                  {r.name}
                </h3>
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-navy/60">Total cost of attendance</span>
                    <span className="text-navy font-medium">
                      {formatCurrency(r.coa)}/year
                    </span>
                  </div>
                  <div className="flex justify-between text-sage">
                    <span>Estimated need-based grant</span>
                    <span className="font-medium">
                      &minus;{formatCurrency(r.needGrant)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sage">
                    <span>Estimated merit aid</span>
                    <span className="font-medium">
                      &minus;{formatCurrency(r.meritAid)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-card">
                    <span className="text-navy font-bold">
                      Estimated net price
                    </span>
                    <span className="text-gold font-bold text-lg">
                      {formatCurrency(r.netPrice)}/year
                    </span>
                  </div>
                  <div className="flex justify-between text-navy/40 text-xs pt-1">
                    <span>Monthly if financed over 10 years</span>
                    <span>{formatCurrency(r.monthly)}/month</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
              <p className="text-sm text-amber-900">
                <strong>These are rough estimates only.</strong> Actual aid
                depends on each college&apos;s formula, your full financial
                picture, and the current year&apos;s funding. Always check each
                college&apos;s{" "}
                <a
                  href="https://collegecost.ed.gov/net-price"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  official net price calculator
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/fafsa-guide"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            FAFSA Guide
          </Link>
          <Link
            href="/financial-aid"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            State Aid Guides
          </Link>
          <Link
            href="/scholarships"
            className="px-5 py-2.5 border border-card rounded-md font-body text-sm text-navy hover:border-gold/40 transition-colors"
          >
            Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
}
