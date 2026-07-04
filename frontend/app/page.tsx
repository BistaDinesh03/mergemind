"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { 
  Github, ArrowRight, Sparkles, Star, Search, Zap, 
  TrendingUp, CheckCircle, Clock, Shield, Code, Users,
  ChevronRight, BarChart3, Target, Heart, GitMerge, Smile,
  Award, ExternalLink
} from "lucide-react"

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <section ref={ref} className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </section>
  )
}

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-purple-500/20 overflow-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════
          1. HERO
          ═══════════════════════════════════════════ */}
      <Section className="relative min-h-[calc(100vh-64px)] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" /> AI-Powered Open Source Intelligence
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

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            AI analyzes thousands of repos and ranks issues by difficulty, merge chance, and career value.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link href="/dashboard" className="group h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10">
                Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <button onClick={() => signIn("github")} className="group h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10">
                <Github className="w-4 h-4" /> Sign in with GitHub <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
            <Link href="/discover" className="h-[52px] px-8 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2.5 transition-all duration-300 border border-[#27272a]">
              <Search className="w-4 h-4" /> Browse issues
            </Link>
          </div>

          <p className="text-sm text-zinc-600 mt-6">Free · Open Source · No credit card required</p>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          2. SOCIAL PROOF
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Issues analyzed" },
              { value: "1,000+", label: "Repositories" },
              { value: "6 factors", label: "AI scoring model" },
              { value: "360x", label: "Faster than manual" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">{s.value}</p>
                <p className="text-sm text-zinc-500 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          3. HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">How MergeMind Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Four steps to your next PR</h2>
          </div>

          <div className="space-y-4">
            {[
              { step: "01", icon: Github, title: "Connect GitHub", desc: "Sign in with your account. We only access public data." },
              { step: "02", icon: BarChart3, title: "AI analyzes repos", desc: "Every repository gets scored on health, activity, and community." },
              { step: "03", icon: Sparkles, title: "Issues get scored", desc: "Difficulty, merge probability, and time estimates in seconds." },
              { step: "04", icon: CheckCircle, title: "Start contributing", desc: "Pick the best match and ship your PR with confidence." },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-[14px] flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-all duration-200">
                  <s.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-600 font-mono w-6">{s.step}</span>
                    <div>
                      <h3 className="font-semibold text-base">{s.title}</h3>
                      <p className="text-sm text-zinc-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          4. INTERACTIVE PRODUCT PREVIEW
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Product Preview</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">See it in action</h2>
          </div>

          <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] overflow-hidden shadow-2xl shadow-black/50">
            <div className="border-b border-[#27272a] px-5 py-3 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-[10px] text-zinc-600 ml-2 font-mono">MergeMind — Dashboard</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div><div className="h-4 w-36 bg-white/[0.04] rounded" /><div className="h-3 w-48 bg-white/[0.02] rounded mt-2" /></div>
                <div className="h-9 w-24 bg-purple-500/20 rounded-[14px]" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_,i)=><div key={i} className="bg-white/[0.02] rounded-[14px] p-3 space-y-2"><div className="w-4 h-4 bg-white/[0.06] rounded" /><div className="h-5 w-10 bg-white/[0.04] rounded" /><div className="h-2 w-12 bg-white/[0.02] rounded" /></div>)}
              </div>
              <div className="bg-purple-500/5 border border-purple-500/10 rounded-[14px] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-[10px] bg-purple-500/20 flex items-center justify-center text-xs text-purple-400 font-bold">1</div>
                <div className="flex-1 space-y-1.5"><div className="h-2.5 w-28 bg-white/[0.04] rounded" /><div className="h-3.5 w-full bg-white/[0.03] rounded" /></div>
                <div className="h-12 w-14 bg-purple-500/20 rounded-[14px] flex items-center justify-center"><span className="text-purple-400 font-bold text-sm">92</span></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          5. AI ADVANTAGES
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">AI Advantages</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why AI makes the difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-500/5 border border-red-500/10 rounded-[24px] p-8">
              <h3 className="text-lg font-semibold text-red-300 mb-6">Without AI</h3>
              <div className="space-y-4">
                {["Hours scrolling through issues","Guess which ones are beginner-friendly","No idea if PRs will be accepted","Wasted time on dead ends"].map((t,i)=><div key={i} className="flex items-center gap-3 text-zinc-400"><div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0"><span className="text-red-400 text-xs">✕</span></div><span className="text-sm">{t}</span></div>)}
              </div>
              <div className="mt-6 pt-6 border-t border-red-500/10 text-center">
                <Clock className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-400">2-3 hours</p>
              </div>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-[24px] p-8">
              <h3 className="text-lg font-semibold text-purple-300 mb-6">With MergeMind AI</h3>
              <div className="space-y-4">
                {["AI finds issues in seconds","Difficulty scored 0-100","Merge probability calculated","Start coding with confidence"].map((t,i)=><div key={i} className="flex items-center gap-3 text-zinc-300"><CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" /><span className="text-sm">{t}</span></div>)}
              </div>
              <div className="mt-6 pt-6 border-t border-purple-500/10 text-center">
                <Zap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-400">30 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          6. FEATURE GRID
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: "Health Scoring", desc: "4-factor repo analysis" },
              { icon: Target, title: "Opportunity Score", desc: "6-factor issue evaluation" },
              { icon: Zap, title: "AI Recommendations", desc: "Top 5 picks ranked for you" },
              { icon: Search, title: "Smart Discovery", desc: "Search across millions of repos" },
              { icon: Clock, title: "Time Estimates", desc: "Know exactly how long it takes" },
              { icon: Shield, title: "Portfolio Builder", desc: "Auto-generate from merged PRs" },
            ].map(f => (
              <div key={f.title} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 hover:border-zinc-600 transition-all duration-200">
                <div className="w-10 h-10 bg-purple-500/10 rounded-[14px] flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          7. TESTIMONIALS (placeholder)
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by developers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["This saved me hours of searching. Found my first PR in 30 seconds.","The AI scoring is eerily accurate. Every recommendation was spot on.","My portfolio grew from 0 to 12 merged PRs in 3 months. Incredible."].map((t,i)=><div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6"><div className="flex gap-1 mb-3">{[...Array(5)].map((_,j)=><Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}</div><p className="text-sm text-zinc-400 leading-relaxed mb-4">"{t}"</p><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#27272a]" /><div><p className="text-sm font-medium">Developer</p><p className="text-xs text-zinc-600">Open source contributor</p></div></div></div>)}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          8. FAQ
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is MergeMind free?", a: "Yes, completely free and open source. No credit card required." },
              { q: "What data do you access?", a: "Only public GitHub data — your repos, stars, and contribution history." },
              { q: "How does AI scoring work?", a: "We use Llama 3.2 to analyze issues across 6 factors — difficulty, merge chance, time, and more." },
              { q: "Can I use this for private repos?", a: "Currently MergeMind works with public repositories only." },
            ].map(faq => (
              <details key={faq.q} className="group bg-[#18181b] border border-[#27272a] rounded-[20px]">
                <summary className="px-6 py-5 cursor-pointer text-base font-medium list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-5 text-sm text-zinc-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          9. FINAL CTA
          ═══════════════════════════════════════════ */}
      <Section className="border-t border-[#27272a]">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to find your next PR?</h2>
          <p className="text-lg text-zinc-400 mb-10">Join developers using MergeMind to discover, score, and ship.</p>
          {session ? (
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10">
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button onClick={() => signIn("github")} className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10">
              <Github className="w-5 h-5" /> Start with GitHub <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          10. FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-[#27272a] py-10 text-center">
        <p className="text-sm text-zinc-600">
          MergeMind · Open Source · <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
        </p>
      </footer>
    </div>
  )
}