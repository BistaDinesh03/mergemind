"use client"
import { signIn } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md bg-[#111318] rounded-2xl p-8 border border-gray-800/50">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Sign in to find your next contribution</p>
          <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold transition-all duration-200">
            <Github className="w-5 h-5" /> Continue with GitHub
          </button>
          <p className="text-xs text-gray-600 text-center mt-4">We only request access to public repositories</p>
        </div>
      </div>
    </div>
  )
}