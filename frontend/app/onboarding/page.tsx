"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowRight, ArrowLeft, Check, Sparkles, Code, Brain, Server, Wrench, FileText, Smartphone } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const languages = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "typescript", label: "TypeScript", icon: "🔷" },
  { id: "javascript", label: "JavaScript", icon: "💛" },
  { id: "go", label: "Go", icon: "🔵" },
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "java", label: "Java", icon: "☕" },
]

const levels = [
  { id: "beginner", label: "Beginner", desc: "New to open source", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "Some experience", icon: "🌿" },
  { id: "advanced", label: "Advanced", desc: "Regular contributor", icon: "🌳" },
]

const interests = [
  { id: "backend", label: "Backend", icon: Server },
  { id: "frontend", label: "Frontend", icon: Code },
  { id: "ai", label: "AI / ML", icon: Brain },
  { id: "devops", label: "DevOps", icon: Wrench },
  { id: "docs", label: "Documentation", icon: FileText },
  { id: "mobile", label: "Mobile", icon: Smartphone },
]

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [level, setLevel] = useState("beginner")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const toggleArray = (arr: string[], setter: any, item: string) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item))
    } else {
      setter([...arr, item])
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      await fetch(`${API}/api/onboarding/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languages: selectedLangs,
          experience_level: level,
          interests: selectedInterests,
          available_time: "1-2h",
          preferred_difficulty: level,
        }),
      })
    } catch (e) {}
    router.push("/dashboard?onboarded=true")
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-2">
          <p className="text-sm text-purple-400 font-medium uppercase tracking-wider mb-2">
            Personalize your experience
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i === step ? "bg-purple-500 text-white scale-110" : i < step ? "bg-purple-500/30 text-purple-300" : "bg-[#18181b] border border-[#27272a] text-zinc-600"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i}
              </div>
              {i < 3 && <div className={`w-8 h-0.5 rounded-full ${i < step ? "bg-purple-500" : "bg-[#27272a]"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Languages */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-3">What languages do you use?</h2>
            <p className="text-zinc-400 text-lg mb-10">We'll find issues in your preferred languages</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {languages.map(lang => (
                <button key={lang.id} onClick={() => toggleArray(selectedLangs, setSelectedLangs, lang.id)}
                  className={`p-6 rounded-[20px] border-2 text-left transition-all hover:scale-[1.02] ${
                    selectedLangs.includes(lang.id) ? "border-purple-500 bg-purple-500/10" : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
                  }`}>
                  <span className="text-3xl mb-3 block">{lang.icon}</span>
                  <span className="text-lg font-semibold">{lang.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={selectedLangs.length === 0}
              className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-3">Your experience level</h2>
            <p className="text-zinc-400 text-lg mb-10">We'll match issues to your skill level</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {levels.map(lvl => (
                <button key={lvl.id} onClick={() => { setLevel(lvl.id); setTimeout(() => setStep(3), 200) }}
                  className={`p-6 rounded-[20px] border-2 text-center transition-all hover:scale-[1.02] ${
                    level === lvl.id ? "border-purple-500 bg-purple-500/10" : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
                  }`}>
                  <span className="text-3xl mb-3 block">{lvl.icon}</span>
                  <span className="text-lg font-semibold block mb-1">{lvl.label}</span>
                  <span className="text-sm text-zinc-500">{lvl.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="h-[52px] px-6 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2 border border-[#27272a]">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold mb-3">What interests you?</h2>
            <p className="text-zinc-400 text-lg mb-10">Select all that apply</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {interests.map(item => {
                const Icon = item.icon
                const selected = selectedInterests.includes(item.id)
                return (
                  <button key={item.id} onClick={() => toggleArray(selectedInterests, setSelectedInterests, item.id)}
                    className={`p-6 rounded-[20px] border-2 text-center transition-all hover:scale-[1.02] ${
                      selected ? "border-purple-500 bg-purple-500/10" : "border-[#27272a] bg-[#18181b] hover:border-zinc-600"
                    }`}>
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${selected ? "text-purple-400" : "text-zinc-400"}`} />
                    <span className="text-lg font-semibold">{item.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="h-[52px] px-6 bg-[#18181b] hover:bg-[#27272a] text-white rounded-[14px] font-medium text-base inline-flex items-center gap-2 border border-[#27272a]">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleComplete} disabled={saving}
                className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5">
                {saving ? "Saving..." : "Find My Issues"} <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}