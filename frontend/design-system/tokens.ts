// ============================================================
// MERGEMIND — One Design Language
// Linear · Vercel · Stripe inspired
// ============================================================

export const design = {
  // ─── TYPOGRAPHY ───
  type: {
    hero:        "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]",   // 72px
    pageTitle:   "text-3xl sm:text-4xl font-bold tracking-tight leading-tight",                 // 40px
    sectionTitle:"text-2xl sm:text-3xl font-bold tracking-tight leading-tight",                 // 30px
    cardTitle:   "text-xl font-semibold tracking-tight leading-snug",                           // 22px
    body:        "text-lg leading-relaxed",                                                      // 18px
    secondary:   "text-base leading-relaxed",                                                    // 16px
    small:       "text-sm leading-relaxed",                                                      // 14px
    caption:     "text-xs leading-normal",                                                       // 12px
  },

  // ─── COLORS ───
  color: {
    bg:           "#09090b",  // zinc-950 — almost black
    surface:      "#18181b",  // zinc-900 — cards
    elevated:     "#27272a",  // zinc-800 — hover
    border:       "rgba(39,39,42,0.5)", // subtle border
    textPrimary:  "#ffffff",
    textSecondary:"#d4d4d8",  // zinc-300
    textMuted:    "#a1a1aa",  // zinc-400
    textSubtle:   "#71717a",  // zinc-500
    accent:       "#a855f7",  // purple-500 — brand
  },

  // ─── SPACING (8px grid) ───
  space: {
    pagePadding:  "px-6 sm:px-8 lg:px-10 py-16",      // 64px
    sectionGap:   "py-24",                               // 96px
    cardPadding:  "p-8",                                 // 32px
    cardGap:      "gap-6",                               // 24px
    buttonHeight: "h-[52px]",                            // 52px
    inputHeight:  "h-[52px]",                            // 52px
  },

  // ─── BORDER RADIUS ───
  radius: {
    card:   "rounded-[20px]",   // 20px
    button: "rounded-[14px]",   // 14px
    input:  "rounded-[14px]",   // 14px
    badge:  "rounded-full",     // 999px
    avatar: "rounded-full",
  },

  // ─── SHADOWS (subtle) ───
  shadow: {
    card:   "shadow-sm shadow-black/5",
    button: "shadow-sm shadow-white/5",
    hover:  "shadow-md shadow-black/10",
    glow:   "shadow-lg shadow-purple-500/5",
  },

  // ─── TRANSITIONS (identical everywhere) ───
  transition: "transition-all duration-200 ease-out",

  // ─── BORDERS (minimal) ───
  border: "border border-white/[0.06]",

  // ─── HOVER ───
  hover: "hover:border-white/[0.12] hover:bg-white/[0.02]",
}

// Tailwind class generators
export const card = `${design.border} ${design.radius.card} ${design.space.cardPadding} ${design.shadow.card} bg-[${design.color.surface}] ${design.transition} ${design.hover}`

export const button = `${design.radius.button} ${design.space.buttonHeight} inline-flex items-center justify-center font-semibold ${design.shadow.button} ${design.transition} active:scale-[0.98]`

export const input = `${design.border} ${design.radius.input} ${design.space.inputHeight} bg-[${design.color.surface}] text-white px-5 text-lg ${design.transition} focus:outline-none focus:ring-2 focus:ring-purple-500/40`