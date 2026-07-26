"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, ChevronRight, Loader2, AlertCircle, 
  GitFork, GitBranch, Terminal, CheckCircle, 
  Clock, BarChart3, FileCode, Sparkles, ArrowRight,
  Copy, Check, Play, Circle
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState(1)

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

  const toggleStep = (step: number) => {
    if (completedSteps.includes(step)) {
      setCompletedSteps(completedSteps.filter(s => s !== step))
    } else {
      setCompletedSteps([...completedSteps, step])
      if (step >= currentStep) {
        setCurrentStep(step + 1)
      }
    }
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
  const totalSteps = g.steps?.length || 8
  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100)

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

        {/* Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-[24px] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[12px] bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {g.estimated_time}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                <BarChart3 className="w-3 h-3" /> {g.difficulty}
              </span>
              <a href={guide.issue.url} target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] text-zinc-400 border border-[#27272a] rounded-full text-xs font-medium hover:text-white hover:border-zinc-600 transition-colors">
                <ExternalLink className="w-3 h-3" /> Open on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> Contribution Progress
            </h2>
            <span className="text-sm text-purple-400 font-medium">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            Step {Math.min(currentStep, totalSteps)} of {totalSteps}
            {progressPercent === 100 && " — Ready to open your Pull Request! 🎉"}
          </p>
        </div>

        {/* AI Summary */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> What you'll build
          </h2>
          <p className="text-zinc-400 leading-relaxed">{guide.ai_summary}</p>
        </div>

        {/* Scoring Grid */}
        {scoring && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(scoring.factors || {}).map(([key, factor]: [string, any]) => (
              <div key={key} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 text-center card-hover">
                <p className="text-2xl font-bold text-purple-400">{factor.score}</p>
                <p className="text-xs text-zinc-500 mt-1">{factor.label}</p>
                <p className="text-[10px] text-zinc-600 mt-1">{factor.weight}</p>
              </div>
            ))}
          </div>
        )}

        {/* Step-by-Step Interactive Checklist */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" /> Step-by-Step Guide
          </h2>
          
          {g.steps?.map((step: any) => {
            const isCompleted = completedSteps.includes(step.step)
            const isCurrent = step.step === currentStep
            
            return (
              <div 
                key={step.step} 
                onClick={() => toggleStep(step.step)}
                className={`relative bg-[#18181b] border rounded-[20px] p-5 transition-all cursor-pointer ${
                  isCompleted 
                    ? "border-green-500/30 bg-green-500/5" 
                    : isCurrent 
                    ? "border-purple-500/30 bg-purple-500/5" 
                    : "border-[#27272a] hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number / Check */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isCompleted 
                      ? "bg-green-500/20" 
                      : isCurrent 
                      ? "bg-purple-500/20" 
                      : "bg-[#27272a]"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : isCurrent ? (
                      <Play className="w-4 h-4 text-purple-400 ml-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${isCompleted ? "text-green-400" : ""}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
                    
                    {step.command && (
                      <div className="relative">
                        <pre className="bg-[#09090b] rounded-[14px] p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                          {step.command}
                        </pre>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyCommand(step.command, step.step) }}
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
                          onClick={(e) => { e.stopPropagation(); copyCommand(cmd, step.step * 100 + i) }}
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
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* PR Checklist */}
        <div className="bg-[#18181b] border border-green-500/20 rounded-[20px] p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Pull Request Checklist
          </h2>
          <div className="space-y-2">
            {g.pull_request_checklist?.map((item: string, i: number) => (
              <p key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span> {item.replace("✓ ", "")}
              </p>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center pb-8">
          <a href={guide.issue.url} target="_blank" rel="noopener noreferrer" 
            className="h-11 px-6 bg-white text-zinc-900 rounded-[14px] font-semibold text-sm inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors scale-press">
            Open Issue on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </main>
    </div>
  )
}