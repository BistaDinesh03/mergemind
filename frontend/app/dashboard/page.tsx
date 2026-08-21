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
  RefreshCw, Bookmark, Play, CheckCircle, Compass, 
  FolderGit2, Loader2, Target, ChevronDown, TrendingUp,
  Circle
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
  issue_github_id: 0,
  estimated_hours: "30m",
  overall_score: 95,
  merge_chance: 98,
  url: "https://github.com/firstcontributions/first-contributions",
  labels: ["good first issue", "documentation"],
  match_reasons: ["Perfect first contribution", "No coding required"],
  matched_frameworks: [],
  score_breakdown: {},
  reason: "The perfect first pull request."
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [recommendation, setRecommendation] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [backendWaking, setBackendWaking] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [progress, setProgress] = useState({ viewed: 0, saved: 0, started: 0, completed: 0, merged_prs: 0, open_prs: 0 })
  const username = session?.user?.login || session?.user?.name || null
  const isLoading = status === "loading" || loading

  const fetchRecommendation = async (showLoader = true) => {
    if (!username) return
    if (showLoader) setRefreshing(true)
    setLoading(true)
    setBackendWaking(false)
    
    const backendUp = await waitForBackend()
    if (!backendUp) {
      setRecommendation(FALLBACK_ISSUE)
      setLoading(false)
      setRefreshing(false)
      return
    }
    
    try {
      const [recData, progressData] = await Promise.all([
        fetchWithCache(`${API}/api/recommendations/top?limit=1`),
        fetchWithCache(`${API}/api/history/progress`)
      ])
      
      if (recData?.recommendations?.length > 0) {
        setRecommendation(recData.recommendations[0])
        setSaved(false)
      } else {
        setRecommendation(FALLBACK_ISSUE)
      }
      
      if (progressData?.progress) {
        setProgress(progressData.progress)
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

  const handleSave = async () => {
    if (!recommendation?.issue_github_id && recommendation?.issue_number !== 1) return
    if (saved) {
      setSaved(false)
      setSaveMessage("Removed from saved")
    } else {
      setSaved(true)
      setSaveMessage("Saved for later! ✓")
    }
    setTimeout(() => setSaveMessage(""), 2000)
    try {
      const ghId = recommendation.issue_github_id || recommendation.issue_number
      const endpoint = saved ? "unsave" : "save"
      await fetch(`${API}/api/history/recommendations/${ghId}/${endpoint}`, { method: "POST" })
    } catch {}
  }

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !username) {
      setLoading(false)
      return
    }
    fetchRecommendation(false)
  }, [status, username])

  if (backendWaking) return <BackendWaking />

  if (isLoading && !refreshing) {
    return <div className="min-h-screen bg-[#09090b]"><Navbar /><DashboardSkeleton /></div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <Github className="w-16 h-16 text-zinc-500 mb-6" />
          <h1 className="text-2xl font-bold mb-3">Sign in to get started</h1>
          <p className="text-zinc-400 mb-8">Connect GitHub to get personalized issue recommendations.</p>
          <button onClick={() => signIn("github")} className="h-12 px-8 bg-white text-zinc-900 rounded-[14px] font-semibold hover:bg-zinc-200 transition-colors">
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  const greeting = getGreeting()
  const timeAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000) : null
  const hasAnyProgress = progress.viewed > 0 || progress.started > 0 || progress.merged_prs > 0

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
                      <p className="font-semibold">{recommendation.verdict || "Your next contribution"}</p>
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
                  <button onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a2e] border border-[#27272a] rounded-full text-sm text-zinc-400 hover:text-white transition-colors">
                    <TrendingUp className="w-3.5 h-3.5" /> Why this score
                    <ChevronDown className={`w-3 h-3 transition-transform ${showScoreBreakdown ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {showScoreBreakdown && recommendation.score_breakdown && Object.keys(recommendation.score_breakdown).length > 0 && (
                  <div className="mb-5 p-4 bg-[#18181b]/50 border border-[#27272a] rounded-[14px] animate-fadeIn">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Opportunity Score Breakdown</p>
                    <div className="space-y-2">
                      {Object.values(recommendation.score_breakdown).map((factor: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 w-32 flex-shrink-0">{factor.label}</span>
                          <div className="flex-1 h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${factor.score >= 80 ? "bg-green-500" : factor.score >= 60 ? "bg-blue-500" : "bg-yellow-500"}`} style={{ width: `${factor.score}%` }} />
                          </div>
                          <span className="text-xs font-medium w-8 text-right flex-shrink-0">{factor.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendation.match_reasons && recommendation.match_reasons.length > 0 && (
                  <div className="mb-5 p-4 bg-[#18181b]/50 border border-[#27272a] rounded-[14px]">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-purple-400" /> Why this matches you
                    </p>
                    <div className="space-y-1.5">
                      {recommendation.match_reasons.slice(0, 5).map((reason: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mb-4">
                  <Link href={`/repo/${recommendation.repo}/issues/${recommendation.issue_number}`}
                    className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                    <Play className="w-4 h-4" /> Start Contributing
                  </Link>
                  <button onClick={handleSave}
                    className={`h-11 px-4 border rounded-[14px] text-sm transition-colors inline-flex items-center gap-2 ${
                      saved ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:border-zinc-600"
                    }`}>
                    <Bookmark className="w-4 h-4" /> {saved ? "Saved" : "Save"}
                  </button>
                </div>

                {saveMessage && <p className="text-xs text-green-400 mb-3">{saveMessage}</p>}
                {timeAgo !== null && <p className="text-xs text-zinc-600">Last updated: {timeAgo === 0 ? "just now" : `${timeAgo} min ago`}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Contribution Journey — NEW */}
        {hasAnyProgress && (
          <section className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Your Journey
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Viewed", value: progress.viewed, done: progress.viewed > 0 },
                { label: "Started", value: progress.started, done: progress.started > 0 },
                { label: "Open PRs", value: progress.open_prs, done: progress.open_prs > 0 },
                { label: "Merged", value: progress.merged_prs, done: progress.merged_prs > 0 },
                { label: "Completed", value: progress.completed, done: progress.completed > 0 },
              ].map(stage => (
                <div key={stage.label} className={`text-center p-4 rounded-[16px] ${stage.done ? "bg-green-500/5 border border-green-500/20" : "bg-[#1a1a2e] border border-[#27272a]"}`}>
                  {stage.done ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
                  )}
                  <p className="text-xl font-bold">{stage.value}</p>
                  <p className="text-xs text-zinc-500">{stage.label}</p>
                </div>
              ))}
            </div>
            {progress.merged_prs > 0 && (
              <p className="text-sm text-green-400 mt-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> You have {progress.merged_prs} merged PR{progress.merged_prs > 1 ? "s" : ""}! 🎉
              </p>
            )}
          </section>
        )}

        {/* Quick Actions */}
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