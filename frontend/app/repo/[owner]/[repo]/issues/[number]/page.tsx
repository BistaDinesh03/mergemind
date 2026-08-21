"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, ChevronRight, Loader2, AlertCircle, 
  Terminal, CheckCircle, Clock, BarChart3, Sparkles,
  Copy, Check, Play, GitMerge, FolderGit2
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function ContributionGuidePage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const issueNumber = params?.number as string
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slowLoading, setSlowLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!owner || !repo || !issueNumber) return
    
    setLoading(true)
    setSlowLoading(false)
    setError(null)
    
    const slowTimer = setTimeout(() => setSlowLoading(true), 5000)
    const timeoutController = new AbortController()
    const timeoutTimer = setTimeout(() => timeoutController.abort(), 25000)
    
    fetch(`${API}/api/github/repositories/${owner}/${repo}/issues/${issueNumber}/guide`, {
      signal: timeoutController.signal
    })
      .then(r => {
        if (!r.ok) {
          if (r.status === 404) {
            throw new Error("This issue or repository may have been closed or removed.")
          }
          throw new Error(`Server returned ${r.status}`)
        }
        return r.json()
      })
      .then(d => {
        setGuide(d)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === "AbortError") {
          console.error("[Contribute] Request timed out after 25s")
          setError("The server is taking too long to respond. It may be waking up — please try again.")
        } else if (err.message.includes("closed or removed")) {
          console.warn("[Contribute] Issue/repo not found:", err.message)
          setError("This issue or repository may have been closed or removed. Try browsing other issues instead.")
        } else {
          console.error("[Contribute] Failed to load guide:", err.message)
          setError(err.message || "Could not load the contribution guide")
        }
        setLoading(false)
      })
      .finally(() => {
        clearTimeout(slowTimer)
        clearTimeout(timeoutTimer)
      })
    
    return () => {
      clearTimeout(slowTimer)
      clearTimeout(timeoutTimer)
      timeoutController.abort()
    }
  }, [owner, repo, issueNumber])

  const copyCommand = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNum)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const toggleStep = (step: number) => {
    if (completedSteps.includes(step)) {
      setCompletedSteps(completedSteps.filter(s => s !== step))
    } else {
      setCompletedSteps([...completedSteps, step])
      if (step >= currentStep) setCurrentStep(step + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center px-6">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">Loading contribution guide...</h2>
          {slowLoading && (
            <p className="text-sm text-zinc-400">
              This is taking longer than expected. The backend may be waking up — this can take up to a minute.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <h1 className="text-xl font-bold mb-2">Could not load the contribution guide</h1>
          <p className="text-zinc-400 mb-6 max-w-md">{error || "An unexpected error occurred"}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => window.location.reload()} className="h-10 px-6 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold hover:bg-zinc-200 transition-colors">
              Try Again
            </button>
            <Link href="/discover" className="h-10 px-6 bg-[#18181b] border border-[#27272a] rounded-[14px] text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center justify-center">
              Browse Other Issues
            </Link>
            <Link href={`/repo/${owner}/${repo}`} className="h-10 px-6 bg-[#18181b] border border-[#27272a] rounded-[14px] text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center justify-center">
              Back to Repository
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const g = guide.guide || {}
  const repoSetup = guide.repo_setup || {}
  const relatedPRs = guide.related_prs || []
  const steps = g.steps || []
  const totalSteps = steps.length || 8
  const progressPercent = steps.length > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0

  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <GitMerge className="w-10 h-10 text-zinc-600 mb-4" />
          <h1 className="text-xl font-bold mb-2">No contribution guide available</h1>
          <p className="text-zinc-400 mb-6 max-w-md">
            {guide.ai_summary || "This issue may have been closed or the repository doesn't have a contribution guide."}
          </p>
          <Link href="/discover" className="h-10 px-6 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold hover:bg-zinc-200 transition-colors inline-flex items-center justify-center">
            Browse Other Issues
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 flex-wrap">
          <Link href="/discover" className="hover:text-zinc-300">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-zinc-300">{owner}/{repo}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-medium">Issue #{issueNumber}</span>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-6">
          <h1 className="text-2xl font-bold mb-2">{guide.issue?.title || "Issue"}</h1>
          <p className="text-zinc-400 mb-4">{guide.repository}#{guide.issue?.number}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.issue?.labels?.map((l: string) => (
              <span key={l} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full">{l}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="text-green-400"><Clock className="w-4 h-4 inline mr-1" />{g.estimated_time || "Unknown"}</span>
            <span className="text-blue-400"><BarChart3 className="w-4 h-4 inline mr-1" />{g.difficulty || "Unknown"}</span>
          </div>
        </div>

        {guide.ai_summary && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" /> What You Need to Do</h2>
            <p className="text-zinc-400 leading-relaxed">{guide.ai_summary}</p>
          </div>
        )}

        {repoSetup && (repoSetup.package_manager || repoSetup.has_contributing || repoSetup.has_docker) && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FolderGit2 className="w-5 h-5 text-blue-400" /> Repository Setup</h2>
            <div className="space-y-2">
              {repoSetup.package_manager && (
                <p className="text-sm text-zinc-400"><span className="text-zinc-500">Package Manager:</span> {repoSetup.package_manager}</p>
              )}
              {repoSetup.has_contributing && (
                <p className="text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> CONTRIBUTING.md found</p>
              )}
              {repoSetup.has_docker && (
                <p className="text-sm text-blue-400">🐳 Docker support available</p>
              )}
            </div>
          </div>
        )}

        {relatedPRs.length > 0 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><GitMerge className="w-5 h-5 text-green-400" /> Similar Merged PRs</h2>
            <div className="space-y-2">
              {relatedPRs.map((pr: any) => (
                <a key={pr.number} href={pr.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-[#1a1a2e] border border-[#27272a] rounded-[14px] p-4 hover:border-zinc-600">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-300 font-medium">#{pr.number} {pr.title}</p>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Merged by @{pr.author}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Contribution Progress</h2>
            <span className="text-purple-400 font-medium">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-zinc-500 mt-3">Step {Math.min(currentStep, totalSteps)} of {totalSteps}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-5 h-5 text-green-400" /> Step-by-Step Guide</h2>
          {steps.map((step: any) => {
            const isCompleted = completedSteps.includes(step.step)
            const isCurrent = step.step === currentStep
            return (
              <div key={step.step} onClick={() => toggleStep(step.step)}
                className={`relative bg-[#18181b] border rounded-[20px] p-5 transition-all cursor-pointer ${
                  isCompleted ? "border-green-500/30 bg-green-500/5" : isCurrent ? "border-purple-500/30" : "border-[#27272a] hover:border-zinc-600"
                }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-green-500/20" : isCurrent ? "bg-purple-500/20" : "bg-[#27272a]"}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Play className="w-4 h-4 text-purple-400 ml-0.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${isCompleted ? "text-green-400" : ""}`}>{step.title}</h3>
                    <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
                    {step.command && (
                      <div className="relative">
                        <pre className="bg-[#09090b] rounded-[14px] p-4 text-sm text-green-400 font-mono overflow-x-auto">{step.command}</pre>
                        <button onClick={(e) => { e.stopPropagation(); copyCommand(step.command, step.step) }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46]">
                          {copiedStep === step.step ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                        </button>
                      </div>
                    )}
                    {step.commands && step.commands.map((cmd: string, i: number) => (
                      <div key={i} className="relative mb-2">
                        <pre className="bg-[#09090b] rounded-[14px] p-4 text-sm text-green-400 font-mono overflow-x-auto">{cmd}</pre>
                        <button onClick={(e) => { e.stopPropagation(); copyCommand(cmd, step.step * 100 + i) }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46]">
                          {copiedStep === step.step * 100 + i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                        </button>
                      </div>
                    ))}
                    {step.files_to_edit && (
                      <div className="mt-3">
                        <p className="text-xs text-zinc-500 mb-1">Likely files:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {step.files_to_edit.map((f: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-full">{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {g.pull_request_checklist && g.pull_request_checklist.length > 0 && (
          <div className="bg-[#18181b] border border-green-500/20 rounded-[20px] p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> PR Checklist</h2>
            <div className="space-y-2">
              {g.pull_request_checklist.map((item: string, i: number) => (
                <p key={i} className="text-sm text-zinc-400 flex items-center gap-2"><span className="text-green-400">✓</span> {item}</p>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pb-8">
          <a href={guide.issue?.url || `https://github.com/${owner}/${repo}/issues/${issueNumber}`} target="_blank" rel="noopener noreferrer" 
            className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
            Open on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </main>
    </div>
  )
}