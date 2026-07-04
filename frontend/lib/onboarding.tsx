"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export interface OnboardingData {
  language: string
  level: string
  interests: string[]
  completed: boolean
}

interface OnboardingContextType {
  data: OnboardingData
  setLanguage: (lang: string) => void
  setLevel: (level: string) => void
  toggleInterest: (interest: string) => void
  complete: () => void
  step: number
  setStep: (step: number) => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    language: "", level: "", interests: [], completed: false
  })
  const [step, setStep] = useState(1)

  const setLanguage = (lang: string) => setData(prev => ({ ...prev, language: lang }))
  const setLevel = (level: string) => setData(prev => ({ ...prev, level }))
  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }
  const complete = () => setData(prev => ({ ...prev, completed: true }))

  return (
    <OnboardingContext.Provider value={{ data, setLanguage, setLevel, toggleInterest, complete, step, setStep }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider")
  return ctx
}