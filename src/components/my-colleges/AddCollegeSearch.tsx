'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Plus } from 'lucide-react'
import { addCollegeToList } from '@/lib/my-colleges'
import { createClient } from '@/lib/supabase-browser'

export default function AddCollegeSearch({ userId, currentCount }: {
  userId: string
  currentCount: number
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('colleges')
          .select('id, name, slug, city, state')
          .ilike('name', `%${query}%`)
          .order('name')
          .limit(6)
        setResults(data ?? [])
      } catch {}
      setLoading(false)
    }, 300)
  }, [query])

  const handleAdd = async (college: any) => {
    if (currentCount >= 20) return
    setAdding(college.id)
    try {
      await addCollegeToList(userId, college.id)
      setQuery('')
      setResults([])
    } catch {}
    setAdding(null)
  }

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={currentCount >= 20 ? 'List full (20 max)' : 'Search colleges to add...'}
          disabled={currentCount >= 20}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-50 disabled:text-gray-400"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((college: any) => (
            <button
              key={college.id}
              onClick={() => handleAdd(college)}
              disabled={!!adding}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">{college.name}</div>
                <div className="text-xs text-gray-500">{college.city}, {college.state}</div>
              </div>
              <Plus size={16} className="text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
