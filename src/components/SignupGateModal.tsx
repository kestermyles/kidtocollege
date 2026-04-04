"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

interface Props {
  collegeName: string
  onClose: () => void
  onSuccess: () => void
}

export default function SignupGateModal({ collegeName, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"signup" | "login">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError("")

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    if (mode === "signup") {
      fetch("/api/welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: result.data.user?.email }),
      }).catch(() => {})
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl mb-4">🎓</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Save {collegeName} to your list
          </h2>
          <p className="text-sm text-gray-500">
            Create a free account to save colleges, track your chances, and build your personalised admissions playbook.
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl mb-3 transition-colors text-sm"
        >
          {loading ? "Just a moment\u2026" : mode === "signup" ? "Create free account \u2192" : "Sign in \u2192"}
        </button>

        <button
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create a free account"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Free to use. No credit card needed.
        </p>
      </div>
    </div>
  )
}
