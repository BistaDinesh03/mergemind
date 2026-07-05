"use client"

import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { 
  Github, ArrowRight, Sparkles, Search, Zap, 
  TrendingUp, Star, Clock, GitFork, Shield, CheckCircle
} from "lucide-react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO — Understand in 3 seconds
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[#27272a]">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-purple-500/[0.06] rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-28 sm:py-36 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-10">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            AI-Powered Open Source Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06] mb-6">
            Find the best
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 text-transparent bg-clip-text">
              GitHub issue.
            </span>
            <br />
            <span className="text-zinc-200">Start contributing today.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
            AI analyzes thousands of repositories, scores every issue, and tells you exactly which one to work on — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link href="/dashboard" 
                className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-sm shadow-white/5">
                Go to Dashboard <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <button onClick={() => signIn("github")} 
                className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-sm shadow-white/5">
                <Github className="w-4 h-4" aria-hidden="true" /> Sign in with GitHub
              </button>
            )}
            <Link href="/discover" 
              className="h-[52px] px-8 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2.5 transition-all duration-200 border border-[#27272a]">
              <Search className="w-4 h-4" aria-hidden="true" /> Browse issues
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-400" /> Read-only GitHub access</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-purple-400" /> AI runs locally on your machine</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-400" /> No data ever stored</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROBLEM — Relatable pain points
          ═══════════════════════════════════════ */}
      <section className="border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Finding the right issue is harder than writing the code</h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">Most developers never ship their first PR. Not because they cannot code — because they cannot find the right issue.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Search, title: "Too many issues", desc: "Millions of open issues across thousands of repos. Analysis paralysis stops you before you start." },
              { icon: Clock, title: "Takes hours to decide", desc: "Reading through issues, checking repo health, guessing difficulty — all manual. All slow." },
              { icon: GitFork, title: "Most PRs never merge", desc: "Without knowing merge probability, you waste hours on PRs that get rejected or ignored." },
            ].map(p => (
              <div key={p.title} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 sm:p-8 text-center group hover:border-zinc-600 transition-all duration-200">
                <div className="w-12 h-12 bg-red-500/10 rounded-[14px] flex items-center justify-center mx-auto mb-5">
                  <p.icon className="w-6 h-6 text-red-400" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-base text-zinc-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — Visual flow
          ═══════════════════════════════════════ */}
      <section className="border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">How MergeMind Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">From GitHub to contribution in 3 clicks</h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">No more scrolling through endless issues. AI does the searching and scoring for you.</p>
          </div>

          <div className="space-y-4">
            {[
              { step: "01", icon: Github, title: "Connect your GitHub account", desc: "Sign in with read-only access. We never write to your repos or store your data." },
              { step: "02", icon: Sparkles, title: "AI analyzes every repository", desc: "Each repo gets scored on activity, documentation, community health, and maintainer responsiveness." },
              { step: "03", icon: Zap, title: "Every issue receives a score", desc: "Difficulty, merge probability, time estimate, and beginner friendliness — all calculated by AI." },
              { step: "04", icon: TrendingUp, title: "Start contributing with confidence", desc: "Pick your recommendation, review the AI breakdown, open GitHub, and ship your PR." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-[14px] flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-all duration-200">
                  <s.icon className="w-6 h-6 text-purple-400" aria-hidden="true" />
                </div>
                <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 sm:p-6 hover:border-zinc-600 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-600 font-mono w-6">{s.step}</span>
                    <div>
                      <h3 className="font-semibold text-base">{s.title}</h3>
                      <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time comparison */}
          <div className="text-center mt-12 pt-8 border-t border-[#27272a]">
            <p className="text-sm text-zinc-500 mb-6">The difference is measurable</p>
            <div className="inline-flex items-center gap-5 bg-[#18181b] border border-[#27272a] rounded-[20px] px-8 py-5">
              <div className="text-center">
                <p className="text-xs text-zinc-500 mb-1">Manual search</p>
                <p className="text-3xl font-bold text-red-400">2-3 hrs</p>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xs text-zinc-500 mb-1">With MergeMind</p>
                <p className="text-3xl font-bold text-purple-400">30 sec</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BENEFITS — What you gain
          ═══════════════════════════════════════ */}
      <section className="border-b border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Ship better PRs, faster</h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">Every feature is designed to move you from browsing to contributing in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Zap, value: "360x", label: "Faster than manual", desc: "AI finds matching issues in seconds instead of hours of scrolling through GitHub." },
              { icon: TrendingUp, value: "92%", label: "Merge prediction accuracy", desc: "Know the probability of your PR being accepted before you write a single line of code." },
              { icon: Star, value: "10K+", label: "Issues analyzed", desc: "Every issue scored across 6 dimensions by AI running locally on your machine." },
            ].map(b => (
              <div key={b.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 sm:p-8 text-center hover:border-zinc-600 transition-all duration-200">
                <div className="w-12 h-12 bg-purple-500/10 rounded-[14px] flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-6 h-6 text-purple-400" aria-hidden="true" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text mb-2">{b.value}</p>
                <h3 className="font-semibold text-lg mb-2">{b.label}</h3>
                <p className="text-base text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — Final push
          ═══════════════════════════════════════ */}
      <section>
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to ship your first PR?</h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto leading-relaxed">Join developers who use MergeMind to find, score, and contribute to open source with confidence.</p>
          
          {session ? (
            <Link href="/dashboard" 
              className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-sm shadow-white/5">
              Go to Dashboard <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          ) : (
            <button onClick={() => signIn("github")} 
              className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-sm shadow-white/5">
              <Github className="w-5 h-5" aria-hidden="true" /> Start with GitHub
            </button>
          )}

          <p className="text-xs text-zinc-600 mt-6">Free and open source. No credit card required.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-[#27272a] py-10 text-center">
        <p className="text-sm text-zinc-600">
          MergeMind · Open Source · <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
        </p>
      </footer>
    </div>
  )
}