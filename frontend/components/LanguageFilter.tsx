"use client"

const LANGUAGES = ["python", "javascript", "typescript", "java", "go"]

export function LanguageFilter({ selected, onSelect }: { selected: string; onSelect: (lang: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onSelect("")}
        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
          !selected ? "bg-white text-zinc-900" : "bg-[#1a1a2e] text-zinc-400 border border-gray-700/50 hover:text-white"
        }`}>All</button>
      {LANGUAGES.map(lang => (
        <button key={lang} onClick={() => onSelect(lang)}
          className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-colors ${
            selected === lang ? "bg-white text-zinc-900" : "bg-[#1a1a2e] text-zinc-400 border border-gray-700/50 hover:text-white"
          }`}>{lang}</button>
      ))}
    </div>
  )
}