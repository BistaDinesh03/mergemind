"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { CommandPalette } from "@/components/CommandPalette"

interface PaletteContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const PaletteContext = createContext<PaletteContextType | null>(null)

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)

  // Global Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <PaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CommandPalette isOpen={isOpen} onClose={close} />
    </PaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const ctx = useContext(PaletteContext)
  if (!ctx) throw new Error("useCommandPalette must be used within CommandPaletteProvider")
  return ctx
}