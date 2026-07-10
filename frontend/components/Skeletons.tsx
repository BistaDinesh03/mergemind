export function RepoCardSkeleton() {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[16px] p-5 animate-pulse">
      <div className="h-5 bg-[#27272a] rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-[#27272a] rounded w-full mb-2"></div>
      <div className="h-4 bg-[#27272a] rounded w-1/2"></div>
    </div>
  )
}

export function IssuesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[16px] p-5 animate-pulse">
          <div className="h-5 bg-[#27272a] rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-[#27272a] rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#27272a] rounded-full"></div>
        <div>
          <div className="h-6 bg-[#27272a] rounded w-40 mb-2"></div>
          <div className="h-4 bg-[#27272a] rounded w-24"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#27272a] rounded-[16px]"></div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#27272a] rounded-full"></div>
        <div>
          <div className="h-5 bg-[#27272a] rounded w-32 mb-1"></div>
          <div className="h-4 bg-[#27272a] rounded w-24"></div>
        </div>
      </div>
      <div className="h-48 bg-[#27272a] rounded-[24px]"></div>
    </div>
  )
}