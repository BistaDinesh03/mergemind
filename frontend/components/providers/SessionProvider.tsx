"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function OAuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-6">
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="mx-auto">
          <rect width="32" height="32" rx="8" fill="#18181b"/>
          <line x1="16" y1="20" x2="16" y2="27" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="20" x2="23" y2="20" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="20" r="2.5" fill="#c084fc"/>
          <path d="M10 12.5C10 8.36 13.36 5 17.5 5C21.64 5 25 8.36 25 12.5V18C25 18 21.5 14.5 17.5 14.5C13.5 14.5 10 18 10 18V12.5Z" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 8.5L18.8 10.2L20.5 11L18.8 11.8L18 13.5L17.2 11.8L15.5 11L17.2 10.2Z" fill="#c084fc"/>
        </svg>
        
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Signing you in...</h2>
          <div className="space-y-2 text-sm text-zinc-400">
            <p className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>Connecting your GitHub account...</p>
            <p className="animate-fadeIn" style={{ animationDelay: "0.8s" }}>Loading your AI recommendations...</p>
          </div>
        </div>

        <div className="w-32 h-1 bg-[#27272a] rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  )
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showOAuthLoading, setShowOAuthLoading] = useState(false)

  useEffect(() => {
    // Show loading screen during OAuth callback
    if (pathname === "/api/auth/callback/github" || searchParams?.get("code")) {
      setShowOAuthLoading(true)
    }
    
    // Hide after redirect to dashboard
    if (pathname === "/dashboard") {
      const timer = setTimeout(() => setShowOAuthLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return (
    <NextAuthSessionProvider>
      {showOAuthLoading && <OAuthLoadingScreen />}
      {children}
    </NextAuthSessionProvider>
  )
}