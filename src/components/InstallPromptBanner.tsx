'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const EXCLUDED_PATHS = [
  '/fafsa',
  '/financial-aid',
  '/appeal-letter',
  '/state-aid',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InstallPromptBanner() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (EXCLUDED_PATHS.some(p => pathname?.startsWith(p))) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    const showTimer = setTimeout(() => setShow(true), 10000)
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
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 50,
      background: 'linear-gradient(135deg, #0F2044 0%, #1a3366 100%)',
      borderTop: '2px solid #D4AF37',
      padding: '12px 16px',
      boxSizing: 'border-box' as const,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        maxWidth: '672px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <img
          src="/icons/icon-192x192.png"
          alt="KidToCollege"
          style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
            Add KidToCollege to your home screen
          </p>
          <p style={{ color: '#93c5fd', fontSize: '12px', margin: '2px 0 0', lineHeight: 1.3 }}>
            {isIOS ? 'Tap Share \u2192 "Add to Home Screen"' : 'Free \u2014 no App Store needed'}
          </p>
        </div>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            style={{
              flexShrink: 0,
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '999px',
              background: '#D4AF37',
              color: '#0F2044',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Install
          </button>
        )}
        <button
          onClick={() => setShow(false)}
          style={{
            flexShrink: 0,
            color: '#93c5fd',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0 4px',
          }}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
