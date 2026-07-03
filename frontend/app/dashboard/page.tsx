"use client"
import { useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useApi } from "@/lib/api"
import { Navbar, ErrorDisplay, DashboardSkeleton } from "@/components"
import { Star, Users, Target, Zap, Search, BookOpen, Code } from "lucide-react"
import type { PortfolioData } from "@/types"

export default function DashboardPage() {
  const { data: session } = useSession()
  const username = session?.user?.name || "BistaDinesh03"
  
  const { data: portfolio, loading, error, refetch } = useApi<PortfolioData>(`/api/portfolio/${username}`)
  const { data: recsData } = useApi<{ recommendations: any[] }>("/api/recommendations/top?limit=5")
  
  const recs = recsData?.recommendations || []
  const totalStars = useMemo(() => portfolio?.repositories?.reduce((s, r) => s + r.stars, 0) || 0, [portfolio])

  if (loading) return <DashboardSkeleton />
  if (error) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><ErrorDisplay type="api" message={error} onRetry={refetch} /></div>

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-8">
        <div className="bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-2xl p-4 sm:p-6 border border-purple-500/10">
          <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {portfolio?.name || username}! 👋</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1.5">{recs.length > 0 ? `${recs.length} issues ready for you.` : "Discover repos to start."}</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Link href="/discover" className="btn-touch inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium justify-center sm:justify-start"><Search className="w-4 h-4"/> Discover</Link>
            <Link href="/portfolio" className="btn-touch inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium justify-center sm:justify-start"><BookOpen className="w-4 h-4"/> Portfolio</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[{i:Code,v:portfolio?.public_repos||0,l:"Repos",c:"text-blue-400",bg:"bg-blue-500/5"},{i:Star,v:totalStars,l:"Stars",c:"text-yellow-400",bg:"bg-yellow-500/5"},{i:Users,v:portfolio?.followers||0,l:"Followers",c:"text-green-400",bg:"bg-green-500/5"},{i:Target,v:recs.length,l:"Picks",c:"text-purple-400",bg:"bg-purple-500/5"}].map((s,i)=><div key={i} className={`${s.bg} rounded-xl p-3 sm:p-4 border border-gray-800/50`}><s.i className={`w-4 h-4 sm:w-5 sm:h-5 ${s.c} mb-1.5 sm:mb-2.5`}/><p className="text-xl sm:text-2xl font-bold">{s.v}</p><p className="text-[10px] sm:text-xs text-gray-500">{s.l}</p></div>)}
        </div>

        <section>
          <div className="flex justify-between mb-4"><h2 className="text-base sm:text-lg font-bold"><Zap className="w-4 h-4 text-yellow-400 inline mr-1.5"/>Top Picks</h2><Link href="/discover" className="text-xs sm:text-sm text-purple-400">Browse →</Link></div>
          {recs.length===0?<div className="bg-[#111318] rounded-xl p-10 text-center border border-gray-800/50"><p className="text-gray-400 text-sm mb-4">No recommendations</p><Link href="/discover" className="btn-touch px-4 py-2 bg-purple-600 rounded-lg text-sm inline-flex">Browse Repos</Link></div>:recs.map((r,i)=><a key={i} href={r.url} target="_blank" className="group flex items-start gap-2 sm:gap-4 bg-[#111318] border border-gray-800/50 rounded-xl p-3 sm:p-4 hover:border-gray-600 transition-all mb-2"><div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i===0?"bg-yellow-500/10 text-yellow-400":i===1?"bg-gray-400/10 text-gray-300":"bg-gray-700/30 text-gray-500"}`}>#{i+1}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-xs text-gray-500 font-mono truncate">{r.repo}</span><span className="text-xs px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded-md">{r.estimated_hours}</span></div><h3 className="text-xs sm:text-sm font-medium group-hover:text-purple-400 line-clamp-2">{r.title}</h3><div className="flex items-center gap-3 mt-2 text-xs text-gray-500"><span>🔥 {r.difficulty_score}</span><span>🔀 {r.merge_chance}%</span><span className="ml-auto font-bold text-purple-400">{r.overall_score}/100</span></div></div></a>)}
        </section>
      </div>
    </div>
  )
}