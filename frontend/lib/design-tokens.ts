// ========================================
// MergeMind Design System Tokens
// ========================================

// Colors
export const colors = {
  bg: {
    primary: "#09090b",    // zinc-950 - Main background
    secondary: "#18181b",  // zinc-900 - Card surfaces
    tertiary: "#27272a",   // zinc-800 - Hover states
  },
  border: {
    default: "border-zinc-800",
    subtle: "border-zinc-800/50",
    accent: "border-purple-500/20",
  },
  text: {
    primary: "text-white",
    secondary: "text-zinc-300",
    muted: "text-zinc-400",
    subtle: "text-zinc-500",
    disabled: "text-zinc-600",
  },
  accent: {
    purple: "text-purple-400",
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  },
  badge: {
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  }
}

// Border Radius
export const radius = {
  sm: "rounded-lg",     // 8px - Buttons, inputs
  md: "rounded-xl",     // 12px - Cards
  lg: "rounded-2xl",    // 16px - Large cards
  full: "rounded-full", // Pills, badges
}

// Shadows
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-lg",
  lg: "shadow-xl",
  glow: "shadow-lg shadow-purple-500/10",
}

// Typography
export const type = {
  h1: "text-2xl font-bold tracking-tight",
  h2: "text-xl font-bold tracking-tight",
  h3: "text-lg font-semibold tracking-tight",
  h4: "text-sm font-semibold",
  body: "text-sm leading-relaxed",
  small: "text-xs leading-relaxed",
  caption: "text-[10px]",
  mono: "font-mono text-xs",
}

// Icon Sizes
export const icons = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
}

// Spacing Scale (in rem)
export const space = {
  1: "gap-1 p-1",
  2: "gap-2 p-2",
  3: "gap-3 p-3",
  4: "gap-4 p-4",
  5: "gap-5 p-5",
  6: "gap-6 p-6",
  8: "gap-8 p-8",
}

// Transitions
export const transition = {
  fast: "transition-all duration-150",
  normal: "transition-all duration-200",
  slow: "transition-all duration-300",
}

// Interactive states
export const interactive = {
  hover: "hover:bg-zinc-800/50 hover:text-white",
  focus: "focus:outline-none focus:ring-2 focus:ring-purple-500/40",
  active: "active:scale-[0.98]",
}