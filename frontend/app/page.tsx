import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, Github, Search, GitPullRequest, Sparkles, Clock, BarChart3, CheckCircle, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
              Your first open source<br />
              <span className="text-purple-400">contribution,</span> simplified
            </h1>
            <p className="text-lg text-zinc-400 max-w-md mb-10 leading-relaxed">
              AI finds beginner-friendly issues, explains them in plain English, and guides you step by step to your first merged PR.
            </p>
            <div className="flex gap-3">
              <Link href="/discover" className="h-12 px-8 bg-white text-zinc-900 rounded-[14px] font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                Browse Issues <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="h-12 px-8 bg-[#18181b] border border-[#27272a] rounded-[14px] font-medium inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
                <Github className="w-5 h-5" /> Sign in
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#27272a]">
                <div className="w-10 h-10 rounded-full bg-[#27272a]" />
                <div>
                  <p className="text-sm font-semibold">Fix dark mode toggle in sidebar</p>
                  <p className="text-xs text-zinc-500">tailwindlabs/headlessui</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Beginner</span>
                <span className="px-2.5 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><Clock className="w-3 h-3 inline mr-1" />1-2h</span>
                <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"><BarChart3 className="w-3 h-3 inline mr-1" />91/100</span>
              </div>
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-[14px] p-3">
                <div className="flex gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-400 leading-relaxed">Isolated CSS fix with clear reproduction steps. Active maintainers.</p>
                </div>
              </div>
              <button className="w-full h-10 bg-white text-zinc-900 rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2">
                <GitPullRequest className="w-4 h-4" /> Start Contributing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-[#27272a]">
        <h2 className="text-2xl font-bold text-center mb-16">How it works</h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {[
            { step: "01", title: "Discover", desc: "Browse beginner-friendly issues matched to your languages and skill level." },
            { step: "02", title: "Understand", desc: "AI explains the issue in plain English and shows which files to edit." },
            { step: "03", title: "Contribute", desc: "Follow the step-by-step guide and open your first pull request." },
          ].map((item, i) => (
            <div key={item.step} className="flex-1 text-center">
              <p className="text-sm text-purple-400 font-mono mb-3">{item.step}</p>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              {i < 2 && <div className="hidden md:block text-zinc-700 text-2xl mt-4">↓</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-t border-[#27272a]">
        <h2 className="text-2xl font-bold text-center mb-12">Why MergeMind</h2>
        <div className="space-y-3">
          {[
            { left: "GitHub search", right: "AI-matched issues" },
            { left: "Read long threads", right: "Plain-English summaries" },
            { left: "Guess difficulty", right: "Time & complexity estimates" },
            { left: "No guidance", right: "Step-by-step checklist" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-4 text-sm py-3 px-4 bg-[#18181b] border border-[#27272a] rounded-[14px]">
              <span className="flex-1 text-right text-zinc-500 line-through">{row.left}</span>
              <span className="text-zinc-700">→</span>
              <span className="flex-1 text-zinc-200">{row.right}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center border-t border-[#27272a]">
        <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
        <p className="text-zinc-400 mb-8">Find your first open source issue today.</p>
        <Link href="/discover" className="h-12 px-10 bg-white text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
          Browse Issues <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-8 px-6 text-center">
        <p className="text-sm text-zinc-600">
          <a href="https://github.com/BistaDinesh03/mergemind" className="hover:text-zinc-400 transition-colors">Open source</a>
          {" · "}Built for first-time contributors
        </p>
      </footer>
    </div>
  )
}