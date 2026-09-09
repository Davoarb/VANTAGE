import React from 'react'

/**
 * Volcanic Glass - Aura (VANTAGE Edition)
 * Palette: Deep Red, Pure White, Obsidian Black
 */
export const BackgroundAura = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#100e0b] pointer-events-none" aria-hidden="true">
      {/* Layer 1 - Vibrant Red (Screen) */}
      <div
        className="absolute inset-0 mix-blend-screen blur-[175px] md:blur-[252px] will-change-transform"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(220, 38, 38, 0.5) 0%, transparent 45%)'
        }}
      />

      {/* Layer 2 - Pure White Highlight (Screen) */}
      <div
        className="absolute inset-0 mix-blend-screen blur-[200px] md:blur-[260px] will-change-transform opacity-40"
        style={{
          background: 'radial-gradient(circle at 70% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 40%)'
        }}
      />

      {/* Layer 3 - Deep Blood Red (Multiply) */}
      <div
        className="absolute inset-0 mix-blend-multiply blur-[200px] md:blur-[260px] will-change-transform"
        style={{
          background: 'radial-gradient(circle at 50% 70%, rgba(153, 27, 27, 0.6) 0%, transparent 50%)'
        }}
      />

      {/* Layer 4 - Subtle Silver (Overlay) */}
      <div
        className="absolute inset-0 mix-blend-overlay blur-[138px] md:blur-[198px] will-change-transform opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 35%)'
        }}
      />
    </div>
  )
}