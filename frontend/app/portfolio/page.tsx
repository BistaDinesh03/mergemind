"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { PortfolioSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Star, ExternalLink, Users, Code } from "lucide-react"

export default function PortfolioPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const username = session?.user?.name || "BistaDinesh03"

  const fetchData = () => {
    setLoading(true); setError("")
    fetch("http://localhost:8000/api/portfolio/"+username)
      .then(r => { if(!r.ok) throw new Error(); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError("Failed to load"); setLoading(false) })
  }

  useEffect(() => { fetchData() }, [username])
  if (loading) return <PortfolioSkeleton />
  if (error) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><ErrorDisplay type="api" message={error} onRetry={fetchData} /></div>

  const totalStars = data?.repositories?.reduce((s:number,r:any)=>s+r.stars,0)||0

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4 sm:space-y-6">
        <div className="bg-[#111318] rounded-2xl p-4 sm:p-6 border border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
            {data?.avatar && <img src={data.avatar} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-purple-500/20" />}
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{data?.name || username}</h1>
              <p className="text-gray-400 text-xs sm:text-sm">@{username}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-2 sm:mt-3 flex-wrap">
                <span className="text-[10px] sm:text-xs text-gray-400"><Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1"/>{data?.followers||0} followers</span>
                <span className="text-[10px] sm:text-xs text-gray-400"><Code className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1"/>{data?.public_repos||0} repos</span>
                <span className="text-[10px] sm:text-xs text-gray-400"><Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1"/>{totalStars} stars</span>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-base sm:text-lg font-bold">Repositories</h2>
        <div className="space-y-1.5 sm:space-y-2">
          {data?.repositories?.map((repo:any) => (
            <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between bg-[#111318] border border-gray-800/50 rounded-xl p-3 sm:p-4 hover:border-gray-600 hover:bg-[#151820] transition-all duration-200 group">
              <div className="min-w-0 flex-1 mr-3">
                <p className="font-medium text-xs sm:text-sm truncate">{repo.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">{repo.description||"No description"}</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"/>{repo.stars}
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:text-gray-300 transition-colors"/>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}