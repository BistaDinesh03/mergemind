"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding, OnboardingProvider } from "@/lib/onboarding"
import { 
  ArrowRight, ArrowLeft, Check, Sparkles, Code, Zap, 
  BookOpen, Brain, Server, Smartphone, FileText, Wrench
} from "lucide-react"

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-12">
      {[...Array(total)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            i + 1 === step ? "bg-purple-500 text-white scale-110" :
            i + 1 < step ? "bg-purple-500/30 text-purple-300" :
            "bg-[#18181b] border border-[#27272a] text-zinc-600"
          }`}>
            {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${
              i + 1 < step ? "bg-purple-500" : "bg-[#27272a]"
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Step1Language() {
  const { data, setLanguage, setStep } = useOnboarding()
  const languages = [
    { id: "python", label: "Python", icon: "🐍" },
    { id: "typescript", label: "TypeScript", icon: "🔷" },
    { id: "javascript", label: "JavaScript", icon: "💛" },
    { id: "go", label: "Go", icon: "🔵" },
    { id: "rust", label: "Rust", icon: "🦀" },
    { id: "java", label: "Java", icon: "☕" },
  ]

  return (
    <div className="animate-fadeInUp">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">Choose your language</h2>
      <p className="text-zinc-400 text-lg mb-10">We'll find issues in your preferred language</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {languages.map(lang => (
          <button key={lang.id} onClick={() => { setLanguage(lang.id); setTimeout(() => setStep(2), 200) }}
            className={`p-6 rounded-[20px] border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              data.language === lang.id 
                ? "border-purple-500 bg-purple-500/10" 
                : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
            }`}>
            <span className="text-3xl mb-3 block">{lang.icon}</span>
            <span className="text-lg font-semibold block">{lang.label}</span>
          </button>
        ))}
      </div>

      <button onClick={() => setStep(2)} disabled={!data.language}
        className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function Step2Level() {
  const { data, setLevel, setStep } = useOnboarding()
  const levels = [
    { id: "beginner", label: "Beginner", desc: "New to open source", icon: "🌱" },
    { id: "intermediate", label: "Intermediate", desc: "Some experience", icon: "🌿" },
    { id: "advanced", label: "Advanced", desc: "Regular contributor", icon: "🌳" },
  ]

  return (
    <div className="animate-fadeInUp">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">Your experience level</h2>
      <p className="text-zinc-400 text-lg mb-10">We'll match issues to your skill level</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {levels.map(lvl => (
          <button key={lvl.id} onClick={() => { setLevel(lvl.id); setTimeout(() => setStep(3), 200) }}
            className={`p-6 rounded-[20px] border-2 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              data.level === lvl.id 
                ? "border-purple-500 bg-purple-500/10" 
                : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
            }`}>
            <span className="text-3xl mb-3 block">{lvl.icon}</span>
            <span className="text-lg font-semibold block mb-1">{lvl.label}</span>
            <span className="text-sm text-zinc-500">{lvl.desc}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(1)} className="h-[52px] px-6 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2 border border-[#27272a] transition-all duration-200">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={() => setStep(3)} disabled={!data.level}
          className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function Step3Interests() {
  const { data, toggleInterest, setStep, complete } = useOnboarding()
  const router = useRouter()
  
  const interests = [
    { id: "backend", label: "Backend", icon: Server },
    { id: "frontend", label: "Frontend", icon: Code },
    { id: "ai", label: "AI / ML", icon: Brain },
    { id: "devops", label: "DevOps", icon: Wrench },
    { id: "docs", label: "Documentation", icon: FileText },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ]

  const handleComplete = () => {
    complete()
    router.push("/dashboard?onboarded=true")
  }

  return (
    <div className="animate-fadeInUp">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">What interests you?</h2>
      <p className="text-zinc-400 text-lg mb-10">Select all that apply</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {interests.map(item => {
          const Icon = item.icon
          const selected = data.interests.includes(item.id)
          return (
            <button key={item.id} onClick={() => toggleInterest(item.id)}
              className={`p-6 rounded-[20px] border-2 text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                selected ? "border-purple-500 bg-purple-500/10" : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
              }`}>
              <Icon className={`w-8 h-8 mx-auto mb-3 ${selected ? "text-purple-400" : "text-zinc-400"}`} />
              <span className="text-lg font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="h-[52px] px-6 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2 border border-[#27272a] transition-all duration-200">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleComplete}
          className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
          Find My Issues <Sparkles className="w-4 h-4" />
        </button>
      </div>
      <button onClick={handleComplete} className="mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        Skip for now →
      </button>
    </div>
  )
}

function LoadingScreen() {
  const router = useRouter()
  
  useEffect(() => {
    const timer = setTimeout(() => router.push("/dashboard?onboarded=true"), 3000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="text-center animate-fadeInUp">
      <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
        <Sparkles className="w-10 h-10 text-purple-400" />
      </div>
      <h2 className="text-3xl font-bold mb-3">Finding your matches...</h2>
      <p className="text-zinc-400 text-lg mb-8">MergeMind AI is scanning thousands of repositories</p>
      
      <div className="max-w-md mx-auto space-y-3">
        {["Analyzing repository health...", "Scoring open issues...", "Matching your preferences...", "Building recommendations..."].map((text, i) => (
          <div key={i} className="flex items-center gap-3 animate-fadeInUp" style={{ animationDelay: `${i * 0.3}s` }}>
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-zinc-400">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const { step } = useOnboarding()
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    document.title = "Onboarding — MergeMind"
  }, [])

  if (showLoading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <LoadingScreen />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-2">
          <p className="text-sm text-purple-400 font-medium uppercase tracking-wider mb-2">
            Let's find your perfect first contribution
          </p>
        </div>
        
        <StepIndicator step={step} total={3} />
        
        {step === 1 && <Step1Language />}
        {step === 2 && <Step2Level />}
        {step === 3 && <Step3Interests />}
      </div>
    </div>
  )
}