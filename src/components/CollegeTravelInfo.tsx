"use client"

import { useEffect, useState } from "react"

const STATE_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  "Alabama": { lat: 32.8, lng: -86.8, name: "Alabama" },
  "Alaska": { lat: 64.2, lng: -153.4, name: "Alaska" },
  "Arizona": { lat: 34.0, lng: -111.1, name: "Arizona" },
  "Arkansas": { lat: 34.8, lng: -92.2, name: "Arkansas" },
  "California": { lat: 36.8, lng: -119.4, name: "California" },
  "Colorado": { lat: 39.0, lng: -105.5, name: "Colorado" },
  "Connecticut": { lat: 41.6, lng: -72.7, name: "Connecticut" },
  "Delaware": { lat: 39.0, lng: -75.5, name: "Delaware" },
  "Florida": { lat: 27.8, lng: -81.5, name: "Florida" },
  "Georgia": { lat: 32.2, lng: -83.4, name: "Georgia" },
  "Hawaii": { lat: 19.9, lng: -155.6, name: "Hawaii" },
  "Idaho": { lat: 44.4, lng: -114.5, name: "Idaho" },
  "Illinois": { lat: 40.0, lng: -89.2, name: "Illinois" },
  "Indiana": { lat: 39.9, lng: -86.3, name: "Indiana" },
  "Iowa": { lat: 42.0, lng: -93.2, name: "Iowa" },
  "Kansas": { lat: 38.5, lng: -98.4, name: "Kansas" },
  "Kentucky": { lat: 37.7, lng: -84.9, name: "Kentucky" },
  "Louisiana": { lat: 31.2, lng: -91.8, name: "Louisiana" },
  "Maine": { lat: 45.4, lng: -69.0, name: "Maine" },
  "Maryland": { lat: 39.1, lng: -76.8, name: "Maryland" },
  "Massachusetts": { lat: 42.2, lng: -71.5, name: "Massachusetts" },
  "Michigan": { lat: 43.3, lng: -84.5, name: "Michigan" },
  "Minnesota": { lat: 46.4, lng: -93.1, name: "Minnesota" },
  "Mississippi": { lat: 32.6, lng: -89.7, name: "Mississippi" },
  "Missouri": { lat: 38.5, lng: -92.3, name: "Missouri" },
  "Montana": { lat: 47.1, lng: -110.4, name: "Montana" },
  "Nebraska": { lat: 41.5, lng: -99.9, name: "Nebraska" },
  "Nevada": { lat: 39.3, lng: -116.6, name: "Nevada" },
  "New Hampshire": { lat: 43.5, lng: -71.6, name: "New Hampshire" },
  "New Jersey": { lat: 40.1, lng: -74.5, name: "New Jersey" },
  "New Mexico": { lat: 34.8, lng: -106.2, name: "New Mexico" },
  "New York": { lat: 42.2, lng: -74.9, name: "New York" },
  "North Carolina": { lat: 35.6, lng: -79.8, name: "North Carolina" },
  "North Dakota": { lat: 47.5, lng: -100.3, name: "North Dakota" },
  "Ohio": { lat: 40.4, lng: -82.8, name: "Ohio" },
  "Oklahoma": { lat: 35.6, lng: -96.9, name: "Oklahoma" },
  "Oregon": { lat: 44.1, lng: -120.5, name: "Oregon" },
  "Pennsylvania": { lat: 40.6, lng: -77.2, name: "Pennsylvania" },
  "Rhode Island": { lat: 41.7, lng: -71.5, name: "Rhode Island" },
  "South Carolina": { lat: 33.9, lng: -80.9, name: "South Carolina" },
  "South Dakota": { lat: 44.4, lng: -100.2, name: "South Dakota" },
  "Tennessee": { lat: 35.9, lng: -86.4, name: "Tennessee" },
  "Texas": { lat: 31.5, lng: -99.3, name: "Texas" },
  "Utah": { lat: 39.4, lng: -111.1, name: "Utah" },
  "Vermont": { lat: 44.1, lng: -72.7, name: "Vermont" },
  "Virginia": { lat: 37.8, lng: -78.2, name: "Virginia" },
  "Washington": { lat: 47.4, lng: -121.5, name: "Washington" },
  "West Virginia": { lat: 38.9, lng: -80.5, name: "West Virginia" },
  "Wisconsin": { lat: 44.3, lng: -89.6, name: "Wisconsin" },
  "Wyoming": { lat: 43.0, lng: -107.6, name: "Wyoming" },
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8 // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function getFlightEstimate(miles: number) {
  if (miles < 300) return null // driveable
  const base = 180
  const perMile = 0.08
  const est = Math.round((base + miles * perMile) / 10) * 10
  return `~$${est}–$${est + 100}`
}

