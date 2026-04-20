'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase-browser'
import {
  calculateNetPrice,
  INCOME_RANGES,
  type EstimatorInputs,
  type EstimatorResults,
  type Housing,
  type Residency,
} from '@/lib/estimator-calc'
import ResultsDisplay from './ResultsDisplay'

type CollegeOption = {
  slug: string
  name: string
  location: string | null
  state: string | null
  acceptance_rate: number | null
  avg_cost_instate: number | null
  avg_cost_outstate: number | null
}

type Step = 1 | 2 | 3 | 4

export default function EstimatorForm() {
  const [step, setStep] = useState<Step>(1)
  const [college, setCollege] = useState<CollegeOption | null>(null)
  const [residency, setResidency] = useState<Residency>('in-state')
  const [housing, setHousing] = useState<Housing>('on-campus')
  const [isVeteran, setIsVeteran] = useState(false)
  const [isFirstGen, setIsFirstGen] = useState(false)
  const [incomeMidpoint, setIncomeMidpoint] = useState<number | null>(null)
  const [siblings, setSiblings] = useState(0)
  const [results, setResults] = useState<EstimatorResults | null>(null)

  const selectedIncomeLabel =
    INCOME_RANGES.find(r => r.midpoint === incomeMidpoint)?.label ?? ''

  const canAdvance = (s: Step): boolean => {
    switch (s) {
      case 1:
        return college !== null
      case 2:
        return true
      case 3:
        return incomeMidpoint !== null && siblings >= 0
      case 4:
        return true
    }
  }

  const calculate = () => {
    if (!college || incomeMidpoint == null) return
    const inputs: EstimatorInputs = {
      collegeName: college.name,
      collegeSlug: college.slug,
      residency,
      housing,
      familyIncome: incomeMidpoint,
      siblingsInCollege: siblings,
      isVeteran,
      isFirstGen,
    }
    const r = calculateNetPrice(inputs, {
      avg_cost_instate: college.avg_cost_instate,
      avg_cost_outstate: college.avg_cost_outstate,
    })
    setResults(r)
  }

  const reset = () => {
    setResults(null)
    setStep(1)
    setCollege(null)
  }

  if (results && college && incomeMidpoint != null) {
    return (
      <ResultsDisplay
        results={results}
        college={{ name: college.name, slug: college.slug }}
        inputs={{
          residency,
          housing,
          familyIncome: incomeMidpoint,
          incomeLabel: selectedIncomeLabel,
          siblings,
        }}
        onRestart={reset}
      />
    )
  }

  return (
    <div className="bg-white border border-card rounded-xl shadow-card p-6 sm:p-8">
      <ProgressBar step={step} />

      {step === 1 && (
        <StepOne college={college} onSelect={setCollege} />
      )}

      {step === 2 && (
        <StepTwo
          residency={residency}
          housing={housing}
          isVeteran={isVeteran}
          isFirstGen={isFirstGen}
          onResidencyChange={setResidency}
          onHousingChange={setHousing}
          onVeteranChange={setIsVeteran}
          onFirstGenChange={setIsFirstGen}
        />
      )}

      {step === 3 && (
        <StepThree
          incomeMidpoint={incomeMidpoint}
          siblings={siblings}
          onIncomeChange={setIncomeMidpoint}
          onSiblingsChange={setSiblings}
        />
      )}

      {step === 4 && college && (
        <StepFour
          college={college}
          residency={residency}
          housing={housing}
          isVeteran={isVeteran}
          isFirstGen={isFirstGen}
          incomeLabel={selectedIncomeLabel}
          siblings={siblings}
        />
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-card">
        <button
          type="button"
          onClick={() => setStep((s => (s > 1 ? ((s - 1) as Step) : s))(step))}
          disabled={step === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-navy/70 disabled:opacity-30 disabled:cursor-not-allowed hover:text-navy"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => canAdvance(step) && setStep(((step + 1) as Step))}
            disabled={!canAdvance(step)}
            className="flex items-center gap-1 px-5 py-2.5 text-sm font-semibold bg-navy text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy/90"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={calculate}
            className="flex items-center gap-1 px-5 py-2.5 text-sm font-semibold bg-gold text-navy rounded-lg hover:bg-gold/90"
          >
            Calculate Net Price
          </button>
        )}
      </div>
    </div>
  )
}

function ProgressBar({ step }: { step: Step }) {
  const labels = ['College', 'Situation', 'Finances', 'Review']
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs font-medium text-navy/60 mb-2">
        <span>Step {step} of 4</span>
        <span>{labels[step - 1]}</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-gold' : 'bg-card'}`}
          />
        ))}
      </div>
    </div>
  )
}

