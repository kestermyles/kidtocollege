'use client'

import { Printer, RotateCcw, ExternalLink, AlertTriangle, Info } from 'lucide-react'
import Link from 'next/link'
import { formatUSD, type EstimatorResults, type Residency } from '@/lib/estimator-calc'

export default function ResultsDisplay({
  results,
  college,
  inputs,
  onRestart,
}: {
  results: EstimatorResults
  college: { name: string; slug: string; npc_url: string | null }
  inputs: {
    residency: Residency
    familyIncome: number
    incomeLabel: string
    siblings: number
  }
  onRestart: () => void
}) {
  const savingsPct = results.sticker.fourYear > 0
    ? Math.round((results.savings / results.sticker.fourYear) * 100)
    : 0

  const handlePrint = () => window.print()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">{college.name}</h2>
          <p className="text-sm text-gray-500">
            {inputs.residency === 'in-state' ? 'In-state' : 'Out-of-state'} · {inputs.incomeLabel}
            {inputs.siblings > 0 && ` · ${inputs.siblings} sibling${inputs.siblings > 1 ? 's' : ''} in college`}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-navy border border-card rounded-lg hover:border-navy/40"
          >
            <Printer size={14} /> Print
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-navy border border-card rounded-lg hover:border-navy/40"
          >
            <RotateCcw size={14} /> Start over
          </button>
        </div>
      </div>

      <HeadlineNumbers results={results} savingsPct={savingsPct} />

      <AboutEstimateBanner />

      <CostBreakdownPanel results={results} />

      <FourYearProjection results={results} />

      <SavingsSummary results={results} savingsPct={savingsPct} />

      <NextSteps college={college} />

      <Disclaimer />
    </div>
  )
}

function HeadlineNumbers({
  results,
  savingsPct,
}: {
  results: EstimatorResults
  savingsPct: number
}) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <Stat
        label="4-year sticker price"
        value={formatUSD(results.sticker.fourYear)}
        tone="neutral"
      />
      <Stat
        label="Estimated 4-year net cost"
        value={formatUSD(results.estimated.fourYearTotal)}
        tone="primary"
        note="After estimated need-based aid"
      />
      <Stat
        label="Estimated 4-year aid"
        value={formatUSD(results.estimated.fourYearAid)}
        tone="success"
        note={`About ${savingsPct}% off sticker`}
      />
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
  note,
}: {
  label: string
  value: string
  tone: 'neutral' | 'primary' | 'success'
  note?: string
}) {
  const toneStyles =
    tone === 'primary'
      ? 'border-navy/20 bg-navy/5'
      : tone === 'success'
      ? 'border-sage/30 bg-sage/5'
      : 'border-card bg-white'
  const valueColor =
    tone === 'primary' ? 'text-navy' : tone === 'success' ? 'text-sage' : 'text-navy'
  return (
    <div className={`rounded-lg border ${toneStyles} p-4`}>
      <div className="text-xs font-medium uppercase tracking-wide text-navy/60">{label}</div>
      <div className={`font-display text-2xl font-bold mt-1 ${valueColor}`}>{value}</div>
      {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
    </div>
  )
}

function AboutEstimateBanner() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-navy/15 bg-navy/5 p-4">
      <Info size={16} className="text-navy shrink-0 mt-0.5" />
      <p className="text-sm text-navy/85 leading-relaxed">
        <strong>About this estimate:</strong> We use the college&apos;s published cost of attendance,
        which already includes tuition, room, board, books, and basic fees. We&apos;ve added $2,500/year
        for personal expenses like entertainment, toiletries, and miscellaneous purchases.
      </p>
    </div>
  )
}

function CostBreakdownPanel({ results }: { results: EstimatorResults }) {
  const y1 = results.sticker.yearly
  return (
    <section>
      <h3 className="font-display text-lg font-bold text-navy mb-3">Year 1 cost breakdown</h3>
      <div className="border border-card rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 text-sm bg-white">
          <div>
            <span className="text-gray-600">Tuition, room, board, books &amp; fees</span>
            <span className="text-xs text-gray-400 ml-1">(from college data)</span>
          </div>
          <span className="font-medium text-navy">{formatUSD(y1.coa)}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm bg-cream/50 border-t border-card">
          <div>
            <span className="text-gray-600">Personal expenses</span>
            <span className="text-xs text-gray-400 ml-1">(entertainment, toiletries, misc.)</span>
          </div>
          <span className="font-medium text-navy">{formatUSD(y1.personal)}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-navy text-white text-sm font-semibold">
          <span>Estimated year 1 total</span>
          <span>{formatUSD(y1.total)}</span>
        </div>
      </div>
    </section>
  )
}

