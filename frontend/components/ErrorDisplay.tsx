"use client"

import { AlertCircle, Wifi, Shield, Search, RefreshCw, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ErrorDisplayProps {
  type?: "network" | "timeout" | "notfound" | "auth" | "server" | "generic"
  message?: string
  onRetry?: () => void
}

const configs = {
  network: { icon: Wifi, title: "Connection Error", defaultMessage: "Cannot reach the server. Is it running?" },
  timeout: { icon: AlertCircle, title: "Request Timed Out", defaultMessage: "The server took too long to respond." },
  notfound: { icon: Search, title: "Not Found", defaultMessage: "This page does not exist." },
  auth: { icon: Shield, title: "Authentication Required", defaultMessage: "Please sign in to continue." },
  server: { icon: AlertCircle, title: "Server Error", defaultMessage: "Something went wrong. Please try again." },
  generic: { icon: AlertCircle, title: "Something went wrong", defaultMessage: "An unexpected error occurred." },
}

export function ErrorDisplay({ type = "generic", message, onRetry }: ErrorDisplayProps) {
  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{config.title}</h3>
      <p className="text-sm text-zinc-500 max-w-md mb-6">{message || config.defaultMessage}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button onClick={onRetry} className="h-10 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <Link href="/" className="h-10 px-5 bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-400 rounded-[14px] text-sm inline-flex items-center gap-2 transition-colors">
          Go Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}