"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Star, Users, GitFork, ExternalLink, Sparkles, Layers, RefreshCw, AlertCircle } from "lucide-react"

const API = "http://localhost:8000"
const TIMEOUT = 8000

export default function PortfolioPage() {
  const { data: session } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeout, setTimeoutError] = useState(false)

  const fetchPortfolio = () => {
    setLoading(true)
    setError(null)
    setTimeoutError(false)

    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
      setTimeoutError(true)
      setLoading(false)
    }, TIMEOUT)

    fetch(`${API}/api/portfolio/BistaDinesh03`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`)
        return r.json()
      })
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === "AbortError") {
          setTimeoutError(true)
        } else {
          setError(err.message || "Failed to load portfolio")
        }
        setLoading(false)
      })
      .finally(() => {
        clearTimeout(timer)
        // FINALLY always runs — loading is guaranteed to be set false
      })
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  // LOADING — Skeleton only
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 animate-pulse">
          <div className="h-32 skeleton rounded-[20px]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-[20px]" />
            ))}
          </div>
          <div className="h-48 skeleton rounded-[24px]" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // TIMEOUT — Network too slow
  if (timeout) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-lg font-bold mb-2">Request timed out</h2>
          <p className="text-sm text-zinc-400 mb-6">The server took too long to respond. Check your connection and try again.</p>
          <button
            onClick={fetchPortfolio}
            className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  // ERROR — API failed
  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <ErrorDisplay
          type="api"
          message={error}
          onRetry={fetchPortfolio}
        />
      </div>
    )
  }

  // EMPTY — No data returned
  if (!data || !data.repositories || data.repositories.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-5">
            <GitFork className="w-7 h-7 text-zinc-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">No repositories found</h2>
          <p className="text-sm text-zinc-400 mb-6">Your GitHub repositories will appear here once connected.</p>
          <button
            onClick={fetchPortfolio}
            className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  // SUCCESS — Render portfolio
  const totalStars = data.repositories.reduce((s, r) => s + (r.stars || 0), 0)
  const languages = [...new Set(data.repositories.map(r => r.language).filter(Boolean))]

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        
        <div className="flex items-start gap-6 pb-8 border-b border-[#27272a]">
          {data.avatar && (
            <img src={data.avatar} alt="GitHub avatar" className="w-20 h-20 rounded-full ring-2 ring-[#27272a]" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{data.name || "Developer"}</h1>
            <p className="text-zinc-500">@{data.username}</p>
            <div className="flex items-center gap-5 mt-3 text-sm text-zinc-400">
              <span><b className="text-white">{data.followers || 0}</b> followers</span>
              <span><b className="text-white">{data.public_repos}</b> repos</span>
              <span><b className="text-white">{totalStars}</b> stars</span>
              <span><b className="text-white">{languages.length}</b> languages</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: GitFork, value: data.public_repos, label: "Repositories", color: "text-blue-400" },
            { icon: Star, value: totalStars, label: "Stars earned", color: "text-yellow-400" },
            { icon: Users, value: data.followers || 0, label: "Followers", color: "text-green-400" },
            { icon: Layers, value: languages.length, label: "Languages", color: "text-purple-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 text-center hover:border-zinc-600 transition-all duration-200">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-[24px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold">AI Summary</h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Based on {data.public_repos} repositories across {languages.length} languages.
            {languages.length > 0 ? ` Primary technologies include ${languages.slice(0, 3).join(", ")}.` : ""}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Repositories ({data.public_repos})</h2>
          <div className="space-y-2">
            {data.repositories.map(repo => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 sm:p-5 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-medium text-sm truncate group-hover:text-white transition-colors">
                    {repo.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stars || 0}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}