"use client"

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

function OAuthLoadingScreen() {
  const [message, setMessage] = useState("Connecting your GitHub account...")

  useEffect(() => {
    const messages = [
      "Connecting your GitHub account...",
      "Fetching your repositories...",
      "Analyzing your profile...",
      "Preparing your dashboard...",
    ]
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i < messages.length) setMessage(messages[i] || "Connecting your GitHub account...")
      else clearInterval(timer)
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-6">
        <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
          <rect width="32" height="32" rx="8" fill="#18181B"/>
          <path d="M16 5L16.5 6.4L18 7L16.5 7.6L16 9L15.5 7.6L14 7L15.5 6.4Z" fill="#C084FC"/>
          <path d="M10 18V12C10 8.5 12.8 6 16 6C19.2 6 22 8.5 22 12V18" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="18" x2="22" y2="18" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 11L18 15M18 11L14 15" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="16" cy="18" r="2" fill="#C084FC"/>
          <line x1="16" y1="20" x2="16" y2="25" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Signing you in</h2>
          <p className="text-sm text-zinc-400 animate-fadeIn">{message}</p>
        </div>

        <div className="w-40 h-1 bg-[#27272a] rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: "75%" }} />
        </div>
      </div>
    </div>
  )
}

function SessionLoader({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const pathname = usePathname()

  if (status === "loading" && pathname === "/dashboard") {
    return <OAuthLoadingScreen />
  }

  return <>{children}</>
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionLoader>{children}</SessionLoader>
    </NextAuthSessionProvider>
  )
}