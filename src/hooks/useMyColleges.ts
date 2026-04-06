/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useCallback, useMemo } from 'react'
import { removeCollegeFromList, updateCollegeStatus } from '@/lib/my-colleges'

export type SortMode = 'custom' | 'affordability' | 'scholarships'

export function useMyColleges(initialItems: any[], userId: string) {
  const [items, setItems] = useState(initialItems)
  const [sortMode, setSortMode] = useState<SortMode>('custom')

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return
    const reordered = Array.from(items)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setItems(reordered)
  }, [items])

  const handleRemove = useCallback(async (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
    await removeCollegeFromList(userId, itemId)
  }, [userId])

  const handleStatusChange = useCallback(async (itemId: string, status: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, application_status: status } : i))
    await updateCollegeStatus(userId, itemId, status)
  }, [userId])

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
