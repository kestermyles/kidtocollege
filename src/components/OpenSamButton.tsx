"use client"

export default function OpenSamButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-sam"))}
      className="inline-block bg-gold hover:bg-gold/90 text-navy font-body font-medium px-6 py-3 rounded-md transition-colors text-sm"
    >
      Ask Sam your own question &rarr;
    </button>
  )
}
