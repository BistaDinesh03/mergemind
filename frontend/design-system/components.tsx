"use client"

import React, { forwardRef } from "react"
import Link from "next/link"
import { Loader2, AlertCircle, CheckCircle, Info, X } from "lucide-react"

// ═══════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const buttonBase = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"

const buttonVariants: Record<ButtonVariant, string> = {
  primary:   "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm shadow-white/5",
  secondary: "bg-[#18181b] text-white hover:bg-[#27272a] border border-[#27272a]",
  ghost:     "text-zinc-400 hover:text-white hover:bg-[#18181b]/50",
  danger:    "bg-red-600 text-white hover:bg-red-500",
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs rounded-[14px] gap-1.5",
  md: "h-11 px-5 text-sm rounded-[14px] gap-2",
  lg: "h-[52px] px-8 text-base rounded-[14px] gap-2.5",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, leftIcon, rightIcon, children, className = "", ...props }, ref) => (
    <button ref={ref} className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children && <span className="mx-1">{children}</span>}
      {!loading && rightIcon}
    </button>
  )
)
Button.displayName = "Button"

// ═══════════════════════════════════════════════════════
// LINK BUTTON
// ═══════════════════════════════════════════════════════

interface LinkButtonProps {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
  external?: boolean
  className?: string
}

export function LinkButton({ href, variant = "primary" as ButtonVariant, size = "md" as ButtonSize, leftIcon, rightIcon, children, external, className = "" }: LinkButtonProps) {
  return (
    <Link href={href} target={external ? "_blank" : undefined}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}>
      {leftIcon}{children && <span className="mx-1">{children}</span>}{rightIcon}
    </Link>
  )
}

// ═══════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className = "", ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{leftIcon}</div>}
        <input ref={ref}
          className={`w-full h-[52px] bg-[#18181b] border border-[#27272a] text-white placeholder-zinc-500 text-base rounded-[14px] px-5
            transition-all duration-200 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40
            ${leftIcon ? "pl-12" : ""} ${error ? "border-red-500" : ""} ${className}`}
          {...props} />
      </div>
      {error && <p className="text-sm text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>{error}</p>}
      {hint && !error && <p className="text-sm text-zinc-500">{hint}</p>}
    </div>
  )
)
Input.displayName = "Input"

// ═══════════════════════════════════════════════════════
// CARD
// ═══════════════════════════════════════════════════════

interface CardProps {
  children: React.ReactNode
  variant?: "default" | "featured" | "stat"
  hover?: boolean
  padding?: "md" | "lg"
  className?: string
}

const cardVariants: Record<string, string> = {
  default: "bg-[#18181b] border border-[#27272a]",
  featured: "bg-[#18181b] border border-purple-500/20 shadow-lg shadow-purple-500/5",
  stat: "bg-[#18181b]/50 border border-[#27272a]/50",
}

const cardPadding: Record<string, string> = { md: "p-5 sm:p-6", lg: "p-6 sm:p-8" }

export function Card({ children, variant = "default", hover = false, padding = "md", className = "" }: CardProps) {
  return (
    <div className={`rounded-[20px] ${cardVariants[variant]} ${cardPadding[padding]}
      ${hover ? "hover:border-zinc-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 cursor-pointer transition-all duration-300" : ""}
      ${className}`}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════

type BadgeVariant = "purple" | "green" | "blue" | "yellow" | "red" | "neutral"

const badgeVariants: Record<BadgeVariant, string> = {
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  neutral: "bg-[#27272a] text-zinc-400 border-[#3f3f46]",
}

export function Badge({ children, variant = "neutral", className = "" }: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════════════
// ALERT / TOAST
// ═══════════════════════════════════════════════════════

type AlertVariant = "info" | "success" | "warning" | "error"

const alertVariants: Record<AlertVariant, string> = {
  info: "bg-blue-500/5 border-blue-500/20 text-blue-300",
  success: "bg-green-500/5 border-green-500/20 text-green-400",
  warning: "bg-yellow-500/5 border-yellow-500/20 text-yellow-400",
  error: "bg-red-500/5 border-red-500/20 text-red-400",
}

const alertIcons: Record<AlertVariant, any> = { info: Info, success: CheckCircle, warning: AlertCircle, error: AlertCircle }

interface AlertProps {
  children: React.ReactNode
  variant?: AlertVariant
  title?: string
  onClose?: () => void
  className?: string
}

export function Alert({ children, variant = "info", title, onClose, className = "" }: AlertProps) {
  const Icon = alertIcons[variant]
  return (
    <div className={`flex items-start gap-3 border rounded-[20px] p-5 animate-fadeInUp ${alertVariants[variant]} ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="text-base font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && <button onClick={onClose} className="opacity-50 hover:opacity-100"><X className="w-4 h-4"/></button>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#27272a]/50 rounded-[14px] ${className}`} />
}

// ═══════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════════

export function Divider() {
  return <hr className="border-[#27272a]" />
}