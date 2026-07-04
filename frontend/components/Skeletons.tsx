"use client"

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-4">
        <img src="/loading.svg" alt="Loading" className="w-12 h-12 mx-auto" />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="h-16 border-b border-[#27272a]" />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="space-y-2"><div className="h-7 w-48 bg-white/[0.04] rounded-lg" /><div className="h-4 w-64 bg-white/[0.03] rounded-lg" /></div>
        <div className="h-40 bg-[#18181b] rounded-[20px]" />
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-24 bg-[#18181b] rounded-[20px]" />)}</div>
        <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-28 bg-[#18181b] rounded-[20px]" />)}</div>
      </div>
    </div>
  )
}

export function DiscoverSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="h-16 border-b border-[#27272a]" />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 animate-pulse">
        <div className="space-y-2"><div className="h-7 w-56 bg-white/[0.04] rounded-lg" /><div className="h-4 w-72 bg-white/[0.03] rounded-lg" /></div>
        <div className="h-[52px] bg-[#18181b] rounded-[14px]" />
        <div className="flex gap-2">{[...Array(6)].map((_,i)=><div key={i} className="h-9 w-20 bg-white/[0.04] rounded-[14px]" />)}</div>
        <div className="grid grid-cols-2 gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-72 bg-[#18181b] rounded-[20px]" />)}</div>
      </div>
    </div>
  )
}

export function RepoDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="h-16 border-b border-[#27272a]" />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="h-4 w-48 bg-white/[0.04] rounded" />
        <div className="bg-[#18181b] rounded-[24px] p-8 space-y-4">
          <div className="flex gap-4"><div className="w-16 h-16 bg-white/[0.04] rounded-full" /><div className="flex-1 space-y-2"><div className="h-6 w-64 bg-white/[0.04] rounded" /><div className="h-4 w-96 bg-white/[0.03] rounded" /></div></div>
        </div>
        <div className="space-y-3">{[...Array(5)].map((_,i)=><div key={i} className="h-20 bg-[#18181b] rounded-[20px]" />)}</div>
      </div>
    </div>
  )
}

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="h-16 border-b border-[#27272a]" />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-pulse">
        <div className="bg-[#18181b] rounded-[20px] p-8 flex gap-5"><div className="w-20 h-20 bg-white/[0.04] rounded-full" /><div className="space-y-2"><div className="h-6 w-32 bg-white/[0.04] rounded" /><div className="h-4 w-24 bg-white/[0.03] rounded" /></div></div>
        <div className="space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="h-16 bg-[#18181b] rounded-[20px]" />)}</div>
      </div>
    </div>
  )
}