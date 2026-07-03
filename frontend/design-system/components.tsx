"use client"

import React, { forwardRef } from "react"
import Link from "next/link"

// ─── BUTTON — 52px height, 14px radius, identical everywhere ───
type ButtonVariant = "primary" | "secondary" | "ghost"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: "md" | "lg"
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const buttonBase = "h-[52px] rounded-[14px] inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"

const variants: Record<ButtonVariant, string> = {
  primary:   "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm shadow-white/5 px-6 text-base",
  secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/[0.06] px-6 text-base",
  ghost:     "text-zinc-400 hover:text-white hover:bg-white/[0.02] px-4 text-sm",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, leftIcon, rightIcon, children, className = "", disabled, ...props }, ref) => (
    <button ref={ref} disabled={disabled || loading} className={`${buttonBase} ${variants[variant]} ${className}`} {...props}>
      {leftIcon}<span className="mx-2">{children}</span>{rightIcon}
    </button>
  )
)
Button.displayName = "Button"

// ─── LINK BUTTON ───
export function LinkButton({ href, variant = "primary", leftIcon, rightIcon, children, external, className = "" }: any) {
  return (
    <Link href={href} target={external ? "_blank" : undefined}
      className={`${buttonBase} ${variants[variant]} ${className}`}>
      {leftIcon}<span className="mx-2">{children}</span>{rightIcon}
    </Link>
  )
}

// ─── INPUT — 52px height, 14px radius ───
export const Input = forwardRef<HTMLInputElement, any>(
  ({ label, error, leftIcon, className = "", ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-zinc-300">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{leftIcon}</div>}
        <input ref={ref}
          className={`w-full h-[52px] rounded-[14px] bg-[#18181b] border border-white/[0.06] text-white placeholder-zinc-500 text-lg px-5
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-purple-500/40
            hover:border-white/[0.12]
            ${leftIcon ? "pl-12" : ""} ${error ? "border-red-500" : ""} ${className}`}
          {...props} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
)
Input.displayName = "Input"

// ─── CARD — 20px radius, 32px padding ───
export function Card({ children, variant = "default", hover = false, className = "", onClick }: any) {
  const variants: any = {
    default: "bg-[#18181b] border border-white/[0.06]",
    featured: "bg-[#18181b] border border-purple-500/10 shadow-lg shadow-purple-500/5",
  }
  return (
    <div onClick={onClick}
      className={`rounded-[20px] p-8 shadow-sm shadow-black/5 transition-all duration-200 ease-out
        ${variants[variant]}
        ${hover ? "hover:border-white/[0.12] hover:bg-white/[0.02] cursor-pointer" : ""} 
        ${className}`}>
      {children}
    </div>
  )
}

// ─── BADGE — 999px radius ───
const badgeColors: any = {
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  neutral: "bg-white/[0.04] text-zinc-400 border-white/[0.06]",
}

export function Badge({ children, variant = "neutral", className = "" }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${badgeColors[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── SKELETON ───
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.04] rounded-[14px] ${className}`} />
}

// ─── SECTION HEADER ───
export function SectionHeader({ title, description, action }: any) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-base text-zinc-400 mt-2">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── AVATAR ───
export function Avatar({ src, alt, size = "md" }: any) {
  const sizes: any = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" }
  return <img src={src} alt={alt} className={`${sizes[size]} rounded-full ring-1 ring-white/[0.06]`} />
}