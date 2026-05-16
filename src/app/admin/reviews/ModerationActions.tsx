"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ModerationActions({
  reviewId,
  currentStatus,
}: {
  reviewId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "rejected" | "spam") {
    setLoading(decision);
    setError(null);
    try {
      const res = await fetch("/api/reviews/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status: decision }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed");
      }
      setStatus(decision);
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => decide("approved")}
        disabled={loading !== null || status === "approved"}
        className="px-3 py-1.5 text-xs font-body bg-sage text-white rounded hover:bg-sage/90 disabled:opacity-40"
      >
        {loading === "approved" ? "..." : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => decide("rejected")}
        disabled={loading !== null || status === "rejected"}
        className="px-3 py-1.5 text-xs font-body bg-white text-crimson border border-crimson rounded hover:bg-crimson/5 disabled:opacity-40"
      >
        {loading === "rejected" ? "..." : "Reject"}
      </button>
      <button
        type="button"
        onClick={() => decide("spam")}
        disabled={loading !== null || status === "spam"}
        className="px-3 py-1.5 text-xs font-body bg-navy text-white rounded hover:bg-navy/90 disabled:opacity-40"
      >
        {loading === "spam" ? "..." : "Spam"}
      </button>
      <span className="font-body text-xs text-navy/40 ml-2">
        Current: {status}
      </span>
      {error && (
        <span className="font-body text-xs text-crimson ml-2">{error}</span>
      )}
    </div>
  );
}
