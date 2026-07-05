"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { Github } from "lucide-react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-6 pt-32">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-[24px] p-8 text-center">
          
          <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
            <rect width="32" height="32" rx="8" fill="#18181B"/>
            <path d="M16 5L16.5 6.4L18 7L16.5 7.6L16 9L15.5 7.6L14 7L15.5 6.4Z" fill="#C084FC"/>
            <path d="M10 18V12C10 8.5 12.8 6 16 6C19.2 6 22 8.5 22 12V18" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="10" y1="18" x2="22" y2="18" stroke="#A855F7" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 11L18 15M18 11L14 15" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="16" cy="18" r="2" fill="#C084FC"/>
            <line x1="16" y1="20" x2="16" y2="25" stroke="#A855F7" stroke-width="2" stroke-linecap="round"/>
          </svg>
          
          <h1 className="text-2xl font-bold mb-2">Welcome to MergeMind</h1>
          <p className="text-sm text-zinc-400 mb-8">Sign in to find your next contribution</p>
          
          <button
            onClick={() => { setLoading(true); signIn("github", { callbackUrl: "/dashboard" }) }}
            disabled={loading}
            className="h-[52px] w-full bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
          >
            <Github className="w-5 h-5" />
            {loading ? "Redirecting..." : "Continue with GitHub"}
          </button>
          
          <p className="text-xs text-zinc-600 mt-4">Read-only access to public repositories</p>
        </div>
      </div>
    </div>
  )
}