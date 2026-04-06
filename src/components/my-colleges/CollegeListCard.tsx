/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GripVertical, X, MapPin, DollarSign } from 'lucide-react'

const STATUS_OPTIONS = ['researching','planning_to_apply','applied','accepted','waitlisted','rejected','enrolled']

const STATUS_LABELS: Record<string, string> = {
  researching:       'Researching',
  planning_to_apply: 'Planning to Apply',
  applied:           'Applied',
  accepted:          'Accepted',
  waitlisted:        'Waitlisted',
  rejected:          'Rejected',
  enrolled:          'Enrolled',
}

const STATUS_COLORS: Record<string, string> = {
  researching:       'bg-gray-100 text-gray-600',
  planning_to_apply: 'bg-blue-100 text-blue-700',
  applied:           'bg-purple-100 text-purple-700',
  accepted:          'bg-green-100 text-green-700',
  waitlisted:        'bg-orange-100 text-orange-700',
  rejected:          'bg-red-100 text-red-600',
  enrolled:          'bg-emerald-100 text-emerald-700',
}

const CATEGORY_BADGE: Record<string, string> = {
  reach:   'bg-amber-100 text-amber-700',
  target:  'bg-blue-100 text-blue-700',
  safety:  'bg-green-100 text-green-700',
}

export default function CollegeListCard({ item, index, isDragging, isDragDisabled, onRemove, onStatusChange }: any) {
  const college = item.colleges

  return (
    <div className={`
      flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-150
      ${isDragging ? 'shadow-xl rotate-1' : 'shadow-sm'}
      border-gray-100
    `}>
      {!isDragDisabled && (
        <GripVertical className="text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" size={20} />
      )}

      <span className="text-sm font-bold text-gray-300 w-5 text-center flex-shrink-0">
        {index + 1}
      </span>

      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {college?.photo_url
          ? <Image src={college.photo_url} alt={college.name} width={40} height={40} className="object-cover w-full h-full" />
          : <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-300" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/college/${college?.slug}`} className="font-semibold text-sm text-gray-900 hover:text-yellow-600 truncate block">
          {college?.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
          <span className="flex items-center gap-0.5">
            <MapPin size={10} /> {college?.location}
          </span>
          {college?.avg_cost_instate && (
            <span className="flex items-center gap-0.5">
              <DollarSign size={10} />${college.avg_cost_instate.toLocaleString()}/yr
            </span>
          )}
          {item.category && item.category !== 'unknown' && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_BADGE[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
          )}
        </div>
      </div>

      <select
        value={item.application_status}
        onChange={e => onStatusChange(e.target.value)}
        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer flex-shrink-0 ${STATUS_COLORS[item.application_status] ?? 'bg-gray-100 text-gray-600'}`}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      <button
        onClick={onRemove}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
        aria-label="Remove"
      >
        <X size={16} />
      </button>
    </div>
  )
}
