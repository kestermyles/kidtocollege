'use client';

import { useState } from 'react';
import { simulateNPC, type NPCInput, type NPCResult } from '@/lib/npc-calculator';

interface NPCCalculatorProps {
  college: {
    name: string;
    slug: string;
    avg_cost_instate: number;
    avg_grant_percentage: number | null;
    meets_full_need: boolean | null;
    merit_aid_available: boolean | null;
    no_loan_threshold: number | null;
  };
}

export default function NPCCalculator({ college }: NPCCalculatorProps) {
  const [input, setInput] = useState<NPCInput>({
    familyIncome: 75000,
    assets: 50000,
    gpa: 3.5,
    satScore: undefined,
    numInHousehold: 4,
    numInCollege: 1,
  });

  const [result, setResult] = useState<NPCResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    const npcResult = simulateNPC(input, {
      costOfAttendance: college.avg_cost_instate,
      avgGrantPercentage: college.avg_grant_percentage || 60,
      meetsFullNeed: college.meets_full_need || false,
      meritAidAvailable: college.merit_aid_available !== false,
      noLoanThreshold: college.no_loan_threshold || undefined,
    });

    setResult(npcResult);
    setShowResults(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calculate Your Cost at {college.name}</h2>
      <p className="text-gray-600 mb-6">
        Get a personalized estimate of what you&apos;d pay to attend {college.name}
      </p>

      <div className="space-y-4">
        {/* Family Income */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Annual Family Income
          </label>
          <input
            type="number"
            value={input.familyIncome}
            onChange={(e) => setInput({ ...input, familyIncome: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            placeholder="75000"
          />
        </div>

        {/* Assets */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Family Assets (excluding home)
          </label>
          <input
            type="number"
            value={input.assets}
            onChange={(e) => setInput({ ...input, assets: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            placeholder="50000"
          />
        </div>

        {/* GPA */}
        <div>
          <label className="block text-sm font-medium mb-1">Your GPA</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            value={input.gpa}
            onChange={(e) => setInput({ ...input, gpa: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            placeholder="3.5"
          />
        </div>

        {/* SAT Score (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            SAT Score (optional)
          </label>
          <input
            type="number"
            value={input.satScore || ''}
            onChange={(e) =>
              setInput({ ...input, satScore: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="1400"
          />
        </div>

        {/* Household Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              People in Household
            </label>
            <select
              value={input.numInHousehold}
              onChange={(e) => setInput({ ...input, numInHousehold: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            >
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              In College
            </label>
            <select
              value={input.numInCollege}
              onChange={(e) => setInput({ ...input, numInCollege: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Calculate My Cost
        </button>
      </div>

      {/* Results */}
      {showResults && result && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Your Estimated Cost</h3>

          {/* Net Price - Big Number */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
            <div className="text-sm text-gray-600 mb-1">Estimated Annual Net Price</div>
            <div className="text-4xl font-bold text-blue-600">
              ${result.netPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Confidence: <span className="font-semibold capitalize">{result.confidence}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cost of Attendance</span>
              <span className="font-semibold">${result.costOfAttendance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Federal Pell Grant</span>
              <span className="font-semibold">-${result.federalPellGrant.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>{college.name} Grant</span>
              <span className="font-semibold">-${result.institutionalGrant.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Your Net Price</span>
              <span>${result.netPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* How to Pay */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">How to Cover Your Net Price:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Family Contribution</span>
                <span>${result.expectedFamilyContribution.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Work-Study</span>
                <span>${result.recommendedWorkStudy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Student Loans (per year)</span>
                <span>${result.recommendedLoans.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 4-Year Estimate */}
          <div className="mt-6 bg-yellow-50 rounded p-4">
            <div className="text-sm">
              <strong>4-Year Estimate:</strong> If costs remain similar, you&apos;d borrow approximately{' '}
              <strong>${result.estimatedDebt.toLocaleString()}</strong> total over 4 years.
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <strong>Important:</strong> This is an estimate based on typical aid packages. Your actual cost may vary.
            For the most accurate estimate, use {college.name}&apos;s official Net Price Calculator.
          </div>
        </div>
      )}
    </div>
  );
}
