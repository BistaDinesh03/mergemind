"use client"

import { Activity, Users, Wrench, BookOpen, TrendingUp, AlertTriangle } from "lucide-react"

interface HealthCategory {
  score: number
  label: string
  icon: string
  reasons: string[]
}

interface HealthProps {
  health: {
    overall: number
    status: string
    categories: Record<string, HealthCategory>
    summary: string[]
    recommendations: string[]
  }
}

const iconMap: Record<string, any> = {
  activity: Activity,
  community: Users,
  maintenance: Wrench,
  documentation: BookOpen
}

function ProgressBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  )
}

function CategoryCard({ category }: { category: HealthCategory }) {
  const Icon = iconMap[category.icon] || Activity
  const color = category.score >= 70 ? "text-green-400" : category.score >= 50 ? "text-yellow-400" : "text-red-400"
  
  return (
    <div className="bg-[#1a1a2e] rounded-lg p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium">{category.label}</span>
        </div>
        <span className={`text-lg font-bold ${color}`}>{category.score}</span>
      </div>
      <ProgressBar score={category.score} />
      <div className="mt-2 space-y-1">
        {category.reasons.map((reason, i) => (
          <p key={i} className="text-xs text-gray-400">• {reason}</p>
        ))}
      </div>
    </div>
  )
}

export function HealthCards({ health }: HealthProps) {
  if (!health) return null

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Repository Health
          </h3>
          <div className="text-right">
            <span className="text-3xl font-bold text-purple-400">{health.overall}</span>
            <span className="text-gray-400 text-sm">/100</span>
          </div>
        </div>
        
        <ProgressBar score={health.overall} />
        
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
          health.status === "Excellent" ? "bg-green-500/20 text-green-400" :
          health.status === "Good" ? "bg-blue-500/20 text-blue-400" :
          health.status === "Fair" ? "bg-yellow-500/20 text-yellow-400" :
          "bg-red-500/20 text-red-400"
        }`}>
          {health.status}
        </span>

        {/* Summary */}
        {health.summary?.length > 0 && (
          <div className="mt-3 space-y-1">
            {health.summary.map((s, i) => (
              <p key={i} className="text-sm text-gray-300">✅ {s}</p>
            ))}
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {health.categories && Object.entries(health.categories).map(([key, cat]) => (
          <CategoryCard key={key} category={cat} />
        ))}
      </div>

      {/* Recommendations */}
      {health.recommendations?.length > 0 && (
        <div className="bg-[#111118] rounded-xl p-4 border border-yellow-500/20">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Recommendations
          </h4>
          {health.recommendations.map((rec, i) => (
            <p key={i} className="text-xs text-gray-400">• {rec}</p>
          ))}
        </div>
      )}
    </div>
  )
}