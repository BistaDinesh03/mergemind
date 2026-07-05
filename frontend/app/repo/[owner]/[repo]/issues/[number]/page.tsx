"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { 
  ExternalLink, Clock, MessageSquare, ChevronRight, Loader2,
  Zap, Thermometer, GitMerge, Smile, Activity, FileText,
  Sparkles, CheckCircle, Award, Shield, TrendingUp,
  Heart, Target, ArrowRight, BookOpen
} from "lucide-react"

export default function IssueDetailPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const number = params?.number as string
  const [loading, setLoading] = useState(true)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  const score = 92
  const verdict = "Highly Recommended"
  const confidenceLevel = "High"
  const factors = [
    { icon: Thermometer, label: "Difficulty", score: 88, color: "text-green-400", bar: "bg-green-500", ring: "stroke-green-500", reason: "Labeled good first issue. Clear scope with well-defined requirements. Small code changes needed." },
    { icon: GitMerge, label: "Merge Probability", score: 85, color: "text-blue-400", bar: "bg-blue-500", ring: "stroke-blue-500", reason: "Maintainers merge 92% of PRs within a week. Very responsive to new contributors." },
    { icon: Clock, label: "Estimated Time", score: 90, color: "text-purple-400", bar: "bg-purple-500", ring: "stroke-purple-500", reason: "Small scope. Estimated 1-2 hours including tests. Perfect for an evening or weekend session." },
    { icon: Smile, label: "Beginner Friendly", score: 92, color: "text-amber-400", bar: "bg-amber-500", ring: "stroke-amber-500", reason: "Excellent documentation. Supportive community. Clear contribution guidelines provided." },
    { icon: Activity, label: "Repo Activity", score: 90, color: "text-cyan-400", bar: "bg-cyan-500", ring: "stroke-cyan-500", reason: "Repository pushed today. 99K+ stars. Very active maintainer community." },
    { icon: FileText, label: "Issue Clarity", score: 78, color: "text-pink-400", bar: "bg-pink-500", ring: "stroke-pink-500", reason: "Good description with reproduction steps. Could benefit from more detailed expected behavior." },
  ]

  const skillsLearned = ["Type Hints", "Python", "Code Quality", "Testing", "Open Source Workflow"]

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8 flex-wrap">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}`} className="hover:text-zinc-300 transition-colors">{owner}/{repo}</Link><ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/repo/${owner}/${repo}/issues`} className="hover:text-zinc-300 transition-colors">Issues</Link><ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-medium">#{number}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT — Score + Factors */}
          <div className="space-y-6">
            
            {/* ═══ AI SCORE RING — The hero ═══ */}
            <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 rounded-[24px] p-8 text-center relative overflow-hidden shadow-2xl shadow-purple-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="relative">
                <p className="text-purple-200 text-xs font-medium uppercase tracking-widest mb-4">AI Analysis Score</p>
                
                {/* Score Ring */}
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle cx="80" cy="80" r="68" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 68}`} strokeDashoffset={`${2 * Math.PI * 68 * 0.08}`} 
                      strokeLinecap="round" />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" /><stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold text-white">{score}</span>
                    <span className="text-purple-200 text-sm">out of 100</span>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 h-5 rounded-full ${i < 4 ? "bg-white/40" : "bg-white/10"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-purple-200">{confidenceLevel} confidence</span>
                </div>
              </div>
            </div>

            {/* Verdict + CTA */}
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20">
                  <Award className="w-4 h-4" /> {verdict}
                </span>
              </div>

              <a href={`https://github.com/${owner}/${repo}/issues/${number}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full h-[52px] bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base transition-all duration-200 active:scale-[0.98] shadow-sm">
                <ExternalLink className="w-4 h-4" /> Start Contributing on GitHub <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> AI analysis runs locally</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Generated by Llama 3.2</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Factor Cards + AI Explanation */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Issue Header */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-[24px] p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-3 leading-snug">Add type hints to dependencies/utils.py</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4">
                <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Open
                </span>
                <span className="flex items-center gap-1.5">
                  <img src={`https://avatars.githubusercontent.com/${owner}`} className="w-5 h-5 rounded-full" alt="" />
                  tiangolo
                </span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 2 days ago</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> 5 comments</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {["good first issue","python","enhancement","help wanted"].map(l => (
                  <span key={l} className="px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">{l}</span>
                ))}
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                We need to add type hints to the dependencies/utils.py file to improve code quality and developer experience.
                This is a great first issue for anyone looking to contribute to FastAPI.
              </p>
            </div>

            {/* ═══ FACTOR CARDS — The analysis ═══ */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Score Breakdown
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {factors.map(factor => (
                  <div key={factor.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 hover:border-zinc-600 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${
                          factor.score >= 80 ? "bg-green-500/10" : factor.score >= 60 ? "bg-blue-500/10" : "bg-yellow-500/10"
                        }`}>
                          <factor.icon className={`w-5 h-5 ${factor.color}`} />
                        </div>
                        <span className="text-sm font-semibold">{factor.label}</span>
                      </div>
                      <span className={`text-xl font-bold ${factor.color}`}>{factor.score}</span>
                    </div>
                    
                    <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden mb-2">
                      <div className={`h-2 ${factor.bar} rounded-full transition-all duration-700`} 
                        style={{ width: `${factor.score}%` }} />
                    </div>
                    
                    <p className="text-xs text-zinc-500 leading-relaxed">{factor.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ AI MENTOR ADVICE ═══ */}
            <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-[20px] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[14px] bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">AI Mentor Advice</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    This is an excellent first contribution. The maintainers are welcoming, the scope is clearly defined, 
                    and you will learn about Python type hints and code quality practices. Start by reading the CONTRIBUTING.md, 
                    then add type hints to the functions in utils.py. Run the tests before submitting your PR.
                  </p>

                  {/* Skills you will learn */}
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Skills you will gain
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsLearned.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs bg-[#09090b]/50 text-zinc-300 rounded-full border border-[#27272a]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}