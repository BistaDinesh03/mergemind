"use client"

import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════
// INTERSECTION OBSERVER HOOK
// ═══════════════════════════════════════
function useInView(ref: any, threshold = 0.2) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

// ═══════════════════════════════════════
// ANIMATED COUNTER (counts up on scroll)
// ═══════════════════════════════════════
export function AnimatedCounter({ value, duration = 1500, className = "", prefix = "", suffix = "" }: {
  value: number; duration?: number; className?: string; prefix?: string; suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])

  return <span ref={ref} className={className}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ═══════════════════════════════════════
// ANIMATED PROGRESS BAR (fills on scroll)
// ═══════════════════════════════════════
export function AnimatedProgressBar({ value, color = "bg-purple-500", height = "h-2", delay = 0 }: {
  value: number; color?: string; height?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (inView) setTimeout(() => setWidth(value), 100 + delay)
  }, [inView, value, delay])

  return (
    <div ref={ref} className={`w-full ${height} bg-[#27272a] rounded-full overflow-hidden`}>
      <div className={`${height} ${color} rounded-full transition-all duration-1500 ease-out`}
        style={{ width: `${width}%`, transitionDelay: `${delay}ms` }} />
    </div>
  )
}

// ═══════════════════════════════════════
// ANIMATED SCORE RING (SVG ring gauge)
// ═══════════════════════════════════════
export function AnimatedScoreRing({ score, size = 120, strokeWidth = 8 }: {
  score: number; size?: number; strokeWidth?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    if (inView) setTimeout(() => setOffset(circumference * ((100 - score) / 100)), 200)
  }, [inView, score, circumference])

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="url(#ringGradient)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatedCounter value={score} className="text-3xl font-bold" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════
// CARD WITH LIFT
// ═══════════════════════════════════════
export function CardLift({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-lift bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 ${className}`}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════
// STAGGER CONTAINER
// ═══════════════════════════════════════
export function StaggerContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`stagger ${className}`}>{children}</div>
}