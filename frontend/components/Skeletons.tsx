"use client"

// Base skeleton with shimmer
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[14px] bg-white/[0.03] animate-pulse ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
    </div>
  )
}

// ─── DASHBOARD SKELETON ───
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Navbar skeleton */}
      <div className="h-16 border-b border-white/[0.04]" />
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 space-y-10 animate-fadeIn">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* KPI Cards — 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-3">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Recommendation cards — exact content shape */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6">
              <div className="flex items-start gap-5">
                {/* Rank badge */}
                <Skeleton className="w-10 h-10 rounded-[14px] flex-shrink-0" />
                
                <div className="flex-1 space-y-3">
                  {/* Meta row */}
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  {/* Title */}
                  <Skeleton className="h-5 w-3/4" />
                  {/* AI Reason */}
                  <Skeleton className="h-4 w-2/3" />
                  {/* Score bars */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" /></div>
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" /></div>
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" /></div>
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  </div>
                </div>

                {/* Score badge */}
                <Skeleton className="w-[72px] h-[72px] rounded-[20px] flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-5" />
              </div>
            ))}
          </div>
          <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-2 h-2 rounded-full mt-2" />
                <div className="space-y-1 flex-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div>
              </div>
            ))}
          </div>
          <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-4">
            <Skeleton className="h-4 w-24" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DISCOVER SKELETON ───
export function DiscoverSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-fadeIn">
      <div className="h-16 border-b border-white/[0.04]" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-[52px] w-full rounded-[14px]" />
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-[14px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="w-14 h-14 rounded-[14px]" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/[0.04]">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── REPO DETAIL SKELETON ───
export function RepoDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-fadeIn">
      <div className="h-16 border-b border-white/[0.04]" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 space-y-8">
        <Skeleton className="h-4 w-64" />
        
        {/* Repo header */}
        <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8 space-y-4">
          <div className="flex items-start gap-5">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-96" />
              <div className="flex gap-2"><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-20 rounded-full" /></div>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-4 border-t border-white/[0.04]">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
          </div>
        </div>

        {/* Health + Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Health score */}
            <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8 space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center gap-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-[20px]" />)}
              </div>
            </div>
            
            {/* Issues */}
            <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8 space-y-3">
              <div className="flex justify-between"><Skeleton className="h-6 w-32" /><Skeleton className="h-9 w-28 rounded-[14px]" /></div>
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          </div>
          
          <div className="space-y-5">
            <Skeleton className="h-48 w-full rounded-[20px]" />
            <Skeleton className="h-40 w-full rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PORTFOLIO SKELETON ───
export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-fadeIn">
      <div className="h-16 border-b border-white/[0.04]" />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-6">
        <div className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-3"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /></div>
            </div>
          </div>
        </div>
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-5 flex justify-between">
              <div className="space-y-2 flex-1"><Skeleton className="h-5 w-48" /><Skeleton className="h-4 w-32" /></div>
              <Skeleton className="w-12 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ISSUES LIST SKELETON ───
export function IssuesSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-fadeIn">
      <div className="h-16 border-b border-white/[0.04]" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 space-y-6">
        <Skeleton className="h-4 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-[52px] flex-1 rounded-[14px]" />
          <Skeleton className="h-[52px] w-40 rounded-[14px]" />
          <Skeleton className="h-[52px] w-24 rounded-[14px]" />
        </div>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#18181b] border border-white/[0.06] rounded-[20px] p-4 flex items-center gap-3">
              <Skeleton className="w-8 h-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div>
              </div>
              <Skeleton className="w-12 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FULL PAGE LOADER ───
export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center animate-fadeIn">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  )
}