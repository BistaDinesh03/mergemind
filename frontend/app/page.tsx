import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, Github, Search, GitPullRequest, CheckCircle, Sparkles, Clock, BarChart3, Star, Shield, Zap, Code, Users, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      <Navbar />
      
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-8">
              <Sparkles className="w-4 h-4" /> AI-Powered Open Source Discovery
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              Find your first<br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                open source contribution
              </span>
              <br />in minutes
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed">
              MergeMind scans thousands of GitHub issues, explains them with AI, and guides you step-by-step from zero to your first merged pull request. No experience needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/discover" className="h-[54px] px-8 bg-white text-zinc-900 rounded-[16px] font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5">
                Start Contributing <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/discover?mode=repos" className="h-[54px] px-8 bg-[#18181b] text-white border border-[#27272a] rounded-[16px] font-medium text-base inline-flex items-center justify-center gap-2 hover:bg-[#27272a] hover:border-zinc-600 transition-all">
                <Search className="w-5 h-5" /> Browse Repositories
              </Link>
            </div>
            
            <div className="flex items-center gap-6 mt-10 text-sm text-zinc-500">
              <span className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub OAuth</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Real Issues Only</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Free Forever</span>
            </div>
          </div>
          
          {/* Product Preview Card */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[24px] blur-2xl" />
              <div className="relative bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 pb-4 border-b border-[#27272a]">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <GitPullRequest className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fix dark mode toggle</p>
                    <p className="text-xs text-zinc-500">tailwindlabs/headlessui · #2847</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
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
                      This is a perfect first issue — isolated CSS change with clear reproduction steps. The repository has active maintainers and good documentation.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 h-10 bg-white text-zinc-900 rounded-[12px] text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                    <Play className="w-4 h-4" /> Start Contributing
                  </button>
                  <button className="h-10 w-10 bg-[#27272a] rounded-[12px] inline-flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#27272a]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "5,000+", label: "Open Issues Indexed", icon: Search },
            { value: "500+", label: "Repositories", icon: Code },
            { value: "15", label: "Languages Supported", icon: Globe },
            { value: "AI Powered", label: "Gemini 2.5 Flash", icon: Sparkles },
          ].map(stat => (
            <div key={stat.label} className="text-center p-6 bg-[#18181b] border border-[#27272a] rounded-[20px]">
              <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#27272a]">
        <h2 className="text-3xl font-bold text-center mb-16">From zero to pull request in three steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-green-500/50 -z-10" />
          
          {[
            { step: "1", icon: Search, title: "Discover Issues", desc: "Browse beginner-friendly issues matched to your languages and skill level. Filter by difficulty, language, and topic.", color: "purple" },
            { step: "2", icon: Sparkles, title: "AI Explains Everything", desc: "Get a plain-English summary, difficulty estimate, and step-by-step guide. No more guessing what to do.", color: "blue" },
            { step: "3", icon: GitPullRequest, title: "Open Your First PR", desc: "Follow the interactive checklist — fork, clone, code, test, and submit. Track your progress along the way.", color: "green" },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className={`w-16 h-16 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <item.icon className={`w-8 h-8 text-${item.color}-400`} />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] text-sm font-bold mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#27272a]">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need to contribute</h2>
        <p className="text-zinc-400 text-center mb-16">Powerful features designed for first-time contributors</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "AI Issue Matching", desc: "Gemini AI finds issues matching your skills and interests" },
            { icon: CheckCircle, title: "Step-by-Step Guide", desc: "Interactive checklist from fork to merged pull request" },
            { icon: BarChart3, title: "Difficulty Estimation", desc: "Know the time and complexity before you start" },
            { icon: Shield, title: "Repository Health Score", desc: "See which projects are welcoming to beginners" },
            { icon: Github, title: "GitHub Integrated", desc: "Sign in with your GitHub account in one click" },
            { icon: TrendingUp, title: "Progress Tracking", desc: "Track viewed, saved, started, and completed issues" },
          ].map(feature => (
            <div key={feature.title} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <feature.icon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMPARISON ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#27272a]">
        <h2 className="text-3xl font-bold text-center mb-4">Why MergeMind over GitHub search?</h2>
        <p className="text-zinc-400 text-center mb-16">GitHub helps you find repos. MergeMind helps you contribute.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="md:col-span-1 bg-[#18181b] border border-[#27272a] rounded-[20px] p-8">
            <p className="text-sm text-zinc-500 uppercase tracking-wider mb-6">GitHub Search</p>
            <div className="space-y-4">
              {["Browse repos manually", "Read long issue threads", "Guess difficulty level", "No setup guide", "Figure out workflow alone"].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 text-xs">✕</span>
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl">→</span>
            </div>
          </div>
          
          <div className="md:col-span-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[20px] p-8">
            <p className="text-sm text-purple-300 uppercase tracking-wider mb-6">MergeMind</p>
            <div className="space-y-4">
              {["AI matches issues to you", "Plain-English summaries", "Difficulty + time estimates", "Step-by-step guide", "Interactive PR checklist"].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center border-t border-[#27272a]">
        <h2 className="text-4xl font-bold mb-4">Ready to make your first contribution?</h2>
        <p className="text-lg text-zinc-400 mb-10">Join developers who found their perfect first issue through MergeMind.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/discover" className="h-[56px] px-10 bg-white text-zinc-900 rounded-[16px] font-semibold text-lg inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5">
            Start Browsing Issues <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="https://github.com/BistaDinesh03/mergemind" target="_blank" className="h-[56px] px-10 bg-[#18181b] text-white border border-[#27272a] rounded-[16px] font-medium text-lg inline-flex items-center justify-center gap-2 hover:bg-[#27272a] transition-all">
            <Github className="w-5 h-5" /> Star on GitHub
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────── */}
      <footer className="border-t border-[#27272a] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            MergeMind · Open Source ·{" "}
            <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-400 hover:text-white transition-colors">GitHub</a>
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link href="/discover" className="hover:text-zinc-400 transition-colors">Discover</Link>
            <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
            <Link href="/portfolio" className="hover:text-zinc-400 transition-colors">Portfolio</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Play(props: any) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function Globe(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}