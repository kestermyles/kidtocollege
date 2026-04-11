'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const EXCLUDED_PATHS = [
  '/fafsa',
  '/financial-aid',
  '/appeal-letter',
  '/state-aid',
]

export default function InstallPromptBanner() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Don't show on excluded paths
    if (EXCLUDED_PATHS.some(p => pathname?.startsWith(p))) return

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    // Android: capture the install prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Show banner after 10 seconds
    const showTimer = setTimeout(() => setShow(true), 10000)

    // Auto-hide after 18 seconds (10 + 8)
    const hideTimer = setTimeout(() => setShow(false), 18000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [pathname])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setShow(false)
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500"
      style={{
        background: 'linear-gradient(135deg, #0F2044 0%, #1a3366 100%)',
        borderTop: '2px solid #D4AF37',
        padding: '12px 16px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden">
          <img src="/icons/icon-192x192.png" alt="KidToCollege" className="w-full h-full" />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">
            Add KidToCollege to your home screen
          </p>
          <p className="text-blue-200 text-xs mt-0.5 leading-tight">
            {isIOS
              ? 'Tap the Share button \u2192 "Add to Home Screen"'
              : 'Tap below to install \u2014 free, no App Store needed'}
          </p>
        </div>

        {/* CTA — Android only (iOS just needs the instructions) */}
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: '#D4AF37', color: '#0F2044' }}
          >
            Install
          </button>
        )}

        {/* Dismiss */}
        <button
          onClick={() => setShow(false)}
          className="flex-shrink-0 text-blue-300 hover:text-white text-lg leading-none ml-1"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
