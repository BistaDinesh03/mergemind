"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { GitPullRequest, Star, TrendingUp, Target, Zap, Search, MessageSquare, BookOpen, Code, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">MergeMind</Link>
        <div className="flex items-center gap-4">
          <Link href="/discover" className="text-gray-300 hover:text-white text-sm">Discover</Link>
          <Link href="/assistant" className="text-gray-300 hover:text-white text-sm">AI Chat</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || "Developer"}! 👋</h1>
          <p className="text-gray-400 mt-1">Your open source contribution dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: GitPullRequest, label: "Merged PRs", value: "18", color: "text-green-400", bg: "bg-green-400/10" },
            { icon: Star, label: "Repositories", value: "7", color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: TrendingUp, label: "Streak", value: "5 days", color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Target, label: "Weekly Goal", value: "2/3", color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 border border-gray-700/50`}>
              <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Tip */}
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold">Quick Tip</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Start with repos labeled <span className="text-green-400">good first issue</span>. 
              Read CONTRIBUTING.md before coding. Keep PRs small and focused. 
              Ask questions in issues - maintainers appreciate communication!
            </p>
            <Link href="/assistant" className="inline-flex items-center gap-2 mt-4 text-sm text-purple-400 hover:text-purple-300">
              Ask AI for more tips <MessageSquare className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#111118] rounded-xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Search, label: "Discover Issues", url: "/discover", color: "text-blue-400" },
                { icon: MessageSquare, label: "AI Assistant", url: "/assistant", color: "text-purple-400" },
                { icon: BookOpen, label: "Portfolio", url: "/portfolio", color: "text-green-400" },
                { icon: Code, label: "Contributions", url: "/contributions", color: "text-yellow-400" },
              ].map((a, i) => (
                <Link key={i} href={a.url} className="flex items-center gap-3 px-4 py-3 bg-[#1a1a2e] hover:bg-gray-700 rounded-lg transition-all text-sm">
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                  {a.label}
                  <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#111118] rounded-xl p-6 border border-gray-800">
          <h3 className="font-semibold mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["Python", "TypeScript", "React", "Docker", "Git", "API Design", "Testing", "CI/CD"].map(skill => (
              <span key={skill} className="px-3 py-1.5 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/30">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}