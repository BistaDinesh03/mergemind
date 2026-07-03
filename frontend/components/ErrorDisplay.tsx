"use client"

import { AlertCircle, Wifi, Shield, Search, RefreshCw, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ErrorDisplayProps {
  type?: "network" | "timeout" | "notfound" | "auth" | "server" | "generic"
  message?: string
  onRetry?: () => void
}

const errorConfig = {
  network: {
    icon: Wifi,
    title: "Connection Error",
    defaultMessage: "Cannot reach the server. Check that the backend is running on port 8000.",
    hint: "Make sure Docker is running or start the backend manually."
  },
  timeout: {
    icon: AlertCircle,
    title: "Request Timed Out",
    defaultMessage: "The server took too long to respond. This happens when the AI model is warming up.",
    hint: "Ollama may be loading the model. Wait a few seconds and try again."
  },
  notfound: {
    icon: Search,
    title: "Not Found",
    defaultMessage: "The requested resource could not be found.",
    hint: "It may have been moved or deleted."
  },
  auth: {
    icon: Shield,
    title: "Authentication Required",
    defaultMessage: "Please sign in to access this feature.",
    hint: "Your session may have expired."
  },
  server: {
    icon: AlertCircle,
    title: "Server Error",
    defaultMessage: "Something went wrong on our end.",
    hint: "This is usually temporary. Try again in a moment."
  },
  generic: {
    icon: AlertCircle,
    title: "Something went wrong",
    defaultMessage: "An unexpected error occurred.",
    hint: "Try again or check the console for details."
  },
}

export function ErrorDisplay({ type = "generic", message, onRetry }: ErrorDisplayProps) {
  const config = errorConfig[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center animate-fadeIn">
      <div className="w-20 h-20 rounded-[20px] bg-red-500/5 border border-red-500/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-red-400" />
      </div>

      <h3 className="text-xl font-bold text-zinc-300 mb-2">{config.title}</h3>
      <p className="text-base text-zinc-500 max-w-md mb-3 leading-relaxed">
        {message || config.defaultMessage}
      </p>
      <p className="text-sm text-zinc-600 max-w-md mb-8">{config.hint}</p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="h-[44px] px-6 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <Link
          href="/"
          className="h-[44px] px-6 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 rounded-[14px] text-sm font-medium inline-flex items-center gap-2 border border-white/[0.06] transition-all duration-200"
        >
          Go Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// Inline error banner for non-blocking errors
export function ErrorBanner({ message, onRetry, onDismiss }: { message: string; onRetry?: () => void; onDismiss?: () => void }) {
  return (
    <div className="bg-red-500/5 border border-red-500/10 rounded-[14px] p-4 flex items-center gap-3 animate-fadeIn">
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