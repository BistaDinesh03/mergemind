"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

function OAuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-6">
        <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#18181B"/>
          <path d="M16 5L16.5 6.4L18 7L16.5 7.6L16 9L15.5 7.6L14 7L15.5 6.4Z" fill="#C084FC"/>
          <path d="M10 18V12C10 8.5 12.8 6 16 6C19.2 6 22 8.5 22 12V18" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="10" y1="18" x2="22" y2="18" stroke="#A855F7" stroke-width="2" stroke-linecap="round"/>
          <path d="M14 11L18 15M18 11L14 15" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="16" cy="18" r="2" fill="#C084FC"/>
          <line x1="16" y1="20" x2="16" y2="25" stroke="#A855F7" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h2 className="text-lg font-bold text-white">Signing you in...</h2>
        <div className="w-32 h-1 bg-[#27272a] rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  )
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}