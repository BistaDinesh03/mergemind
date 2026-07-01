"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Github, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 max-w-3xl">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* GitHub Connection */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Github className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">GitHub Connection</h2>
              </div>
              {session ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {session.user?.image && (
                      <img src={session.user.image} alt="" className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-gray-400">Connected</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs bg-emerald-600/20 text-emerald-400 rounded-full border border-emerald-600/30">
                    Active
                  </span>
                </div>
              ) : (
                <button className="btn-secondary">
                  Connect GitHub Account
                </button>
              )}
            </div>

            {/* Preferences */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Preferences</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Skill Level</p>
                    <p className="text-sm text-gray-400">Your experience level for issue matching</p>
                  </div>
                  <select className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Goal</p>
                    <p className="text-sm text-gray-400">Contributions per week target</p>
                  </div>
                  <select className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option>3 contributions</option>
                    <option>5 contributions</option>
                    <option>10 contributions</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "New issue matches", enabled: true },
                  { label: "PR status updates", enabled: true },
                  { label: "Weekly digest", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between">
                    <span className="text-sm">{notif.label}</span>
                    <button
                      className={w-10 h-6 rounded-full transition-colors }
                    >
                      <div
                        className={w-4 h-4 rounded-full bg-white transition-transform }
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
