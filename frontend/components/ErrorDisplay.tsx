"use client"
import { AlertCircle, Wifi, Shield, Search, RefreshCw, ArrowRight } from "lucide-react"
import Link from "next/link"

const configs = {
  network: { icon: Wifi, title: "Connection Error", message: "Cannot reach the server. Is it running?" },
  timeout: { icon: AlertCircle, title: "Request Timed Out", message: "The server took too long to respond." },
  notfound: { icon: Search, title: "Not Found", message: "The requested resource could not be found." },
  auth: { icon: Shield, title: "Authentication Required", message: "Please sign in to continue." },
  api: { icon: AlertCircle, title: "Something went wrong", message: "An unexpected error occurred." },
}

export function ErrorDisplay({ type = "api", message, onRetry }) {
  const config = configs[type] || configs.api
  const Icon = config.icon
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-[20px] bg-red-500/5 border border-red-500/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-zinc-300 mb-2">{config.title}</h3>
      <p className="text-base text-zinc-500 max-w-md mb-8">{message || config.message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <button onClick={onRetry} className="h-[44px] px-6 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <Link href="/" className="h-[44px] px-6 bg-[#18181b] border border-[#27272a] text-zinc-400 rounded-[14px] text-sm inline-flex items-center gap-2">
          Go Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}