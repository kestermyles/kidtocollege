import type { AIResearchResult } from "./types";

interface CachedResult {
  result: AIResearchResult;
  college: string;
  major: string;
  createdAt: number;
}

// In-memory cache for results when Supabase is not available.
// This is ephemeral — results are lost on server restart.
const cache = new Map<string, CachedResult>();

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function cacheResult(
  id: string,
  result: AIResearchResult,
  college: string,
  major: string
) {
  cache.set(id, { result, college, major, createdAt: Date.now() });
}

export function getCachedResult(id: string): CachedResult | null {
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(id);
    return null;
  }
  return entry;
}
