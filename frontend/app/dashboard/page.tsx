"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { DashboardSkeleton } from "@/components/Skeletons"
import { EmptyState } from "@/components/EmptyState"
import { Sparkles, ArrowRight, Thermometer, Clock, GitMerge, Award, Github, AlertCircle, RefreshCw, Bookmark, CheckCircle, Eye, Save, Play } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [recommendation, setRecommendation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState({ viewed: 0, saved: 0, started: 0, completed: 0 })
  const username = session?.user?.login || session?.user?.name || null
  const isLoading = status === "loading" || loading

  const fetchRecommendation = () => {
    if (!username) return
    setLoading(true)
    setError(null)
    fetch(API + "/api/recommendations/top?limit=1")
      .then(r => r.json())
      .then(d => {
        if (d?.recommendations?.length > 0) {
          setRecommendation(d.recommendations[0])
        }
      })
      .catch(err => console.error("Recommendations error:", err))
      .finally(() => { setLoading(false); setHasLoaded(true) })
  }

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !username) {
      setLoading(false)
      setHasLoaded(true)
      return
    }
    fetchRecommendation()

    fetch(API + "/api/history/recommendations?limit=100")
      .then(r => r.json())
      .then(d => {
        const items = d?.history || []
        setProgress({
          viewed: items.filter((i: any) => i.was_viewed).length,
          saved: 0,
          started: items.filter((i: any) => i.was_clicked).length,
          completed: items.filter((i: any) => i.was_contributed).length,
        })
      })
      .catch(() => {})
  }, [status, username])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar /><DashboardSkeleton /></div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]"><Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Github className="w-10 h-10 text-zinc-600 mb-4" />
          <h2 className="text-lg font-bold mb-2">Sign in to see your dashboard</h2>
          <p className="text-sm text-zinc-400 mb-6">Connect your GitHub account to get personalized recommendations.</p>
          <button onClick={() => signIn("github")} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold hover:bg-zinc-200 transition-colors">
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-bold">What should you work on today?</h1>
          <p className="text-sm text-zinc-500 mt-1">@{username}</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Eye, label: "Viewed", value: progress.viewed, color: "text-zinc-400" },
            { icon: Save, label: "Saved", value: progress.saved, color: "text-yellow-400" },
            { icon: Play, label: "Started", value: progress.started, color: "text-blue-400" },
            { icon: CheckCircle, label: "Done", value: progress.completed, color: "text-green-400" },
          ].map(s => (
            <div key={s.label} className="bg-[#18181b] border border-[#27272a] rounded-[16px] p-4 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>

        {recommendation ? (
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Today's Best Pick</p>
              </div>
              <button onClick={fetchRecommendation} className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Show another
              </button>
            </div>
            <h2 className="text-xl font-bold mb-2">{recommendation.title}</h2>
            <p className="text-sm text-zinc-500 font-mono mb-4">{recommendation.repo}</p>
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-[14px] text-sm text-green-400">
                <Thermometer className="w-4 h-4 inline mr-2" />Easy
              </span>
              <span className="px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-[14px] text-sm text-blue-400">
                <GitMerge className="w-4 h-4 inline mr-2" />{recommendation.merge_chance || 88}%
              </span>
              <span className="px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-[14px] text-sm text-amber-400">
                <Clock className="w-4 h-4 inline mr-2" />{recommendation.estimated_hours || "1-2h"}
              </span>
              <span className="px-4 py-2 bg-purple-500/5 border border-purple-500/10 rounded-[14px] text-sm text-purple-400">
                <Award className="w-4 h-4 inline mr-2" />{recommendation.overall_score}/100
              </span>
            </div>
            <div className="flex gap-3">
              <Link href={`/repo/${recommendation.repo}/issues/${recommendation.issue_number}`} className="h-[48px] px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                <Play className="w-4 h-4" /> Start Contributing
              </Link>
              <button className="h-[48px] px-4 bg-[#18181b] border border-[#27272a] rounded-[14px] text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        ) : hasLoaded ? (
          <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
            <EmptyState 
              kind="recommendations"
              action={{ label: "Browse Issues", href: "/discover" }}
              secondaryAction={{ label: "Try Again", onClick: fetchRecommendation }}
            />
          </div>
        ) : null}

        <div className="text-center pt-4">
          <Link href="/discover" className="text-sm text-zinc-500 hover:text-purple-400 transition-colors">
            Browse all issues <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
      </main>
    </div>
  )
}