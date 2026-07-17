"use client"

import { Search, X, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  loading?: boolean
}

export function SearchBar({ onSearch, placeholder = "Search repositories...", loading = false }: SearchBarProps) {
  const [value, setValue] = useState("")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search — fires 300ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(value.trim())
    }, 300)
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value])

  const handleClear = () => {
    setValue("")
    onSearch("")
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Cancel debounce and fire immediately
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-gray-500" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
      />
      {value && (
        <button 
          type="button" 
          onClick={handleClear} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}