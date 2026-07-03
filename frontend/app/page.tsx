"use client"

import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { 
  Github, ArrowRight, Zap, Sparkles, Star, Search, Clock, 
  TrendingUp, CheckCircle, Target, BarChart3, Bug
} from "lucide-react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-purple-500/20">
      <Navbar />

      {/* ═══════════════════════════════════
          1. HERO
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.02] rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06] mb-6">
            Find the best
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 text-transparent bg-clip-text">
              GitHub issue.
            </span>
            <br />
            <span className="text-zinc-200">Start contributing today.</span>
          </h1>
          
          <p className="text-lg text-zinc-400 max-w-lg mx-auto mb-10">
            AI analyzes thousands of repos and ranks issues by difficulty, merge chance, and career value.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {session ? (
              <Link href="/dashboard" className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button onClick={() => signIn("github")} className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
                <Github className="w-4 h-4" /> Sign in with GitHub
              </button>
            )}
            <Link href="/discover" className="h-[52px] px-8 bg-white/[0.03] hover:bg-white/[0.06] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2.5 transition-all duration-200 border border-white/[0.06]">
              Browse issues
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. PROBLEM
          ═══════════════════════════════════ */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Finding the right issue is hard</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Search, title: "Too many issues", desc: "Millions of open issues. Where do you start?" },
              { icon: Clock, title: "Takes hours", desc: "Reading issues, checking repos, guessing difficulty." },
              { icon: Bug, title: "Most PRs fail", desc: "Without merge data, you waste time on dead ends." },
            ].map(p => (
              <div key={p.title} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-[14px] flex items-center justify-center mx-auto mb-5">
                  <p.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-base text-zinc-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          3. HOW MERGEMIND WORKS — 4 Steps
          ═══════════════════════════════════ */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">How MergeMind Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Four steps to your next PR</h2>
          </div>

          {/* Step Flow */}
          <div className="space-y-4">
            {[
              {
                step: "1",
                icon: Github,
                title: "Connect your GitHub",
                desc: "Sign in with your account. We only read public data.",
                color: "bg-zinc-500/10",
                iconColor: "text-zinc-400",
              },
              {
                step: "2",
                icon: BarChart3,
                title: "AI analyzes repository health",
                desc: "Every repo gets scored on activity, community, maintenance, and documentation.",
                color: "bg-purple-500/10",
                iconColor: "text-purple-400",
              },
              {
                step: "3",
                icon: Sparkles,
                title: "Scores every issue for you",
                desc: "Difficulty, merge probability, time estimate, and beginner friendliness — all in one score.",
                color: "bg-purple-500/10",
                iconColor: "text-purple-400",
              },
              {
                step: "4",
                icon: CheckCircle,
                title: "Start contributing confidently",
                desc: "Pick the best match and ship your PR knowing it's likely to get merged.",
                color: "bg-green-500/10",
                iconColor: "text-green-400",
              },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                {/* Step number + icon */}
                <div className={`w-14 h-14 ${s.color} rounded-[14px] flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>

                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden sm:block absolute left-[67px] w-px h-12 bg-white/[0.04] -mt-4" />
                )}

                {/* Content */}
                <div className="flex-1 bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 hover:border-white/[0.12] transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-zinc-600 w-6">{s.step}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      <p className="text-base text-zinc-500 mt-0.5">{s.desc}</p>
                    </div>
                    {i < 3 && (
                      <ArrowRight className="w-5 h-5 text-zinc-700 ml-auto hidden sm:block" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time comparison */}
          <div className="text-center mt-12 pt-8 border-t border-white/[0.04]">
            <div className="inline-flex items-center gap-4 bg-[#18181b] border border-white/[0.06] rounded-[20px] px-8 py-5">
              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-1">Without AI</p>
                <p className="text-3xl font-bold text-red-400">2-3 hrs</p>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600" />
              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-1">With MergeMind</p>
                <p className="text-3xl font-bold text-purple-400">30 sec</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. AI ANALYSIS PREVIEW
          ═══════════════════════════════════ */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Real AI Analysis</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Every issue gets scored</h2>
          </div>

          <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] overflow-hidden shadow-2xl shadow-black/40 max-w-lg mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
              <p className="text-purple-200 text-xs uppercase tracking-wider mb-2">AI Score</p>
              <p className="text-6xl font-bold">92</p>
              <p className="text-purple-200 text-sm mt-1">out of 100</p>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Difficulty", value: 88, color: "bg-green-500" },
                { label: "Merge Probability", value: 85, color: "bg-blue-500" },
                { label: "Beginner Friendly", value: 92, color: "bg-purple-500" },
                { label: "Repo Health", value: 90, color: "bg-emerald-500" },
              ].map(f => (
                <div key={f.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-zinc-400">{f.label}</span>
                    <span className="font-semibold">{f.value}</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.04] rounded-full">
                    <div className={`h-2 ${f.color} rounded-full`} style={{ width: `${f.value}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/[0.04] text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Highly Recommended
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. BENEFITS
          ═══════════════════════════════════ */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ship better PRs, faster</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Zap, value: "360x", label: "Faster discovery", desc: "AI finds issues in seconds, not hours" },
              { icon: TrendingUp, value: "92%", label: "Merge confidence", desc: "Know the odds before you start coding" },
              { icon: Star, value: "10K+", label: "Issues analyzed", desc: "Scored across 6 dimensions by AI" },
            ].map(b => (
              <div key={b.label} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-[14px] flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text mb-1">{b.value}</p>
                <h3 className="font-semibold text-lg mb-1.5">{b.label}</h3>
                <p className="text-base text-zinc-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. CTA
          ═══════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.03] to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 sm:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to find your next PR?</h2>
          <p className="text-lg text-zinc-400 mb-10">Thousands of developers use MergeMind to discover, score, and ship.</p>
          
          {session ? (
            <Link href="/dashboard" className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button onClick={() => signIn("github")} className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
              <Github className="w-5 h-5" /> Start with GitHub
            </button>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
          ═══════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] py-10 text-center">
        <p className="text-sm text-zinc-600">
          MergeMind · Open Source · <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-500 hover:text-white transition-colors">GitHub</a>
        </p>
      </footer>
    </div>
  )
}