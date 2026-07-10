'use client'

import { AlertCircle, RefreshCw } from "lucide-react"

type ErrorType = "timeout" | "network" | "notfound" | "auth" | "server" | "api" | "generic"

interface ErrorDisplayProps {
  type?: ErrorType
  message?: string
  onRetry?: () => void
}

const errorConfig: Record<ErrorType, { title: string; icon: any }> = {
  timeout: { title: "Request Timeout", icon: AlertCircle },
  network: { title: "Network Error", icon: AlertCircle },
  notfound: { title: "Not Found", icon: AlertCircle },
  auth: { title: "Authentication Error", icon: AlertCircle },
  server: { title: "Server Error", icon: AlertCircle },
  api: { title: "API Error", icon: AlertCircle },
  generic: { title: "Something went wrong", icon: AlertCircle },
}

export function ErrorDisplay({ type = "generic", message, onRetry }: ErrorDisplayProps) {
  const config = errorConfig[type] || errorConfig.generic
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Icon className="w-12 h-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{config.title}</h3>
      <p className="text-sm text-zinc-400 text-center mb-6 max-w-md">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  )
}