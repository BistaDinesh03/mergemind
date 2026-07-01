import { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  color?: string
  trend?: string
}

export function StatCard({ icon: Icon, label, value, color = "text-blue-400", trend }: StatCardProps) {
  return (
    <div className="glass-card p-6 hover:border-gray-600 transition-all animate-fadeIn">
      <Icon className={w-8 h-8  mb-3} />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
      {trend && (
        <p className="text-xs text-emerald-400 mt-2">? {trend}</p>
      )}
    </div>
  )
}
