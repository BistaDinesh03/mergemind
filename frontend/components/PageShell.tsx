"use client"

import { ReactNode } from "react"
import { Navbar } from "@/components/Navbar"

interface PageShellProps {
  children: ReactNode
  loading?: boolean
  skeleton?: ReactNode
}

export function PageShell({ children, loading = false, skeleton }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="animate-fadeIn">
        {loading && skeleton ? skeleton : children}
      </div>
    </div>
  )
}