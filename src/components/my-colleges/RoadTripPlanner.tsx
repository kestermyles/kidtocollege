/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, MapPin, Copy, ExternalLink, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { buildGoogleMapsUrl, fetchEmbedUrl } from '@/lib/road-trip'

interface Stop {
  id: string
  name: string
  location: string
}

export default function RoadTripPlanner({
  colleges,
  defaultOrigin,
  onClose,
}: {
  colleges: Stop[]
  defaultOrigin: string
  onClose: () => void
}) {
  const [origin, setOrigin] = useState(defaultOrigin)
  const [stops, setStops] = useState<Stop[]>(colleges)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  const stopLocations = stops.map(s => `${s.name}, ${s.location}`)

  const loadMap = useCallback(async () => {
    if (!origin.trim() || stops.length === 0) {
      setEmbedUrl(null)
      return
    }
    setLoading(true)
    setError(null)
    const { url, error: err } = await fetchEmbedUrl(origin, stopLocations)
    setEmbedUrl(url)
    setError(err)
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, JSON.stringify(stopLocations)])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(loadMap, 1000)
    return () => clearTimeout(debounceRef.current)
  }, [loadMap])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const reordered = Array.from(stops)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setStops(reordered)
  }

  const removeStop = (id: string) => {
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const googleMapsUrl = buildGoogleMapsUrl(origin, stopLocations)

  const handleCopy = () => {
    navigator.clipboard.writeText(googleMapsUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-display text-xl font-bold text-navy">
            Campus Visit Road Trip
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
          {/* Left panel */}
          <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto p-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Starting location
            </label>
            <div className="relative mb-4">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                placeholder="Your city or zip code"
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <label className="block text-xs font-medium text-gray-500 mb-2">
              Stops ({stops.length})
            </label>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="trip-stops">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1.5 mb-4">
                    {stops.map((stop, index) => (
                      <Draggable key={stop.id} draggableId={stop.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm ${
                              snapshot.isDragging ? 'shadow-lg ring-2 ring-yellow-400' : ''
                            }`}
                          >
                            <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                            <span className="text-xs font-bold text-gray-300 w-4">{index + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-800 truncate">{stop.name}</div>
                              <div className="text-xs text-gray-400 truncate">{stop.location}</div>
                            </div>
                            <button
                              onClick={() => removeStop(stop.id)}
                              className="text-gray-300 hover:text-red-400 flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {stops.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No stops — add colleges to your list first
              </p>
            )}

            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors"
              >
                <ExternalLink size={14} />
                Open in Google Maps
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy size={14} />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* Right panel — map */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
                <p className="text-sm text-gray-400">Loading route...</p>
              </div>
            ) : error ? (
              <div className="text-center px-6">
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Campus visit route"
              />
            ) : (
              <div className="text-center px-6">
                <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">
                  Enter a starting location to see your route
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
