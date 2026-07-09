"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Sparkles, ArrowRight, Thermometer, Clock, GitMerge, Award, Github, AlertCircle, RefreshCw } from "lucide-react"

const API = "http://localhost:8000"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [topIssue, setTopIssue] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const username = session?.user?.name || null

  useEffect(() => {
    if (status !== "authenticated" || !username) return
    setLoading(true)
    setError(null)
    fetch(API + "/api/recommendations/top?limit=1")
      .then(r => r.json())
      .then(d => { if (d?.recommendations?.length > 0) setTopIssue(d.recommendations[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch(API + "/api/portfolio/" + username)
      .then(r => r.json())
      .then(d => {
        if (d && d.public_repos !== undefined) {
          setStats({
            repos: d.public_repos,
            stars: d.repositories?.reduce((s, r) => s + (r.stars || 0), 0) || 0,
            followers: d.followers || 0,
            avatar: d.avatar,
            name: d.name || username
          })
        }
      })
      .catch(() => {})
  }, [status, username])

  const extractLink = (issue) => {
    if (!issue?.repo) return "#"
    const parts = issue.repo.split("/")
    return "/repo/" + parts[0] + "/" + parts[1] + "/issues/" + (issue.issue_number || "1")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="h-80 skeleton rounded-[24px]" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <Github className="w-10 h-10 text-zinc-600 mb-4" />
          <h2 className="text-lg font-bold mb-2">Sign in required</h2>
          <p className="text-sm text-zinc-400 mb-6">Connect your GitHub account to see your dashboard.</p>
          <button onClick={() => signIn("github")} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold">
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <p className="text-sm text-zinc-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        {stats && (
          <div className="flex items-center gap-3">
            {stats.avatar && <img src={stats.avatar} alt="" className="w-9 h-9 rounded-full ring-1 ring-[#27272a]" />}
            <div>
              <h1 className="text-xl font-bold">Good morning, {stats.name} 👋</h1>
              <p className="text-sm text-zinc-500">{stats.repos} repos · {stats.followers} followers</p>
            </div>
          </div>
        )}

        {topIssue && (
          <div className="bg-[#18181b] border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <p className="text-xs font-semibold text-purple-300 uppercase">Today is Best Pick</p>
            </div>
            <h2 className="text-xl font-bold mb-2">{topIssue.title}</h2>
            <p className="text-sm text-zinc-500 font-mono mb-4">{topIssue.repo}</p>
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-[14px] text-sm text-green-400">
                <Thermometer className="w-4 h-4 inline mr-2" />Easy
              </span>
              <span className="px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-[14px] text-sm text-blue-400">
                <GitMerge className="w-4 h-4 inline mr-2" />{topIssue.merge_chance || 88}%
              </span>
              <span className="px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-[14px] text-sm text-amber-400">
                <Clock className="w-4 h-4 inline mr-2" />{topIssue.estimated_hours || "1-2h"}
              </span>
              <span className="px-4 py-2 bg-purple-500/5 border border-purple-500/10 rounded-[14px] text-sm text-purple-400">
                <Award className="w-4 h-4 inline mr-2" />{topIssue.overall_score}/100
              </span>
            </div>
            <Link href={extractLink(topIssue)} className="h-[48px] px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2">
              View AI Breakdown <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}