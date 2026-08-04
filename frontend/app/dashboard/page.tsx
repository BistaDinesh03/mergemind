"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { DashboardSkeleton } from "@/components/Skeletons"
import { BackendWaking } from "@/components/BackendWaking"
import { fetchWithCache, waitForBackend } from "@/lib/api"
import { 
  Sparkles, ArrowRight, Clock, GitMerge, Award, Github, 
  RefreshCw, Bookmark, Play, CheckCircle, Users, Zap, 
  Compass, FolderGit2, Loader2
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return "Good morning"
  if (hour >= 12 && hour < 17) return "Good afternoon"
  return "Good evening"
}

const FALLBACK_ISSUE = {
  title: "Update README with contribution guidelines",
  repo: "firstcontributions/first-contributions",
  issue_number: 1,
  estimated_hours: "30m",
  overall_score: 95,
  merge_chance: 98,
  url: "https://github.com/firstcontributions/first-contributions",
  labels: ["good first issue", "documentation"],
  reason: "The perfect first pull request — add your name to the contributors list. No coding required, takes less than 30 minutes."
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [recommendation, setRecommendation] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [backendWaking, setBackendWaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const username = session?.user?.login || session?.user?.name || null
  const isLoading = status === "loading" || loading

  const fetchRecommendation = async (showLoader = true) => {
    if (!username) return
    if (showLoader) setRefreshing(true)
    setLoading(true)
    setError(null)
    setBackendWaking(false)
    
    const backendUp = await waitForBackend()
    if (!backendUp) {
      setRecommendation(FALLBACK_ISSUE)
      setLoading(false)
      setRefreshing(false)
      return
    }
    
    try {
      const data = await fetchWithCache(`${API}/api/recommendations/top?limit=1`)
      if (data?.recommendations?.length > 0) {
        setRecommendation(data.recommendations[0])
      } else {
        setRecommendation(FALLBACK_ISSUE)
      }
      setLastUpdated(new Date())
    } catch {
      setRecommendation(FALLBACK_ISSUE)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !username) {
      setLoading(false)
      return
    }
    fetchRecommendation(false)
  }, [status, username])

  if (backendWaking) {
    return <BackendWaking />
  }

  if (isLoading && !refreshing) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar /><DashboardSkeleton /></div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-6">
            <Github className="w-8 h-8 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Sign in to get started</h1>
          <p className="text-zinc-400 mb-8 max-w-md">Connect your GitHub account to get personalized issue recommendations.</p>
          <button onClick={() => signIn("github")} className="h-12 px-8 bg-white text-zinc-900 rounded-[14px] font-semibold text-base hover:bg-zinc-200 transition-colors">
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  const greeting = getGreeting()
  const timeAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
    : null

  return (
    <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
        
        <div>
          <p className="text-sm text-zinc-500 mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold tracking-tight">@{username}</h1>
        </div>

        <div className="space-y-4">
          {refreshing && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-500">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              Finding the best issue for you...
            </div>
          )}

          {recommendation && !refreshing && (
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5 border border-purple-500/10 rounded-[24px] p-6">
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Your next contribution</p>
                      <p className="text-sm text-zinc-500">AI-matched to your skills</p>
                    </div>
                  </div>
                  <button onClick={() => fetchRecommendation(true)} disabled={refreshing}
                    className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50">
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Find Another
                  </button>
                </div>

                <h2 className="text-2xl font-bold mb-2">{recommendation.title}</h2>
                <p className="text-zinc-500 font-mono text-sm mb-5">{recommendation.repo}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Beginner
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                    <Clock className="w-3.5 h-3.5" /> {recommendation.estimated_hours || "1-2h"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-sm font-medium">
                    <Award className="w-3.5 h-3.5" /> {recommendation.overall_score || 90}/100
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">
                    <GitMerge className="w-3.5 h-3.5" /> {recommendation.merge_chance || 90}% merge
                  </span>
                </div>

                {recommendation.reason && (
                  <div className="flex items-start gap-2 mb-5 p-3 bg-purple-500/5 border border-purple-500/10 rounded-[14px]">
                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-400 leading-relaxed">{recommendation.reason}</p>
                  </div>
                )}

                <div className="flex gap-3 mb-4">
                  <Link href={recommendation.url && recommendation.url.includes("github.com") && !recommendation.url.includes("/issues/")
                    ? recommendation.url
                    : `/repo/${recommendation.repo}/issues/${recommendation.issue_number}`}
                    className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                    <Play className="w-4 h-4" /> Start Contributing
                  </Link>
                  <button className="h-11 px-4 bg-[#18181b] border border-[#27272a] rounded-[14px] text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors inline-flex items-center gap-2">
                    <Bookmark className="w-4 h-4" /> Save
                  </button>
                </div>

                {timeAgo !== null && (
                  <p className="text-xs text-zinc-600">Last updated: {timeAgo === 0 ? "just now" : `${timeAgo} min ago`}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {recommendation && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: CheckCircle, label: "Beginner Friendly", color: "text-green-400" },
              { icon: Users, label: "Active Maintainers", color: "text-blue-400" },
              { icon: Zap, label: "Small Change", color: "text-amber-400" },
              { icon: GitMerge, label: "High Merge Rate", color: "text-purple-400" },
            ].map(item => (
              <div key={item.label} className="bg-[#18181b] border border-[#27272a] rounded-[16px] p-4 text-center hover:border-zinc-600 transition-all">
                <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
                <p className="text-xs text-zinc-400">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Compass, label: "Browse Issues", href: "/discover", color: "text-purple-400" },
            { icon: Bookmark, label: "Saved Issues", href: "/dashboard", color: "text-yellow-400" },
            { icon: FolderGit2, label: "Portfolio", href: "/portfolio", color: "text-blue-400" },
            { icon: Github, label: "GitHub Profile", href: `https://github.com/${username}`, color: "text-zinc-400", external: true },
          ].map(action => (
            action.external ? (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer"
                className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all group text-center">
                <action.icon className={`w-6 h-6 ${action.color} mx-auto mb-3`} />
                <p className="text-sm font-medium">{action.label}</p>
              </a>
            ) : (
              <Link key={action.label} href={action.href}
                className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all group text-center">
                <action.icon className={`w-6 h-6 ${action.color} mx-auto mb-3`} />
                <p className="text-sm font-medium">{action.label}</p>
              </Link>
            )
          ))}
        </div>

        <div className="text-center">
          <Link href="/discover" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Browse all issues <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>

      </main>
    </div>
  )
}