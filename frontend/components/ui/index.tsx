"use client"
import { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes } from "react"
import { Loader2, AlertCircle, CheckCircle, X } from "lucide-react"

// ========================================
// BUTTONS
// ========================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className = "", ...props }, ref) => {
    
    const variants = {
      primary: "bg-white hover:bg-zinc-200 text-zinc-900 font-medium shadow-sm",
      secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
      ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/50",
      danger: "bg-red-600 hover:bg-red-500 text-white",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
      md: "px-4 py-2 text-sm rounded-lg gap-2",
      lg: "px-6 py-3 text-sm rounded-xl gap-2.5",
    }

    return (
      <button
        ref={ref}
        disabled={loading || props.disabled}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// ========================================
// INPUT
// ========================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className = "", ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`w-full bg-zinc-900 border text-white placeholder-zinc-500 text-sm rounded-lg transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40
          ${icon ? "pl-10 pr-4 py-2.5" : "px-4 py-2.5"}
          ${error ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
)
Input.displayName = "Input"

// ========================================
// BADGE
// ========================================

interface BadgeProps {
  children: React.ReactNode
  variant?: "purple" | "blue" | "green" | "yellow" | "red" | "neutral"
  size?: "sm" | "md"
}

const badgeVariants = {
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  neutral: "bg-zinc-800 text-zinc-400 border-zinc-700",
}

export function Badge({ children, variant = "neutral", size = "sm" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${badgeVariants[variant]} ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
      {children}
    </span>
  )
}

// ========================================
// CARD
// ========================================

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: "sm" | "md" | "lg"
}

export function Card({ children, className = "", hover = false, padding = "md" }: CardProps) {
  const paddings = { sm: "p-3", md: "p-5", lg: "p-6" }
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl ${paddings[padding]} ${hover ? "hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-150" : ""} ${className}`}>
      {children}
    </div>
  )
}

// ========================================
// ALERT
// ========================================

interface AlertProps {
  children: React.ReactNode
  variant?: "info" | "success" | "warning" | "error"
  onClose?: () => void
}

const alertVariants = {
  info: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  success: "bg-green-500/10 border-green-500/20 text-green-400",
  warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  error: "bg-red-500/10 border-red-500/20 text-red-400",
}

const alertIcons = {
  info: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

export function Alert({ children, variant = "info", onClose }: AlertProps) {
  const Icon = alertIcons[variant]
  return (
    <div className={`flex items-start gap-3 border rounded-xl p-4 ${alertVariants[variant]}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-50 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ========================================
// SKELETON
// ========================================

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-zinc-800 rounded-lg ${className}`} />
}

// ========================================
// SECTION HEADER
// ========================================

interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  )
}