function StepOne({
  college,
  onSelect,
}: {
  college: CollegeOption | null
  onSelect: (c: CollegeOption | null) => void
}) {
  const [query, setQuery] = useState(college?.name ?? '')
  const [results, setResults] = useState<CollegeOption[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (college && query === college.name) return
    if (query.length < 2) {
      setResults([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('colleges')
          .select('slug, name, location, state, acceptance_rate, avg_cost_instate, avg_cost_outstate')
          .ilike('name', `%${query}%`)
          .order('total_enrollment', { ascending: false, nullsFirst: false })
          .limit(8)
        setResults((data ?? []) as CollegeOption[])
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, college])

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-navy mb-1">Which college?</h2>
      <p className="text-sm text-gray-500 mb-4">Search from our database of colleges to get started.</p>

      <div className="relative">
        <div className="flex items-center gap-2 border border-card rounded-lg px-3 py-2.5 focus-within:border-navy/60">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
              if (college) onSelect(null)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Start typing a college name..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {college && <CheckCircle2 size={16} className="text-sage" />}
        </div>

        {open && query.length >= 2 && !college && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-card rounded-lg shadow-card z-10 max-h-72 overflow-y-auto">
            {loading && <div className="p-3 text-sm text-gray-400">Searching...</div>}
            {!loading && results.length === 0 && (
              <div className="p-3 text-sm text-gray-400">No matches — try a different name.</div>
            )}
            {results.map(r => (
              <button
                key={r.slug}
                type="button"
                onClick={() => {
                  onSelect(r)
                  setQuery(r.name)
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 hover:bg-cream border-b border-card last:border-b-0"
              >
                <div className="text-sm font-medium text-navy">{r.name}</div>
                <div className="text-xs text-gray-500">
                  {r.location ?? r.state ?? ''}
                  {r.acceptance_rate != null && <> · {Math.round(r.acceptance_rate * 100)}% acceptance</>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {college && (
        <div className="mt-3 p-3 bg-cream border border-card rounded-lg text-sm">
          <div className="font-medium text-navy">{college.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {college.location ?? college.state ?? ''}
            {college.avg_cost_instate && <> · in-state cost of attendance ${college.avg_cost_instate.toLocaleString()}</>}
          </div>
        </div>
      )}
    </div>
  )
}

function StepTwo({
  residency,
  housing,
  isVeteran,
  isFirstGen,
  onResidencyChange,
  onHousingChange,
  onVeteranChange,
  onFirstGenChange,
}: {
  residency: Residency
  housing: Housing
  isVeteran: boolean
  isFirstGen: boolean
  onResidencyChange: (r: Residency) => void
  onHousingChange: (h: Housing) => void
  onVeteranChange: (v: boolean) => void
  onFirstGenChange: (v: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-navy mb-1">Your situation</h2>
        <p className="text-sm text-gray-500 mb-4">Tell us about residency and where you will live.</p>
      </div>

      <Fieldset label="Residency">
        <RadioGroup
          name="residency"
          value={residency}
          onChange={v => onResidencyChange(v as Residency)}
          options={[
            { value: 'in-state', label: 'In-state' },
            { value: 'out-of-state', label: 'Out-of-state' },
          ]}
        />
      </Fieldset>

      <Fieldset label="Housing plan">
        <RadioGroup
          name="housing"
          value={housing}
          onChange={v => onHousingChange(v as Housing)}
          options={[
            { value: 'on-campus', label: 'On-campus' },
            { value: 'off-campus', label: 'Off-campus' },
            { value: 'commuter', label: 'Commuter (living at home)' },
          ]}
        />
      </Fieldset>

      <Fieldset label="Optional context">
        <div className="space-y-2">
          <Checkbox
            checked={isFirstGen}
            onChange={onFirstGenChange}
            label="First-generation college student"
          />
          <Checkbox
            checked={isVeteran}
            onChange={onVeteranChange}
            label="Military veteran or dependent"
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Note: Veteran and first-generation status may qualify you for additional aid. This calculator does not include program-specific scholarships or benefits.
        </p>
      </Fieldset>
    </div>
  )
}

function StepThree({
  incomeMidpoint,
  siblings,
  onIncomeChange,
  onSiblingsChange,
}: {
  incomeMidpoint: number | null
  siblings: number
  onIncomeChange: (m: number) => void
  onSiblingsChange: (n: number) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-navy mb-1">Family finances</h2>
        <p className="text-sm text-gray-500 mb-4">
          We use ranges, not exact numbers. This never leaves your browser.
        </p>
      </div>

      <Fieldset label="Family annual income (before taxes)">
        <div className="grid sm:grid-cols-2 gap-2">
          {INCOME_RANGES.map(r => {
            const active = r.midpoint === incomeMidpoint
            return (
              <button
                key={r.midpoint}
                type="button"
                onClick={() => onIncomeChange(r.midpoint)}
                className={`text-left px-3 py-2.5 text-sm rounded-lg border transition-colors ${
                  active
                    ? 'border-navy bg-navy/5 text-navy'
                    : 'border-card hover:border-navy/40 text-navy/80'
                }`}
              >
                {r.label}
              </button>
            )
          })}
        </div>
      </Fieldset>

      <Fieldset label="Siblings already in college">
        <input
          type="number"
          min={0}
          max={5}
          value={siblings}
          onChange={e => onSiblingsChange(Math.max(0, Math.min(5, Number(e.target.value) || 0)))}
          className="w-24 border border-card rounded-lg px-3 py-2 text-sm focus:border-navy/60 outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">More siblings in college often increases aid.</p>
      </Fieldset>
    </div>
  )
}

function StepFour({
  college,
  residency,
  housing,
  isVeteran,
  isFirstGen,
  incomeLabel,
  siblings,
}: {
  college: CollegeOption
  residency: Residency
  housing: Housing
  isVeteran: boolean
  isFirstGen: boolean
  incomeLabel: string
  siblings: number
}) {
  const housingLabels: Record<Housing, string> = {
    'on-campus': 'On-campus',
    'off-campus': 'Off-campus',
    commuter: 'Commuter (living at home)',
  }
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-navy mb-1">Review your answers</h2>
      <p className="text-sm text-gray-500 mb-4">
        These drive the estimate below. Go back to change anything.
      </p>

      <div className="divide-y divide-card border border-card rounded-lg">
        <SummaryRow label="College" value={college.name} />
        <SummaryRow label="Residency" value={residency === 'in-state' ? 'In-state' : 'Out-of-state'} />
        <SummaryRow label="Housing" value={housingLabels[housing]} />
        <SummaryRow label="Family income" value={incomeLabel || '—'} />
        <SummaryRow label="Siblings in college" value={String(siblings)} />
        {isFirstGen && <SummaryRow label="First-generation" value="Yes" />}
        {isVeteran && <SummaryRow label="Veteran / dependent" value="Yes" />}
      </div>

      <div className="mt-5 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-navy/90">
        <strong>Heads up:</strong> The number you are about to see is an estimate based on public cost data and rough income brackets — not a financial aid offer. Always verify with each college&apos;s official Net Price Calculator and financial aid office.
      </div>
    </div>
  )
}

function Fieldset({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-2">{label}</div>
      {children}
    </div>
  )
}

function RadioGroup({
  name,
  value,
  onChange,
  options,
}: {
  name: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
              active
                ? 'border-navy bg-navy/5 text-navy font-medium'
                : 'border-card hover:border-navy/40 text-navy/80'
            }`}
            aria-pressed={active}
            name={name}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-navy/90 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-card accent-navy"
      />
      {label}
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-navy text-right">{value}</span>
    </div>
  )
}
