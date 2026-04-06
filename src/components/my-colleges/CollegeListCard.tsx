'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GripVertical, X, MapPin, DollarSign } from 'lucide-react'

const STATUS_OPTIONS = ['exploring','applying','applied','accepted','deferred','waitlisted','rejected']

const STATUS_COLORS: Record<string, string> = {
  exploring:  'bg-gray-100 text-gray-600',
  applying:   'bg-blue-100 text-blue-700',
  applied:    'bg-purple-100 text-purple-700',
  accepted:   'bg-green-100 text-green-700',
  deferred:   'bg-yellow-100 text-yellow-700',
  waitlisted: 'bg-orange-100 text-orange-700',
  rejected:   'bg-red-100 text-red-600',
}

const TIER_COLORS: Record<string, string> = {
  Safety:    'bg-green-50 border-green-200',
  'On Target': 'bg-blue-50 border-blue-200',
  Reach:     'bg-amber-50 border-amber-200',
}

const TIER_BADGE: Record<string, string> = {
  Safety:      'bg-green-100 text-green-700',
  'On Target': 'bg-blue-100 text-blue-700',
  Reach:       'bg-amber-100 text-amber-700',
}

function getTier(college: any, userProfile: any) {
  if (!userProfile?.sat_total || !college.sat_reading_75 || !college.sat_math_75) return null
  const collegeSAT = college.sat_reading_75 + college.sat_math_75
  const userSAT = userProfile.sat_total
  const diff = collegeSAT - userSAT
  if (diff > 150) return 'Reach'
  if (diff < -150) return 'Safety'
  return 'On Target'
}

export default function CollegeListCard({ item, index, isDragging, isDragDisabled, userProfile, onRemove, onStatusChange }: any) {
  const college = item.colleges
  const tier = getTier(college, userProfile)

  return (
    <div className={`
      flex items-center gap-3 p-4 bg-white rounded-xl border-2 transition-all duration-150
      ${isDragging ? 'shadow-xl rotate-1' : 'shadow-sm'}
      ${tier ? TIER_COLORS[tier] : 'border-gray-100'}
    `}>
      {!isDragDisabled && (
        <GripVertical className="text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" size={20} />
      )}

      <span className="text-sm font-bold text-gray-300 w-5 text-center flex-shrink-0">
        {index + 1}
      </span>

      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {college.photo_url
          ? <Image src={college.photo_url} alt={college.name} width={40} height={40} className="object-cover w-full h-full" />
          : <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-300" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/college/${college.slug}`} className="font-semibold text-sm text-gray-900 hover:text-yellow-600 truncate block">
          {college.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
          <span className="flex items-center gap-0.5">
            <MapPin size={10} /> {college.city}, {college.state}
          </span>
          {college.avg_net_price && (
            <span className="flex items-center gap-0.5">
              <DollarSign size={10} />{college.avg_net_price.toLocaleString()}/yr net
            </span>
          )}
          {tier && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${TIER_BADGE[tier]}`}>
              {tier}
            </span>
          )}
        </div>
      </div>

      <select
        value={item.status}
        onChange={e => onStatusChange(e.target.value)}
        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer flex-shrink-0 ${STATUS_COLORS[item.status]}`}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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
