"use client"

import { Component, ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-zinc-400 mb-6">{this.state.error?.message || "An unexpected error occurred"}</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-100">
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}