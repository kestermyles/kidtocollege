/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useMyColleges } from '@/hooks/useMyColleges'
import CollegeListCard from './CollegeListCard'
import FilterSortBar from './FilterSortBar'
import AddCollegeSearch from './AddCollegeSearch'

export default function CollegeListBoard({ initialItems }: {
  initialItems: any[]
}) {
  const { items, sortMode, setSortMode, handleDragEnd, handleRemove, handleStatusChange } = useMyColleges(initialItems)
  const isDragDisabled = sortMode !== 'custom'

  return (
    <div>
      <AddCollegeSearch currentCount={items.length} />

      {items.length >= 15 && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          Counselors recommend applying to 10-12 colleges. You have {items.length}.
        </div>
      )}

      <FilterSortBar sortMode={sortMode} onSortChange={setSortMode} />

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Your list is empty</p>
          <p className="text-sm mt-1">Search for colleges above to get started</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">
            {items.length} of 20 colleges
            {isDragDisabled && ' · drag disabled while sorted'}
          </p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="college-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <CollegeListCard
                            item={item}
                            index={index}
                            isDragging={snapshot.isDragging}
                            isDragDisabled={isDragDisabled}
                            onRemove={() => handleRemove(item.id)}
                            onStatusChange={(status: string) => handleStatusChange(item.id, status)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
    </div>
  )
}
