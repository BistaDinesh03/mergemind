"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  GitPullRequest, Star, TrendingUp, Clock, Target,
  Zap, BookOpen, ChevronRight, ExternalLink, Code
} from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { StatCard } from "@/components/ui/StatCard"
import { ScoreBadge } from "@/components/ui/ScoreBadge"
import { DashboardSkeleton } from "@/components/ui/Skeleton"

interface PlannerIssue {
  issue_id: number
  title: string
  repository: string
  opportunity_score: number
  estimated_hours: number
  difficulty: string
  skills_required: string[]
  url: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dailyPlan, setDailyPlan] = useState<PlannerIssue[]>([])
  const [availableTime, setAvailableTime] = useState(60)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setDailyPlan([
        {
          issue_id: 101,
          title: "Add error boundary to dashboard components",
          repository: "facebook/react",
          opportunity_score: 92,
          estimated_hours: 1.5,
          difficulty: "Easy",
          skills_required: ["React", "TypeScript"],
          url: "#",
        },
        {
          issue_id: 202,
          title: "Improve TypeScript types for API responses",
          repository: "vercel/next.js",
          opportunity_score: 85,
          estimated_hours: 2.0,
          difficulty: "Medium",
          skills_required: ["TypeScript", "API Design"],
          url: "#",
        },
        {
          issue_id: 303,
          title: "Write unit tests for utility functions",
          repository: "microsoft/vscode",
          opportunity_score: 78,
          estimated_hours: 3.0,
          difficulty: "Easy",
          skills_required: ["Testing", "JavaScript"],
          url: "#",
        },
      ])
      setLoading(false)
    }, 1500)
  }

  if (status === "loading" || loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || "Developer"}! ??
            </h1>
            <p className="text-gray-400">Here is your open source intelligence overview for today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={GitPullRequest}
              label="Total PRs Merged"
              value="12"
              color="text-emerald-400"
              trend="+3 this month"
            />
            <StatCard
              icon={Star}
              label="Repositories"
              value="5"
              color="text-yellow-400"
              trend="+2 new"
            />
            <StatCard
              icon={TrendingUp}
              label="Current Streak"
              value="4 days"
              color="text-blue-400"
              trend="Best: 12 days"
            />
            <StatCard
              icon={Target}
              label="Weekly Goal"
              value="60%"
              color="text-purple-400"
              trend="3/5 complete"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Best Opportunity - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Opportunity Card */}
              <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-emerald-900/40 rounded-xl p-8 border border-gray-700 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h2 className="text-2xl font-bold">Today's Best Opportunity</h2>
                    <p className="text-gray-400 text-sm">AI-picked based on your skills and goals</p>
                  </div>
                </div>

                {dailyPlan.length > 0 && (
                  <div className="bg-dark-800/60 rounded-lg p-6 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{dailyPlan[0].repository}</p>
                        <h3 className="text-xl font-semibold">{dailyPlan[0].title}</h3>
                      </div>
                      <ScoreBadge score={dailyPlan[0].opportunity_score} label="Match" size="lg" />
                    </div>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {dailyPlan[0].skills_required.map((skill) => (
                        <span key={skill} className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30">
                          {skill}
                        </span>
                      ))}
                      <span className="px-3 py-1 text-xs bg-emerald-600/20 text-emerald-400 rounded-full border border-emerald-600/30">
                        {dailyPlan[0].difficulty}
                      </span>
                      <span className="px-3 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full border border-purple-600/30">
                        ~{dailyPlan[0].estimated_hours}h
                      </span>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">
                      Start Contributing
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Daily Planner */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-semibold">Your Daily Plan</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Time available:</span>
                    <select
                      value={availableTime}
                      onChange={(e) => setAvailableTime(Number(e.target.value))}
                      className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={240}>4 hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {dailyPlan.map((issue, index) => (
                    <div
                      key={issue.issue_id}
                      className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 truncate">{issue.repository}</p>
                        <p className="font-medium truncate group-hover:text-blue-400 transition-colors">
                          {issue.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">~{issue.estimated_hours}h</span>
                        <ScoreBadge score={issue.opportunity_score} label="" size="sm" />
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>

                {dailyPlan.length > 0 && (
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                      Total: ~{dailyPlan.reduce((sum, i) => sum + i.estimated_hours, 0).toFixed(1)} hours
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                      View all recommendations
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Skills Gained */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold">Skills Gained</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Python", "Docker", "API Design", "Testing"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs bg-dark-800 border border-gray-700 rounded-full text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: Search, label: "Discover Issues", color: "text-blue-400" },
                    { icon: GitPullRequest, label: "View My PRs", color: "text-emerald-400" },
                    { icon: BookOpen, label: "Learning Resources", color: "text-purple-400" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
                    >
                      <action.icon className={w-5 h-5 } />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contribution Calendar Mini */}
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3">This Week</h3>
                <div className="grid grid-cols-7 gap-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xs text-gray-500">{day}</span>
                      <div
                        className={w-full h-6 rounded mt-1 }
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  4 contributions this week
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
