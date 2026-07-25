"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, ChevronRight, Loader2, AlertCircle, 
  GitFork, GitBranch, Terminal, CheckCircle, 
  Clock, BarChart3, FileCode, Sparkles, ArrowRight,
  Copy, Check
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function ContributionGuidePage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const issueNumber = params?.number as string
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  useEffect(() => {
    if (!owner || !repo || !issueNumber) return
    setLoading(true)
    fetch(`${API}/api/github/repositories/${owner}/${repo}/issues/${issueNumber}/guide`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to load contribution guide")
        return r.json()
      })
      .then(d => setGuide(d))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [owner, repo, issueNumber])

  const copyCommand = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepNum)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <p className="text-zinc-400">{error || "Failed to load guide"}</p>
          <Link href={`/repo/${owner}/${repo}`} className="mt-4 text-sm text-purple-400 hover:text-purple-300">← Back to Repository</Link>
        </div>
      </div>
    )
  }

  const g = guide.guide
  const scoring = guide.scoring

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 flex-wrap">
          <Link href="/discover" className="hover:text-zinc-300">Discover</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-zinc-300">{owner}/{repo}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">Issue #{issueNumber}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-medium">Contribution Guide</span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Contribution Guide</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{guide.issue.title}</h1>
          <p className="text-zinc-400 mb-4">
            <a href={guide.issue.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors inline-flex items-center gap-1">
              {guide.repository}#{guide.issue.number} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {guide.issue.labels?.map((l: string) => (
              <span key={l} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">{l}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-green-400"><Clock className="w-4 h-4" /> {g.estimated_time}</span>
            <span className="flex items-center gap-1.5 text-blue-400"><BarChart3 className="w-4 h-4" /> {g.difficulty}</span>
            <span className="flex items-center gap-1.5 text-yellow-400"><FileCode className="w-4 h-4" /> {guide.repository}</span>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> AI Summary
          </h2>
          <p className="text-zinc-400 leading-relaxed">{guide.ai_summary}</p>
        </div>

        {/* Scoring */}
        {scoring && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(scoring.factors || {}).map(([key, factor]: [string, any]) => (
              <div key={key} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">{factor.score}</p>
                <p className="text-xs text-zinc-500 mt-1">{factor.label}</p>
                <p className="text-[10px] text-zinc-600 mt-1">{factor.weight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Step-by-Step Guide */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" /> Step-by-Step Guide
          </h2>
          
          {g.steps?.map((step: any) => (
            <div key={step.step} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-purple-400">{step.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
                  
                  {step.command && (
                    <div className="relative">
                      <pre className="bg-[#09090b] rounded-[14px] p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                        {step.command}
                      </pre>
                      <button
                        onClick={() => copyCommand(step.command, step.step)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                      >
                        {copiedStep === step.step ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                      </button>
                    </div>
                  )}
                  
                  {step.commands && step.commands.map((cmd: string, i: number) => (
                    <div key={i} className="relative mb-2">
                      <pre className="bg-[#09090b] rounded-[14px] p-4 text-sm text-green-400 font-mono overflow-x-auto">{cmd}</pre>
                      <button
                        onClick={() => copyCommand(cmd, step.step * 100 + i)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                      >
                        {copiedStep === step.step * 100 + i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                      </button>
                    </div>
                  ))}
                  
                  {step.files_to_edit && (
                    <div className="mt-3">
                      <p className="text-xs text-zinc-500 mb-1">Likely files to edit:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {step.files_to_edit.map((f: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 text-xs bg-blue-500/5 text-blue-300 rounded-full border border-blue-500/10">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step.action && (
                    <a href={step.action.match(/https?:\/\/[^\s]+/)?.[0] || "#"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      {step.action} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PR Checklist */}
        <div className="bg-[#18181b] border border-green-500/20 rounded-[20px] p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Pull Request Checklist
          </h2>
          <div className="space-y-2">
            {g.pull_request_checklist?.map((item: string, i: number) => (
              <p key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                <span className="text-green-400">✓</span> {item.replace("✓ ", "")}
              </p>
            ))}
          </div>
        </div>

        {/* Back to Issue */}
        <div className="text-center pb-8">
          <a href={guide.issue.url} target="_blank" rel="noopener noreferrer" className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
            Open Issue on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </main>
    </div>
  )
}