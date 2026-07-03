"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { Star, ExternalLink, Users, Code, Loader2 } from "lucide-react"

export default function PortfolioPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const username = session?.user?.name || "BistaDinesh03"

  useEffect(() => {
    document.title = "Portfolio — MergeMind"
    fetch(`http://localhost:8000/api/portfolio/${username}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [username])

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
    </div>
  )

  const totalStars = data?.repositories?.reduce((s:number,r:any)=>s+r.stars,0)||0

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-6">
        <div className="bg-[#18181b] border border-white/[0.04] rounded-[20px] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            {data?.avatar && <img src={data.avatar} alt={username} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-1 ring-white/[0.06]" />}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{data?.name || username}</h1>
              <p className="text-sm text-zinc-500">@{username}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 flex-wrap">
                <span className="text-xs sm:text-sm text-zinc-400"><Users className="w-3.5 h-3.5 inline mr-1" />{data?.followers||0} followers</span>
                <span className="text-xs sm:text-sm text-zinc-400"><Code className="w-3.5 h-3.5 inline mr-1" />{data?.public_repos||0} repos</span>
                <span className="text-xs sm:text-sm text-zinc-400"><Star className="w-3.5 h-3.5 inline mr-1" />{totalStars} stars</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold">Repositories</h2>
        <div className="space-y-2">
          {data?.repositories?.map((repo:any) => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between bg-[#18181b] border border-white/[0.04] rounded-[20px] p-4 sm:p-5 hover:border-white/[0.08] transition-all duration-200 group">
              <div className="min-w-0 flex-1 mr-4">
                <p className="font-medium text-sm sm:text-base truncate">{repo.name}</p>
                <p className="text-xs sm:text-sm text-zinc-500 truncate mt-0.5">{repo.description||"No description"}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-400" />{repo.stars}
                <ExternalLink className="w-3.5 h-3.5 group-hover:text-zinc-300 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}