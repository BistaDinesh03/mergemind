"use client"

// Base skeleton pulse
function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-700/40 rounded-lg ${className}`} />
}

// Repository card skeleton
export function RepoCardSkeleton() {
  return (
    <div className="bg-[#111318] border border-gray-800/50 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <SkeletonPulse className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonPulse className="h-4 w-3/4" />
          <SkeletonPulse className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-2/3" />
      <div className="flex gap-3">
        <SkeletonPulse className="h-3 w-16" />
        <SkeletonPulse className="h-3 w-16" />
        <SkeletonPulse className="h-3 w-12" />
      </div>
    </div>
  )
}

// Dashboard stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-[#111318] border border-gray-800/50 rounded-xl p-4 space-y-2">
      <SkeletonPulse className="w-5 h-5" />
      <SkeletonPulse className="h-8 w-16" />
      <SkeletonPulse className="h-3 w-20" />
    </div>
  )
}

// Recommendation card skeleton
export function RecCardSkeleton({ index }: { index: number }) {
  return (
    <div className="flex items-start gap-4 bg-[#111318] border border-gray-800/50 rounded-xl p-4">
      <SkeletonPulse className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-3 w-32" />
        <SkeletonPulse className="h-4 w-3/4" />
        <div className="flex gap-3">
          <SkeletonPulse className="h-3 w-12" />
          <SkeletonPulse className="h-3 w-12" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// Issue card skeleton
export function IssueCardSkeleton() {
  return (
    <div className="flex items-start gap-3 bg-[#111318] border border-gray-800/50 rounded-xl p-4">
      <SkeletonPulse className="w-8 h-5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <div className="flex gap-2">
          <SkeletonPulse className="h-5 w-16 rounded-full" />
          <SkeletonPulse className="h-5 w-20 rounded-full" />
        </div>
      </div>
      <SkeletonPulse className="w-12 h-4 flex-shrink-0" />
    </div>
  )
}

// Repo detail header skeleton
export function RepoDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-[#111318] border border-gray-800/50 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <SkeletonPulse className="w-14 h-14 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonPulse className="h-6 w-48" />
            <SkeletonPulse className="h-4 w-96" />
            <div className="flex gap-2 mt-2">
              <SkeletonPulse className="h-6 w-16 rounded-full" />
              <SkeletonPulse className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4 border-t border-gray-800/50">
          <SkeletonPulse className="h-4 w-20" />
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-4 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#111318] border border-gray-800/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between"><SkeletonPulse className="h-4 w-24" /><SkeletonPulse className="h-6 w-10" /></div>
              <SkeletonPulse className="h-2 w-full" />
              <SkeletonPulse className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <SkeletonPulse className="h-48 rounded-xl" />
      </div>
    </div>
  )
}

// Portfolio skeleton
export function PortfolioSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-[#111318] border border-gray-800/50 rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <SkeletonPulse className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <SkeletonPulse className="h-6 w-32" />
            <SkeletonPulse className="h-4 w-24" />
            <div className="flex gap-3 mt-2">
              <SkeletonPulse className="h-4 w-20" />
              <SkeletonPulse className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#111318] border border-gray-800/50 rounded-xl p-4 flex justify-between">
            <div className="space-y-2 flex-1"><SkeletonPulse className="h-4 w-48" /><SkeletonPulse className="h-3 w-32" /></div>
            <SkeletonPulse className="w-12 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Full page loader
export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

// Dashboard full skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <div className="h-14 border-b border-gray-800/50" />
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <SkeletonPulse className="h-24 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between"><SkeletonPulse className="h-6 w-32" /><SkeletonPulse className="h-4 w-20" /></div>
          {[...Array(5)].map((_, i) => <RecCardSkeleton key={i} index={i} />)}
        </div>
      </div>
    </div>
  )
}

// Discover page skeleton
export function DiscoverSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <div className="h-14 border-b border-gray-800/50" />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="space-y-2"><SkeletonPulse className="h-8 w-48" /><SkeletonPulse className="h-4 w-64" /></div>
        <div className="flex gap-4"><SkeletonPulse className="h-12 flex-1 rounded-xl" /><SkeletonPulse className="h-12 w-40 rounded-xl" /></div>
        <div className="flex gap-2">{[...Array(9)].map((_, i) => <SkeletonPulse key={i} className="h-8 w-20 rounded-lg" />)}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(6)].map((_, i) => <RepoCardSkeleton key={i} />)}</div>
      </div>
    </div>
  )
}

// Issues page skeleton
export function IssuesSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <div className="h-14 border-b border-gray-800/50" />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <SkeletonPulse className="h-4 w-64" />
        <div className="flex gap-3">
          <SkeletonPulse className="h-10 flex-1 rounded-lg" />
          <SkeletonPulse className="h-10 w-40 rounded-lg" />
          <SkeletonPulse className="h-10 w-24 rounded-lg" />
        </div>
        <div className="space-y-2">{[...Array(8)].map((_, i) => <IssueCardSkeleton key={i} />)}</div>
      </div>
    </div>
  )
}