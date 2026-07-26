import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, Github, Search, GitPullRequest, Sparkles, Clock, BarChart3 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
              Find your first<br />
              <span className="text-purple-400">open source issue</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-md mb-10 leading-relaxed">
              AI scans thousands of GitHub issues and finds the perfect one for you. Step-by-step guide included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/discover" className="h-[52px] px-8 bg-white text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                Browse Issues <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="h-[52px] px-8 bg-[#18181b] text-white border border-[#27272a] rounded-[14px] font-medium text-base inline-flex items-center justify-center gap-2 hover:bg-[#27272a] transition-colors">
                <Github className="w-5 h-5" /> Sign in
              </Link>
            </div>
          </div>

          {/* Right: Product Preview */}
          <div className="hidden lg:block">
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 pb-4 border-b border-[#27272a]">
                <div className="w-10 h-10 rounded-full bg-[#27272a]" />
                <div>
                  <p className="text-sm font-semibold">Fix dark mode toggle in sidebar</p>
                  <p className="text-xs text-zinc-500">tailwindlabs/headlessui · #2847</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Beginner
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Clock className="w-3 h-3" /> 1-2h
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <BarChart3 className="w-3 h-3" /> 91/100
                </span>
              </div>
              
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-[14px] p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Isolated CSS fix with clear reproduction steps. Active maintainers and good documentation.
                  </p>
                </div>
              </div>
              
              <button className="w-full h-10 bg-white text-zinc-900 rounded-[12px] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                <GitPullRequest className="w-4 h-4" /> Start Contributing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[#27272a]">
        <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Discover", desc: "Browse beginner-friendly issues matched to your skills." },
            { step: "02", title: "Understand", desc: "AI explains the issue and shows you what files to edit." },
            { step: "03", title: "Contribute", desc: "Follow the step-by-step guide and open your first PR." },
          ].map(item => (
            <div key={item.step} className="text-center">
              <p className="text-sm text-purple-400 font-mono mb-4">{item.step}</p>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY ──────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[#27272a]">
        <h2 className="text-3xl font-bold text-center mb-16">Why MergeMind</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {[
            { left: "GitHub search", right: "AI-matched issues" },
            { left: "Read long threads", right: "Plain-English summaries" },
            { left: "Guess difficulty", right: "Time & complexity estimates" },
            { left: "No guidance", right: "Step-by-step checklist" },
          ].map((row, i) => (
            <div key={i} className="col-span-1 md:col-span-2 flex items-center gap-4 text-sm">
              <span className="flex-1 text-right text-zinc-500 line-through">{row.left}</span>
              <span className="text-zinc-700">→</span>
              <span className="flex-1 text-zinc-300">{row.right}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center border-t border-[#27272a]">
        <h2 className="text-4xl font-bold mb-4">Ready to start?</h2>
        <p className="text-zinc-400 mb-10">Find your first open source issue today.</p>
        <Link href="/discover" className="h-[52px] px-10 bg-white text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
          Browse Issues <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* ─── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-[#27272a] py-8 px-6 text-center">
        <p className="text-sm text-zinc-600">
          <a href="https://github.com/BistaDinesh03/mergemind" className="hover:text-zinc-400 transition-colors">Open source</a>
          {" · "}Built for first-time contributors
        </p>
      </footer>
    </div>
  )
}