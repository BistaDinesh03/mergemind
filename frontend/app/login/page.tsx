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
          
          <img src="/icon.svg" alt="MergeMind" className="w-12 h-12 mx-auto mb-4" />
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