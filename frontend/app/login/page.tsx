"use client"

import { signIn } from "next-auth/react"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-dark-950">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
            MergeMind
          </h1>
          <p className="text-xl text-gray-400">The AI-powered Open Source Intelligence Platform</p>
        </div>
        <div className="bg-dark-800 rounded-xl p-8 border border-gray-700 space-y-6">
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-gray-400">Sign in with your GitHub account to start finding the best issues to contribute to.</p>
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors border border-gray-600"
          >
            <Github className="w-6 h-6" />
            Continue with GitHub
          </button>
          <p className="text-sm text-gray-500">We only request access to your public repositories.</p>
        </div>
      </div>
    </main>
  )
}