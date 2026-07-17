export function RepoCardSkeleton() {
  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-[#27272a] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#27272a] rounded w-3/4" />
          <div className="h-3 bg-[#27272a] rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-[#27272a] rounded w-full" />
        <div className="h-4 bg-[#27272a] rounded w-2/3" />
      </div>
      <div className="flex gap-3 pt-3 border-t border-[#27272a]">
        <div className="h-3 bg-[#27272a] rounded w-12" />
        <div className="h-3 bg-[#27272a] rounded w-12" />
        <div className="h-3 bg-[#27272a] rounded w-8 ml-auto" />
      </div>
    </div>
  )
}

export function IssuesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 animate-pulse">
          <div className="h-5 bg-[#27272a] rounded w-3/4 mb-3" />
          <div className="h-4 bg-[#27272a] rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex items-start gap-6 pb-8 border-b border-[#27272a]">
        <div className="w-20 h-20 bg-[#27272a] rounded-full" />
        <div className="space-y-3 flex-1">
          <div className="h-7 bg-[#27272a] rounded w-48" />
          <div className="h-4 bg-[#27272a] rounded w-32" />
          <div className="flex gap-5">
            <div className="h-4 bg-[#27272a] rounded w-20" />
            <div className="h-4 bg-[#27272a] rounded w-16" />
            <div className="h-4 bg-[#27272a] rounded w-16" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5">
            <div className="w-5 h-5 bg-[#27272a] rounded mx-auto mb-2" />
            <div className="h-8 bg-[#27272a] rounded w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#27272a] rounded-[20px]" />
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-10 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#27272a] rounded-full" />
        <div className="space-y-2">
          <div className="h-6 bg-[#27272a] rounded w-40" />
          <div className="h-4 bg-[#27272a] rounded w-24" />
        </div>
      </div>
      <div className="bg-[#18181b] border border-purple-500/20 rounded-[24px] p-8">
        <div className="h-4 bg-[#27272a] rounded w-32 mb-4" />
        <div className="h-6 bg-[#27272a] rounded w-3/4 mb-2" />
        <div className="h-4 bg-[#27272a] rounded w-1/2 mb-6" />
        <div className="flex gap-3 mb-6">
          <div className="h-10 bg-[#27272a] rounded-[14px] w-20" />
          <div className="h-10 bg-[#27272a] rounded-[14px] w-20" />
          <div className="h-10 bg-[#27272a] rounded-[14px] w-20" />
        </div>
        <div className="h-12 bg-[#27272a] rounded-[14px] w-40" />
      </div>
    </div>
  )
}

export function RepoDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 animate-pulse">
      <div className="h-4 bg-[#27272a] rounded w-48" />
      <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-[#27272a] rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-[#27272a] rounded w-64" />
            <div className="h-4 bg-[#27272a] rounded w-full" />
            <div className="flex gap-2">
              <div className="h-6 bg-[#27272a] rounded-full w-16" />
              <div className="h-6 bg-[#27272a] rounded-full w-20" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#27272a]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-16 bg-[#27272a] rounded-[14px]" />
          ))}
        </div>
      </div>
    </div>
  )
}