"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Compass,
  GitPullRequest,
  Briefcase,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "My Contributions", href: "/contributions", icon: GitPullRequest },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "AI Assistant", href: "/assistant", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 min-h-screen bg-dark-900 border-r border-gray-800">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-bold gradient-text">MergeMind</span>
        </Link>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={lex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all }
              >
                <item.icon className={w-5 h-5 } />
                {item.name}
                {item.name === "AI Assistant" && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-purple-600/30 text-purple-400 rounded-full">
                    New
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom stats */}
      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Weekly Progress</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">3/5 contributions this week</p>
        </div>
      </div>
    </aside>
  )
}
