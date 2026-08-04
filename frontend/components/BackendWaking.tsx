"use client"

import { Loader2, Server } from "lucide-react"

export function BackendWaking() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto mb-6">
          <Server className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold mb-3">Starting the server...</h2>
        <p className="text-sm text-zinc-400 mb-4">
          The backend is waking up from sleep mode. This may take up to a minute on the free hosting plan.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          Retrying every 5 seconds...
        </div>
      </div>
    </div>
  )
}