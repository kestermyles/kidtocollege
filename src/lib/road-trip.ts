export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 3959 // miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function estimateDriveTime(miles: number): string {
  const hours = miles / 50 // rough average including stops
  if (hours < 1) return `${Math.round(hours * 60)} min`
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function buildGoogleMapsUrl(
  origin: string,
  stops: string[]
): string {
  const base = 'https://www.google.com/maps/dir/'
  const parts = [origin, ...stops].map(s => encodeURIComponent(s))
  return base + parts.join('/')
}

export async function fetchEmbedUrl(
  origin: string,
  stops: string[]
): Promise<{ url: string | null; error: string | null }> {
  try {
    const res = await fetch('/api/maps-embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, stops }),
    })
    if (res.status === 429) {
      return { url: null, error: 'Daily limit reached. Try again tomorrow.' }
    }
    if (!res.ok) {
      const data = await res.json()
      return { url: null, error: data.error || 'Failed to load map' }
    }
    const data = await res.json()
    return { url: data.url, error: null }
  } catch {
    return { url: null, error: 'Failed to load map' }
  }
}
