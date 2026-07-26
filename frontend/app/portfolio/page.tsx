"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { PortfolioSkeleton } from "@/components/Skeletons"
import { EmptyState } from "@/components/EmptyState"
import { 
  Github, Star, Users, GitFork, ExternalLink, 
  MapPin, Building2, Link2, ArrowUpRight,
  CheckCircle, Trophy, Globe
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<any>(null)
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
    fetch(API + "/api/portfolio/" + username)
      .then(r => {
        if (!r.ok) throw new Error("Failed to load portfolio")
        return r.json()
      })
      .then(d => {
        if (d?.error) throw new Error(d.error)
        setData(d)
      })
      .catch(err => setError(err.message || "Failed to load portfolio"))
      .finally(() => setLoading(false))
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
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-6">
            <Github className="w-8 h-8 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Sign in to view your portfolio</h1>
          <p className="text-zinc-400 mb-8">Connect your GitHub account to see your developer profile.</p>
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
          <EmptyState kind="error" title="Could not load portfolio" description={error || ""} action={{ label: "Try Again", onClick: () => window.location.reload() }} />
        </div>
      </div>
    )
  }

  const repos = data.repositories || []
  const languages = [...new Set(repos.map((r: any) => r.language).filter(Boolean))]
  const totalStars = repos.reduce((s: number, r: any) => s + (r.stars || 0), 0)

  const achievements = [
    { icon: GitFork, label: "Repositories", value: data.public_repos || 0, color: "text-blue-400" },
    { icon: Star, label: "Total Stars", value: totalStars, color: "text-yellow-400" },
    { icon: Users, label: "Followers", value: data.followers || 0, color: "text-green-400" },
    { icon: Globe, label: "Languages", value: languages.length, color: "text-purple-400" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-fadeIn">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img 
            src={data.avatar || ""} 
            alt="" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            className="w-24 h-24 rounded-full ring-2 ring-[#27272a] flex-shrink-0 bg-[#18181b]" 
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{data.name || username}</h1>
            <p className="text-zinc-500 text-lg">@{data.username || username}</p>
            {data.bio && <p className="text-zinc-400 mt-3 max-w-lg">{data.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-zinc-500">
              {data.company && <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{data.company}</span>}
              {data.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{data.location}</span>}
              {data.blog && <a href={data.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"><Link2 className="w-4 h-4" />{data.blog.replace("https://", "")}</a>}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="h-10 px-5 bg-[#18181b] border border-[#27272a] rounded-[12px] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
                <Github className="w-4 h-4" /> GitHub Profile <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map(a => (
            <div key={a.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 text-center hover:border-zinc-600 transition-all">
              <a.icon className={`w-6 h-6 ${a.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{a.value.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-1">{a.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
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

        {/* Featured Projects */}
        {repos.length > 0 && (
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
                  {repo.description && (
                    <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-zinc-600">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />{repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{repo.stars || 0}</span>
                    {repo.forks > 0 && <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks}</span>}
                  </div>
                </a>
              ))}
            </div>
            {repos.length > 6 && (
              <a href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noopener noreferrer"
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1">
                View all {repos.length} repositories <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </section>
        )}

        {/* Journey Milestones */}
        <section>
          <h2 className="text-lg font-bold mb-4">Open Source Journey</h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, label: "Joined GitHub", date: data.created_at ? new Date(data.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "Unknown", done: true },
              { icon: data.public_repos > 0 ? CheckCircle : CheckCircle, label: "Created First Repository", date: data.public_repos > 0 ? `${data.public_repos} repositories` : "Not yet", done: data.public_repos > 0 },
              { icon: CheckCircle, label: "Opened First Pull Request", date: "Start contributing", done: false },
              { icon: Trophy, label: "First Merged PR", date: "Complete a contribution", done: false },
            ].map((milestone, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-[16px] ${milestone.done ? "bg-[#18181b] border border-[#27272a]" : "bg-[#18181b]/50 border border-[#27272a]/50"}`}>
                <milestone.icon className={`w-5 h-5 flex-shrink-0 ${milestone.done ? "text-green-400" : "text-zinc-600"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${milestone.done ? "text-zinc-200" : "text-zinc-500"}`}>{milestone.label}</p>
                  <p className="text-xs text-zinc-600">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}