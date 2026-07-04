"use client"
import React from "react"

// Standard card used across ALL pages
export function StandardCard({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 sm:p-6 
      ${hover ? "card-lift cursor-pointer" : ""} ${className}`}>
      {children}
    </div>
  )
}

// Standard stat card used on Dashboard
export function StatCard({ icon: Icon, value, label, trend, color = "text-purple-400" }: any) {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 sm:p-6 card-lift">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        {trend && <span className="text-[10px] text-zinc-600 font-medium">{trend}</span>}
      </div>
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-sm text-zinc-500 mt-1">{label}</p>
    </div>
  )
}

// Standard section header used across ALL pages
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}