"use client"
import Link from "next/link"

// Standard Card — used everywhere
export function Card({ children, className = "", hover = false, padding = "md" }: { children: React.ReactNode; className?: string; hover?: boolean; padding?: "sm" | "md" | "lg" }) {
  const paddings: Record<string, string> = { sm: "p-4", md: "p-5", lg: "p-6 sm:p-8" }
  return (
    <div className={`bg-[#18181b] border border-[#27272a] rounded-[20px] ${paddings[padding]} ${hover ? "card-standard cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  )
}

// Standard Button
export function Btn({ children, variant = "primary", size = "md", href, external, className = "", ...props }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg"; href?: string; external?: boolean; className?: string; [key: string]: any }) {
  const base = "inline-flex items-center justify-center font-medium rounded-[14px] btn-standard"
  const variants: Record<string, string> = {
    primary: "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm",
    secondary: "bg-[#18181b] text-white hover:bg-[#27272a] border border-[#27272a]",
    ghost: "text-zinc-400 hover:text-white hover:bg-[#18181b]/50",
  }
  const sizes: Record<string, string> = { sm: "h-9 px-3 text-xs gap-1.5", md: "h-11 px-5 text-sm gap-2", lg: "h-[52px] px-8 text-base gap-2.5" }
  
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  
  if (href) {
    return <Link href={href} target={external ? "_blank" : undefined} className={classes}>{children}</Link>
  }
  return <button className={classes} {...props}>{children}</button>
}