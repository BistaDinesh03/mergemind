"use client"

import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Github, ArrowRight, Search, Zap, BookOpen } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 pt-28 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              MergeMind
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-2 leading-relaxed">
            Discover GitHub issues. Score them with AI. Build your portfolio.
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-10">
            Stop scrolling through millions of issues. AI finds, scores, and ranks the best ones for you.
          </p>

          {session ? (
            <Link href="/dashboard" 
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 ring-1 ring-white/5">
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button onClick={() => signIn("github")}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-white/10">
              <Github className="w-5 h-5" /> Sign In with GitHub
            </button>
          )}
          <p className="text-xs text-gray-600 mt-4">Free · Open Source · No credit card</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-12 tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", icon: Github, title: "Sign In", desc: "Connect GitHub in one click" },
            { step: "2", icon: Search, title: "Discover", desc: "Browse trending repos & issues" },
            { step: "3", icon: Zap, title: "AI Scores", desc: "Each issue scored for difficulty & merge chance" },
            { step: "4", icon: BookOpen, title: "Contribute", desc: "Pick the best issue and start coding" },
          ].map((s, i) => (
            <div key={i} className="group text-center bg-[#111318] rounded-xl p-6 border border-gray-800/50 hover:border-gray-700 transition-all duration-200">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center mx-auto mb-3 ring-1 ring-purple-500/20">
                <span className="text-purple-400 font-bold text-sm">{s.step}</span>
              </div>
              <s.icon className="w-6 h-6 text-gray-400 group-hover:text-gray-300 mx-auto mb-2 transition-colors" />
              <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 text-center">
        <p className="text-xs text-gray-600">
          Built for the open source community · <a href="https://github.com/BistaDinesh03/mergemind" className="text-purple-400 hover:text-purple-300 transition-colors">GitHub</a>
        </p>
      </footer>
    </div>
  )
}