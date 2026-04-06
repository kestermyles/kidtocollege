/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useMemo } from 'react'
import { reorderColleges, updateCollegeStatus, removeCollegeFromList } from '@/lib/my-colleges'

export type SortMode = 'custom' | 'suitability' | 'affordability' | 'scholarships' | 'distance' | 'deadline'

export function useMyColleges(initialItems: any[], userId: string, userProfile?: any) {
  const [items, setItems] = useState(initialItems)
  const [sortMode, setSortMode] = useState<SortMode>('custom')

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setItems(reordered)
    await reorderColleges(userId, reordered.map(i => i.id))
  }, [items, userId])

  const handleRemove = useCallback(async (collegeId: string) => {
    setItems(prev => prev.filter(i => i.college_id !== collegeId))
    await removeCollegeFromList(userId, collegeId)
  }, [userId])

  const handleStatusChange = useCallback(async (entryId: string, status: string) => {
    setItems(prev => prev.map(i => i.id === entryId ? { ...i, status } : i))
    await updateCollegeStatus(userId, entryId, status)
  }, [userId])

  const sortedItems = useMemo(() => {
    if (sortMode === 'custom') return items
    return [...items].sort((a, b) => {
      const ca = a.colleges
      const cb = b.colleges
      switch (sortMode) {
        case 'affordability':
        case 'scholarships':
          return (ca.avg_net_price ?? 99999) - (cb.avg_net_price ?? 99999)
        case 'suitability': {
          const userSAT = userProfile?.sat_total ?? 1000
          const aGap = Math.abs(((ca.sat_reading_75 ?? 600) + (ca.sat_math_75 ?? 600)) - userSAT)
          const bGap = Math.abs(((cb.sat_reading_75 ?? 600) + (cb.sat_math_75 ?? 600)) - userSAT)
          return aGap - bGap
        }
        default:
          return 0
      }
    })
  }, [items, sortMode, userProfile])

  return {
    items: sortedItems,
    sortMode,
    setSortMode,
    handleDragEnd,
    handleRemove,
    handleStatusChange
  }
}
