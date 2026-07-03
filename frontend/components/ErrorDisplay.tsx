"use client"

import { AlertCircle, Wifi, AlertTriangle, Shield, Search, RefreshCw } from "lucide-react"

interface ErrorDisplayProps {
  type?: "network" | "api" | "notfound" | "auth" | "generic"
  message?: string
  onRetry?: () => void
}

const errorConfig = {
  network: { icon: Wifi, title: "Connection Error", defaultMessage: "Unable to reach the server. Please check your internet connection." },
  api: { icon: AlertCircle, title: "Something went wrong", defaultMessage: "The server encountered an error. Please try again." },
  notfound: { icon: Search, title: "Not Found", defaultMessage: "The requested resource could not be found." },
  auth: { icon: Shield, title: "Authentication Required", defaultMessage: "Please sign in to access this feature." },
  generic: { icon: AlertTriangle, title: "Unexpected Error", defaultMessage: "An unexpected error occurred. Please try again." },
}

export function ErrorDisplay({ type = "generic", message, onRetry }: ErrorDisplayProps) {
  const config = errorConfig[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4 ring-1 ring-red-500/20">
        <Icon className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-200 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">{message || config.defaultMessage}</p>
      {onRetry && (
        <button onClick={onRetry} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  )
}

// Inline error banner (non-blocking)
export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <p className="text-sm text-red-300 flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-red-400 hover:text-red-300 font-medium flex-shrink-0">
          Retry
        </button>
      )}
    </div>
  )
}

// Empty state (not an error, but consistent)
export function EmptyState({ icon: Icon = Search, title, description, action }: { icon?: any; title: string; description?: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-700/30 flex items-center justify-center mb-4 ring-1 ring-gray-700/50">
        <Icon className="w-7 h-7 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-all duration-200">
          {action.label}
        </button>
      )}
    </div>
  )
}