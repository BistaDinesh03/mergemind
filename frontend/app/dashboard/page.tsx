"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Star, Search, Sparkles, TrendingUp, Users, GitFork, ExternalLink } from "lucide-react"

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="h-16 border-b border-white/[0.04]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10 animate-pulse">
        <div className="space-y-2"><div className="h-7 w-48 bg-white/[0.04] rounded-lg" /><div className="h-4 w-64 bg-white/[0.03] rounded-lg" /></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_,i)=><div key={i} className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-4 sm:p-6 space-y-3"><div className="w-5 h-5 bg-white/[0.04] rounded" /><div className="h-7 w-12 bg-white/[0.04] rounded" /><div className="h-3 w-20 bg-white/[0.03] rounded" /></div>)}
        </div>
        <div className="space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-4 sm:p-6 flex gap-4"><div className="w-10 h-10 bg-white/[0.04] rounded-[14px]" /><div className="flex-1 space-y-2"><div className="h-3 w-32 bg-white/[0.03] rounded" /><div className="h-5 w-3/4 bg-white/[0.04] rounded" /><div className="flex gap-4"><div className="h-3 w-12 bg-white/[0.03] rounded" /><div className="h-3 w-12 bg-white/[0.03] rounded" /></div></div><div className="w-14 h-14 bg-white/[0.04] rounded-[14px]" /></div>)}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [recs, setRecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const username = session?.user?.name || "Developer"

  useEffect(() => {
    document.title = "Dashboard — MergeMind"
    const timer = setTimeout(() => {
      fetch("http://localhost:8000/api/recommendations/top?limit=5")
        .then(r => r.json())
        .then(d => { setRecs(d.recommendations || []); setLoading(false) })
        .catch(() => { setError(true); setLoading(false) })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Skeleton />

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Good morning, {username} 👋</h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-1 sm:mt-2">Here's your open source overview</p>
          </div>
          <Link href="/discover" className="h-11 sm:h-[44px] px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 justify-center transition-all duration-200 active:scale-[0.98]" aria-label="Find issues to contribute to">
            <Search className="w-4 h-4" aria-hidden="true" /> Find Issues
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: GitFork, value: "6", label: "Repositories", color: "text-blue-400" },
            { icon: Star, value: "12", label: "Stars", color: "text-yellow-400" },
            { icon: Users, value: session?.user ? "2" : "—", label: "Followers", color: "text-green-400" },
            { icon: TrendingUp, value: error ? "—" : recs.length, label: "Picks Ready", color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-4 sm:p-6 hover:border-white/[0.08] transition-all duration-200 cursor-default">
              <s.icon className={`w-5 h-5 ${s.color} mb-2 sm:mb-3`} aria-hidden="true" />
              <p className="text-2xl sm:text-3xl font-bold">{s.value}</p>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-xl font-bold flex items-center gap-2.5 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" aria-hidden="true" /> Top Picks
          </h2>
          
          {error ? (
            <div className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-10 text-center">
              <p className="text-zinc-400 mb-4">Unable to load recommendations</p>
              <button onClick={() => window.location.reload()} className="h-[44px] px-6 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold">Try Again</button>
            </div>
          ) : (
            <div className="space-y-3" role="list">
              {recs.map((r: any, i: number) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="group block bg-[#18181b] border border-white/[0.04] rounded-[20px] p-4 sm:p-6 hover:border-white/[0.08] hover:bg-white/[0.01] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-500/40 cursor-pointer"
                  aria-label={`${r.title} in ${r.repo}, score ${r.overall_score} out of 100`}>
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[14px] flex items-center justify-center text-sm font-bold bg-purple-500/20 text-purple-300 flex-shrink-0">{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm text-zinc-500 font-mono">{r.repo}</span>
                      <h3 className="text-sm sm:text-base font-semibold mt-1 sm:mt-2 group-hover:text-white transition-colors line-clamp-2">{r.title}</h3>
                      <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-500">
                        <span>🔥 {r.difficulty_score}</span><span>🔀 {r.merge_chance}%</span>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 flex-shrink-0">{r.overall_score}<span className="text-[10px] sm:text-xs text-zinc-600">/100</span></div>
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600 group-hover:text-purple-400 flex-shrink-0 hidden sm:block" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}