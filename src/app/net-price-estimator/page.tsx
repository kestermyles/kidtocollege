import { AlertTriangle } from 'lucide-react'
import EstimatorForm from '@/components/estimator/EstimatorForm'

export const metadata = {
  title: 'Net Price Estimator — Estimate Your 4-Year College Cost | KidToCollege',
  description:
    'Estimate the real 4-year cost of college including tuition, housing, books, and hidden expenses. Get a ballpark financial aid figure based on your family income.',
}

export default function NetPriceEstimatorPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <section className="mb-6">
        <h1 className="font-display text-3xl font-bold text-navy">Net Price Estimator</h1>
        <p className="text-gray-500 mt-1">
          Estimate the true cost of college over 4 years, including all expenses and rough financial aid estimates.
        </p>
      </section>

      <TopDisclaimer />

      <EstimatorForm />

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-navy mb-3">What this estimator includes</h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-navy/80 list-disc pl-5">
          <li>Tuition and fees (from published college data)</li>
          <li>Room and board estimates</li>
          <li>Books and supplies</li>
          <li>Transportation</li>
          <li>Personal expenses</li>
          <li>Rough need-based aid based on income bracket</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Not included: merit scholarships, outside scholarships, program-specific aid (veterans, first-gen initiatives), state grants, institutional work-study.
        </p>
      </section>

      <BottomDisclaimer />
    </main>
  )
}

function TopDisclaimer() {
  return (
    <section className="mb-6 border-2 border-gold/50 bg-gold/10 rounded-lg p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="text-gold shrink-0 mt-0.5" />
        <div>
          <h2 className="font-display text-base font-bold text-navy">Estimates only — not financial advice</h2>
          <p className="text-sm text-navy/80 mt-1 leading-relaxed">
            This calculator provides ballpark estimates for planning purposes. It is not a guarantee of actual costs or aid offers. Always verify with each college&apos;s official Net Price Calculator and financial aid office.
          </p>
        </div>
      </div>
    </section>
  )
}

function BottomDisclaimer() {
  return (
    <section className="mt-10 border-2 border-gold/50 bg-gold/10 rounded-lg p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="text-gold shrink-0 mt-0.5" />
        <div>
          <h2 className="font-display text-base font-bold text-navy">Important disclaimer</h2>
          <p className="text-sm text-navy/80 mt-1 leading-relaxed">
            This calculator provides estimates only and is not a guarantee of actual costs or financial aid. Actual expenses and aid packages vary significantly based on individual circumstances, family finances, merit scholarships, and college policies.
          </p>
          <p className="text-sm text-navy/80 mt-2 leading-relaxed">
            This tool does not replace the official net price calculator provided by each college, which uses more detailed information to provide personalized estimates. Always consult each college&apos;s official net price calculator and financial aid office for accurate, individualized information. This tool is for educational purposes only and is not financial advice.
          </p>
        </div>
      </div>
    </section>
  )
}
