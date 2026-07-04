// ============================================================
// MERGEMIND DESIGN SYSTEM — Master Tokens
// Every component, every page uses these exact values.
// ============================================================

// ─── COLORS ───────────────────────────────────────────────
export const colors = {
  // Core
  bg:           "#09090b",     // Page background
  surface:      "#18181b",     // Card backgrounds
  elevated:     "#27272a",     // Hover states, elevated elements
  border:       "#27272a",     // All borders
  
  // Text
  textPrimary:  "#ffffff",     // Headings, important text
  textSecondary:"#a1a1aa",     // Body text (zinc-400)
  textMuted:    "#71717a",     // Captions, secondary info (zinc-500)
  textDisabled: "#52525b",     // Disabled text (zinc-600)
  
  // Brand
  brand:        "#a855f7",     // Purple-500 — Primary accent
  brandLight:   "#c084fc",     // Purple-400 — Light accent
  brandBg:      "rgba(168,85,247,0.1)",   // 10% opacity bg
  brandBorder:  "rgba(168,85,247,0.2)",   // 20% opacity border
  
  // Semantic
  success:      "#4ade80",     // Green-400
  successBg:    "rgba(74,222,128,0.1)",
  warning:      "#fbbf24",     // Yellow-400
  warningBg:    "rgba(251,191,36,0.1)",
  error:        "#f87171",     // Red-400
  errorBg:      "rgba(248,113,113,0.1)",
  info:         "#60a5fa",     // Blue-400
  infoBg:       "rgba(96,165,250,0.1)",
}

// ─── TYPOGRAPHY ───────────────────────────────────────────
export const type = {
  hero:         "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06]",
  pageTitle:    "text-3xl font-bold tracking-tight",
  sectionTitle: "text-xl font-bold tracking-tight",
  cardTitle:    "text-base font-semibold",
  bodyLarge:    "text-lg leading-relaxed",
  body:         "text-base leading-relaxed",
  bodySmall:    "text-sm leading-relaxed",
  caption:      "text-xs text-zinc-500",
  mono:         "font-mono text-sm",
  label:        "text-xs font-medium uppercase tracking-wider",
}

// ─── SPACING (8px grid) ───────────────────────────────────
export const space = {
  xs: "gap-1 p-1",       // 4px
  sm: "gap-2 p-2",       // 8px
  md: "gap-3 p-3",       // 12px
  lg: "gap-4 p-4",       // 16px
  xl: "gap-6 p-6",       // 24px
  "2xl":"gap-8 p-8",     // 32px
  "3xl":"gap-10 p-10",   // 40px
  
  section: "py-20 sm:py-28",     // Page sections
  page: "py-8 sm:py-10",         // Page padding
  container: "px-4 sm:px-8",     // Container padding
}

// ─── BORDER RADIUS ────────────────────────────────────────
export const radius = {
  none:   "rounded-none",
  sm:     "rounded-lg",        // 8px  — Small elements
  md:     "rounded-[14px]",    // 14px — Buttons, inputs
  lg:     "rounded-[20px]",    // 20px — Cards
  xl:     "rounded-[24px]",    // 24px — Large cards, modals
  full:   "rounded-full",      // 999px — Badges, pills
}

// ─── SHADOWS ──────────────────────────────────────────────
export const shadow = {
  none:   "shadow-none",
  sm:     "shadow-sm shadow-black/10",
  md:     "shadow-lg shadow-black/20",
  lg:     "shadow-xl shadow-black/30",
  button: "shadow-sm shadow-white/5",
  glow:   "shadow-lg shadow-purple-500/10",
}

// ─── TRANSITIONS ──────────────────────────────────────────
export const transition = {
  fast:   "transition-all duration-150 ease-out",
  base:   "transition-all duration-200 ease-out",
  slow:   "transition-all duration-300 ease-out",
}

// ─── INTERACTIVE STATES ───────────────────────────────────
export const interactive = {
  hover:    "hover:border-zinc-600 hover:bg-white/[0.01]",
  active:   "active:scale-[0.98]",
  focus:    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
  disabled: "opacity-50 cursor-not-allowed",
}

// ─── ANIMATIONS ───────────────────────────────────────────
export const animation = {
  fadeIn:      "animate-[fadeIn_0.4s_ease-out_forwards]",
  fadeInUp:    "animate-[fadeInUp_0.5s_ease-out_forwards]",
  scaleIn:     "animate-[scaleIn_0.3s_ease-out_forwards]",
  stagger:     "stagger-children",
  cardHover:   "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
  countUp:     "animate-[countUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
}