"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Github, LogOut, Search, Zap, BookOpen } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">MergeMind</h1>
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
              <Link href="/discover" className="text-gray-300 hover:text-white text-sm">Discover</Link>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => signIn("github")} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
              <Github className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
          MergeMind
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mb-8">
          AI-powered platform to discover, score, and track open source contributions
        </p>
        
        {!session ? (
          <button onClick={() => signIn("github")} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-lg transition-all">
            <Github className="w-6 h-6" /> Get Started with GitHub
          </button>
        ) : (
          <div className="flex gap-4">
            <Link href="/discover" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold">Discover Issues</Link>
            <Link href="/portfolio" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold">View Portfolio</Link>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20">
        {[
          { icon: Search, title: "Discover", desc: "Browse real GitHub issues from trending repositories with one click" },
          { icon: Zap, title: "AI Scoring", desc: "Get AI-powered scores for issues - difficulty, time, and opportunity rating" },
          { icon: BookOpen, title: "Portfolio", desc: "Showcase your open source contributions with auto-generated portfolio" },
        ].map((f, i) => (
          <div key={i} className="bg-[#111118] rounded-xl p-6 border border-gray-800 text-center">
            <f.icon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}