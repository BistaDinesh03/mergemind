interface ScoreBadgeProps {
  score: number
  label: string
  size?: "sm" | "md" | "lg"
}

export function ScoreBadge({ score, label, size = "md" }: ScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    if (score >= 60) return "text-blue-400 bg-blue-400/10 border-blue-400/30"
    if (score >= 40) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
    return "text-red-400 bg-red-400/10 border-red-400/30"
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  }

  return (
    <div className={inline-flex items-center gap-2 border rounded-lg  }>
      <span className="font-bold">{Math.round(score)}</span>
      <span className="opacity-75">{label}</span>
    </div>
  )
}
