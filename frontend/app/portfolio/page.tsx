"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { Star, Users, Code, AlertCircle, RefreshCw, GitFork } from "lucide-react"
import Link from "next/link"

const API = "http://localhost:8000"

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const name = session?.user?.name || "Developer"

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const users = [name, "BistaDinesh03", "BISUTA"]
      let d = null
      for (const u of users) {
        const r = await fetch(`${API}/api/portfolio/${u}`)
        if (r.ok) {
          const j = await r.json()
          if (j.public_repos > 0) { d = j; break }
        }
      }
      setData(d || { username: name, followers: 0, public_repos: 0, repositories: [] })
    } catch (e) {
      setError("Cannot connect to server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (status === "authenticated") load() }, [status, name])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-pulse">
          <div className="h-32 bg-[#18181b] rounded-[20px]" />
          <div className="space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="h-16 bg-[#18181b] rounded-[20px]" />)}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button onClick={load} className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <GitFork className="w-12 h-12 text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">Connect Your GitHub</h2>
          <p className="text-zinc-400 mb-6">Sign in to see your portfolio.</p>
          <Link href="/login" className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold">Sign in with GitHub</Link>
        </div>
      </div>
    )
  }

  const totalStars = data?.repositories?.reduce((s,r) => s+(r.stars||0), 0) || 0

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 sm:p-8">
          <div className="flex items-center gap-5">
            {data?.avatar && <img src={data.avatar} alt="" className="w-16 h-16 rounded-full ring-1 ring-[#27272a]" />}
            <div>
              <h1 className="text-xl font-bold">{data?.name || name}</h1>
              <p className="text-sm text-zinc-500">@{data?.username || name} · Connected to GitHub</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-zinc-400"><Users className="w-3.5 h-3.5 inline mr-1"/>{data?.followers||0} followers</span>
                <span className="text-sm text-zinc-400"><Code className="w-3.5 h-3.5 inline mr-1"/>{data?.public_repos||0} repos</span>
                <span className="text-sm text-zinc-400"><Star className="w-3.5 h-3.5 inline mr-1"/>{totalStars} stars</span>
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold">Repositories</h2>
        <div className="space-y-2">
          {(!data?.repositories || data.repositories.length === 0) ? (
            <div className="bg-[#18181b] rounded-[20px] p-10 text-center">
              <p className="text-zinc-400">No public repositories found</p>
            </div>
          ) : data.repositories.map(repo => (
            <a key={repo.name} href={repo.url} target="_blank" className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all">
              <p className="font-medium truncate">{repo.name}</p>
              <Star className="w-4 h-4 text-yellow-400"/>{repo.stars||0}
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}