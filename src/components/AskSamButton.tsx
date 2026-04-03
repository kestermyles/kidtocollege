"use client"

export function AskSamButton() {
  return (
    <button
      onClick={() => {
        const samBtn = document.querySelector('[aria-label="Chat with Sam"]') as HTMLButtonElement
        if (samBtn) samBtn.click()
      }}
      className="flex items-center gap-2 text-white/90 hover:text-white border border-white/30 hover:border-white/60 px-5 py-3 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
    >
      <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold" style={{ color: "#0f2d52" }}>S</span>
      Ask Sam a question
    </button>
  )
}
