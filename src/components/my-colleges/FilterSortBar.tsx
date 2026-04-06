'use client'

import { SortMode } from '@/hooks/useMyColleges'

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'custom',        label: 'My Order' },
  { value: 'affordability',  label: 'Affordability' },
  { value: 'scholarships',  label: 'Best Aid' },
]

export default function FilterSortBar({ sortMode, onSortChange }: {
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
}) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSortChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            sortMode === opt.value
              ? 'bg-yellow-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
