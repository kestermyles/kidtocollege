/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type SortMode = 'custom' | 'affordability' | 'scholarships'

export function useMyColleges(initialItems: any[]) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [sortMode, setSortMode] = useState<SortMode>('custom')

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setItems(reordered)
  }, [items])

  const handleRemove = useCallback(async (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
    try {
      const res = await fetch(`/api/list?itemId=${itemId}`, { method: 'DELETE' })
      if (!res.ok) console.error('Failed to remove college:', await res.json())
      else router.refresh()
    } catch (e) {
      console.error('Failed to remove college:', e)
    }
  }, [router])

  const handleStatusChange = useCallback(async (itemId: string, status: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, application_status: status } : i))
    try {
      const res = await fetch('/api/list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, applicationStatus: status }),
      })
      if (!res.ok) console.error('Failed to update status:', await res.json())
    } catch (e) {
      console.error('Failed to update status:', e)
    }
  }, [])

  const sortedItems = useMemo(() => {
    if (sortMode === 'custom') return items
    return [...items].sort((a, b) => {
      const ca = a.colleges
      const cb = b.colleges
      switch (sortMode) {
        case 'affordability':
        case 'scholarships':
          return (ca?.avg_cost_instate ?? 99999) - (cb?.avg_cost_instate ?? 99999)
        default:
          return 0
      }
    })
  }, [items, sortMode])

  return {
    items: sortedItems,
    sortMode,
    setSortMode,
    handleDragEnd,
    handleRemove,
    handleStatusChange
  }
}