function FourYearProjection({ results }: { results: EstimatorResults }) {
  return (
    <section>
      <h3 className="font-display text-lg font-bold text-navy mb-3">4-year projection (with 3% inflation)</h3>
      <div className="overflow-x-auto border border-card rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-cream text-navy/70">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold">Year</th>
              <th className="px-4 py-2.5 text-right font-semibold">Total cost</th>
              <th className="px-4 py-2.5 text-right font-semibold">Est. aid</th>
              <th className="px-4 py-2.5 text-right font-semibold">Net cost</th>
            </tr>
          </thead>
          <tbody>
            {results.estimated.yearlyCosts.map(y => (
              <tr key={y.year} className="border-t border-card">
                <td className="px-4 py-2.5 text-navy">Year {y.year}</td>
                <td className="px-4 py-2.5 text-right text-navy">{formatUSD(y.breakdown.total)}</td>
                <td className="px-4 py-2.5 text-right text-sage">-{formatUSD(y.estimatedAid)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-navy">{formatUSD(y.netCost)}</td>
              </tr>
            ))}
            <tr className="border-t border-card bg-navy/5">
              <td className="px-4 py-2.5 font-semibold text-navy">4-year total</td>
              <td className="px-4 py-2.5 text-right font-semibold text-navy">{formatUSD(results.sticker.fourYear)}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-sage">-{formatUSD(results.estimated.fourYearAid)}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-navy">{formatUSD(results.estimated.fourYearTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SavingsSummary({
  results,
  savingsPct,
}: {
  results: EstimatorResults
  savingsPct: number
}) {
  return (
    <section className="bg-sage/5 border border-sage/30 rounded-lg p-4">
      <div className="flex items-baseline justify-between flex-wrap gap-1">
        <h3 className="font-display text-lg font-bold text-navy">Estimated savings vs sticker</h3>
        <span className="text-sm text-gray-500">{savingsPct}% off sticker price</span>
      </div>
      <div className="font-display text-3xl font-bold text-sage mt-1">
        {formatUSD(results.savings)}
      </div>
      <div className="mt-3 h-2 bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-sage transition-all"
          style={{ width: `${Math.min(100, savingsPct)}%` }}
        />
      </div>
    </section>
  )
}

function NextSteps({ college }: { college: { name: string; slug: string; npc_url: string | null } }) {
  const officialNpc =
    college.npc_url ??
    `https://www.google.com/search?q=${encodeURIComponent(`${college.name} net price calculator`)}`
  const npcLabel = college.npc_url
    ? `Visit ${college.name}'s official NPC`
    : `Search for ${college.name}'s NPC`
  return (
    <section className="print:hidden">
      <h3 className="font-display text-lg font-bold text-navy mb-3">Verify with official sources</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        <a
          href={officialNpc}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 border border-card rounded-lg px-3 py-2.5 text-sm hover:border-navy/40"
        >
          <span className="text-navy font-medium">{npcLabel}</span>
          <ExternalLink size={14} className="text-gray-400" />
        </a>
        <Link
          href="/fafsa-guide"
          className="flex items-center justify-between gap-2 border border-card rounded-lg px-3 py-2.5 text-sm hover:border-navy/40"
        >
          <span className="text-navy font-medium">FAFSA guide</span>
          <ExternalLink size={14} className="text-gray-400" />
        </Link>
        <Link
          href="/scholarships"
          className="flex items-center justify-between gap-2 border border-card rounded-lg px-3 py-2.5 text-sm hover:border-navy/40"
        >
          <span className="text-navy font-medium">Find scholarships</span>
          <ExternalLink size={14} className="text-gray-400" />
        </Link>
        <Link
          href="/financial-aid"
          className="flex items-center justify-between gap-2 border border-card rounded-lg px-3 py-2.5 text-sm hover:border-navy/40"
        >
          <span className="text-navy font-medium">Financial aid overview</span>
          <ExternalLink size={14} className="text-gray-400" />
        </Link>
      </div>
    </section>
  )
}

function Disclaimer() {
  return (
    <section className="border-2 border-gold/50 bg-gold/10 rounded-lg p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="text-gold shrink-0 mt-0.5" />
        <div>
          <h3 className="font-display text-base font-bold text-navy">Important disclaimer</h3>
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
