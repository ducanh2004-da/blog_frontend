import React from 'react'

interface LoadingProps {
  content?: string
  subtitle?: string
}

// A polished, accessible Loading component for EduSocial
// - Tailwind-first layout (works with Tailwind CSS present)
// - Small scoped styles for custom animations
// - Accessible: role="status" + aria-live
// - Friendly brand touch (EduSocial)

export default function Loading({ content = 'Đang tải...', subtitle = 'EduSocial — Mạng xã hội vì giáo dục' }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 flex items-center justify-center p-6 z-50"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm dark:bg-slate-900/60" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white dark:bg-slate-800/90 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl p-5 md:px-8 md:py-6 max-w-lg w-full">
        {/* Spinner + mark */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
            <svg viewBox="0 0 48 48" className="w-12 h-12 -ml-1">
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* subtle brand letter L */}
              <g>
                <path d="M14 30 L24 14 L34 30" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </svg>

            {/* rotating ring overlay */}
            <svg viewBox="0 0 48 48" className="absolute w-20 h-20 spin-slow pointer-events-none" aria-hidden>
              <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.25)" strokeWidth="4" fill="none" />
              <path
                d="M24 6 a18 18 0 0 1 0 36"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="85"
                strokeDashoffset="0"
              />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100">{content}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{subtitle}</p>

          {/* subtle animated dots for perceived progress */}
          <div className="mt-3 flex items-center gap-2" aria-hidden>
            <span className="dot" />
            <span className="dot delay-150" />
            <span className="dot delay-300" />
          </div>
        </div>
      </div>

      {/* Scoped styles for animation (kept tiny) */}
      <style>{`
        .spin-slow{ animation: spin-slow 1.6s linear infinite; transform-origin: 50% 50%; }
        @keyframes spin-slow{ from{ transform: rotate(0deg)} to{ transform: rotate(360deg)} }

        .dot{ display:inline-block; width:8px; height:8px; background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:9999px; opacity:0.15; transform: translateY(0); animation: dot-bounce 1s ease-in-out infinite; }
        .dot.delay-150{ animation-delay: 0.15s }
        .dot.delay-300{ animation-delay: 0.3s }
        @keyframes dot-bounce{ 0%,100%{ opacity:0.15; transform: translateY(0) } 50%{ opacity:1; transform: translateY(-6px) } }

        /* Ensure the container doesn't block pointer events for background overlays if you need clicks through */
        .backdrop-click-through{ pointer-events: none }
      `}</style>
    </div>
  )
}
