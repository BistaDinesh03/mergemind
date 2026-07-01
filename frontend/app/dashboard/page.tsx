"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { GitPullRequest, Star, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-dark-900 border-r border-gray-800 p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text mb-8">
            MergeMind
          </h2>
          <nav className="space-y-2">
            {["Dashboard", "Discover", "My Contributions", "Portfolio", "Settings"].map((item) => (
              <a key={item} href="#" className="block px-4 py-2 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || "Developer"}!
            </h1>
            <p className="text-gray-400">Here is your open source intelligence overview</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: GitPullRequest, label: "Total PRs", value: "0", color: "text-blue-400" },
              { icon: Star, label: "Repositories", value: "0", color: "text-yellow-400" },
              { icon: TrendingUp, label: "Current Streak", value: "0 days", color: "text-green-400" },
              { icon: Clock, label: "This Week", value: "0 hrs", color: "text-purple-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-dark-800 rounded-xl p-6 border border-gray-700">
                <stat.icon className={w-8 h-8  mb-3} />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-emerald-900/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Today's Best Opportunity</h2>
            <p className="text-gray-400">Connect your GitHub account and start discovering issues.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
