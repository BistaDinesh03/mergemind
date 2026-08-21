"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { PortfolioSkeleton } from "@/components/Skeletons"
import { EmptyState } from "@/components/EmptyState"
import { fetchWithCache } from "@/lib/api"
import Link from "next/link"
import { 
  Github, Star, Users, GitFork, ExternalLink, 
  MapPin, Building2, Link2, ArrowUpRight,
  CheckCircle, Trophy, Globe, Target, Code, GitMerge
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
  const [progress, setProgress] = useState({ viewed: 0, saved: 0, started: 0, completed: 0, merged_prs: 0, open_prs: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const username = session?.user?.login || session?.user?.name || null

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !username) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    // Fetch portfolio FIRST — public endpoint, works without session
    fetchWithCache(`${API}/api/portfolio/${username}`)
      .then(d => {
        if (d?.error) throw new Error(d.error)
        setData(d)
      })
      .catch(err => {
        console.error("[Portfolio] Failed to load:", err.message)
        setError(err.message || "Could not load portfolio")
      })
      .finally(() => setLoading(false))
    
    // Fetch progress SEPARATELY — may fail due to cross-origin session, don't block portfolio
    fetchWithCache(`${API}/api/history/progress`)
      .then(d => {
        if (d?.progress) setProgress(d.progress)
      })
      .catch(err => {
        console.warn("[Portfolio] Progress unavailable:", err.message)
      })
  }, [status, username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12"><PortfolioSkeleton /></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <Github className="w-16 h-16 text-zinc-500 mb-6" />
          <h1 className="text-2xl font-bold mb-3">Sign in to view your portfolio</h1>
          <p className="text-zinc-400 mb-8">Connect GitHub to see your developer profile.</p>
          <button onClick={() => signIn("github")} className="h-12 px-8 bg-white text-zinc-900 rounded-[14px] font-semibold hover:bg-zinc-200 transition-colors">
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex items-center justify-center py-32">
          <EmptyState 
            kind="error" 
            title="Could not load portfolio" 
            description={error || "An unexpected error occurred"} 
            action={{ label: "Try Again", onClick: () => window.location.reload() }} 
          />
        </div>
      </div>
    )
  }

  const repos = data.repositories || []
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))]
  const totalStars = repos.reduce((s: number, r: any) => s + (r.stars || 0), 0)
  const contributions = data.contributions || {}

  return (
    <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-fadeIn">
        
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img src={data.avatar || ""} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            className="w-24 h-24 rounded-full ring-2 ring-[#27272a] flex-shrink-0 bg-[#18181b]" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{data.name || username}</h1>
            <p className="text-zinc-500 text-lg">@{data.username || username}</p>
            {data.bio && <p className="text-zinc-400 mt-3 max-w-lg">{data.bio}</p>}
            <div className="flex items-center gap-3 mt-4">
              <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="h-10 px-5 bg-[#18181b] border border-[#27272a] rounded-[12px] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
                <Github className="w-4 h-4" /> GitHub Profile <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <section className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-[24px] p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" /> Contribution Journey
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { icon: Target, label: "Viewed", value: progress.viewed, color: "text-zinc-400" },
              { icon: Code, label: "Started", value: progress.started, color: "text-blue-400" },
              { icon: GitMerge, label: "Open PRs", value: progress.open_prs, color: "text-yellow-400" },
              { icon: CheckCircle, label: "Merged PRs", value: progress.merged_prs, color: "text-green-400" },
            ].map(stat => (
              <div key={stat.label} className="bg-[#18181b] border border-[#27272a] rounded-[16px] p-4 text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {progress.merged_prs === 0 && progress.open_prs === 0 && (
            <p className="text-sm text-zinc-500">
              No merged contributions yet. Start through <Link href="/discover" className="text-purple-400 hover:text-purple-300">Discover</Link> — your PRs will appear here automatically.
            </p>
          )}
          
          {progress.merged_prs > 0 && (
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {progress.merged_prs} merged PR{progress.merged_prs > 1 ? "s" : ""} — proof of your open source work!
            </p>
          )}
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: GitFork, label: "Repositories", value: data.public_repos || 0, color: "text-blue-400" },
            { icon: Star, label: "Total Stars", value: totalStars, color: "text-yellow-400" },
            { icon: Users, label: "Followers", value: data.followers || 0, color: "text-green-400" },
            { icon: Globe, label: "Languages", value: languages.length, color: "text-purple-400" },
          ].map(a => (
            <div key={a.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 text-center hover:border-zinc-600 transition-all">
              <a.icon className={`w-6 h-6 ${a.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{a.value.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-1">{a.label}</p>
            </div>
          ))}
        </div>

        {languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {languages.slice(0, 10).map((lang: any) => (
                <span key={lang} className="px-4 py-2 bg-[#18181b] border border-[#27272a] rounded-full text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition-all">
                  {lang}
                </span>
              ))}
            </div>
          </section>
        )}

        {repos.length > 0 ? (
          <section>
            <h2 className="text-lg font-bold mb-4">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {repos.slice(0, 6).map((repo: any) => (
                <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-purple-400 transition-colors">{repo.name}</h3>
                    <ExternalLink className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {repo.description && <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{repo.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-zinc-600">
                    {repo.language && (
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" />{repo.language}</span>
                    )}
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{repo.stars || 0}</span>
                    {repo.forks > 0 && <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <EmptyState 
              kind="portfolio" 
              title="No repositories found" 
              description="Your GitHub repositories will appear here once they're public." 
              action={{ label: "Browse Issues", href: "/discover" }} 
            />
          </section>
        )}

      </main>
    </div>
  )
}