function getDriveTime(miles: number) {
  if (miles > 600) return null
  const hours = miles / 55
  if (hours < 1) return "Under 1 hour"
  if (hours < 1.5) return "About 1 hour"
  return `${Math.round(hours)} hours`
}

interface Props {
  collegeLat?: number
  collegeLng?: number
  collegeState?: string
}

export default function CollegeTravelInfo({ collegeLat, collegeLng, collegeState }: Props) {
  const [userState, setUserState] = useState<string>("")
  const [distance, setDistance] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("ktc_home_state")
    if (saved) setUserState(saved)
  }, [])

  useEffect(() => {
    if (!userState || !collegeLat || !collegeLng) return
    const home = STATE_COORDS[userState]
    if (!home) return
    const d = Math.round(haversineDistance(home.lat, home.lng, collegeLat, collegeLng))
    setDistance(d)
  }, [userState, collegeLat, collegeLng])

  const handleStateChange = (state: string) => {
    setUserState(state)
    localStorage.setItem("ktc_home_state", state)
  }

  const sameState = collegeState === userState
  const driveTime = distance ? getDriveTime(distance) : null
  const flightEst = distance ? getFlightEstimate(distance) : null

  return (
    <section className="bg-gray-50 py-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl font-bold text-navy mb-4">Getting there</h2>
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-sm text-gray-600">From:</span>
          <select
            value={userState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select your state</option>
            {Object.keys(STATE_COORDS).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {distance !== null && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="emoji text-xl mb-1" role="img" aria-label="Location">📍</div>
              <div className="text-xs text-gray-500 mb-1">Distance</div>
              <div className="text-sm font-bold text-gray-900">{distance.toLocaleString()} miles</div>
            </div>
            {sameState && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                <div className="emoji text-xl mb-1" role="img" aria-label="In-state">🏠</div>
                <div className="text-xs text-gray-500 mb-1">In-state tuition</div>
                <div className="text-sm font-bold text-green-700">You qualify</div>
              </div>
            )}
            {driveTime && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="emoji text-xl mb-1" role="img" aria-label="Drive">🚗</div>
                <div className="text-xs text-gray-500 mb-1">Drive time</div>
                <div className="text-sm font-bold text-gray-900">{driveTime}</div>
              </div>
            )}
            {flightEst && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="emoji text-xl mb-1" role="img" aria-label="Flight">✈️</div>
                <div className="text-xs text-gray-500 mb-1">Est. flight cost</div>
                <div className="text-sm font-bold text-gray-900">{flightEst} each way</div>
              </div>
            )}
            {!driveTime && !flightEst && distance > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="emoji text-xl mb-1" role="img" aria-label="Flight">✈️</div>
                <div className="text-xs text-gray-500 mb-1">Travel</div>
                <div className="text-sm font-bold text-gray-900">Flight recommended</div>
              </div>
            )}
          </div>
        )}

        {!userState && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <span className="emoji" role="img" aria-label="Pin">📍</span> Select your home state above to see how far away this college is, drive time, and estimated flight costs.
          </div>
        )}
      </div>
    </section>
  )
}
