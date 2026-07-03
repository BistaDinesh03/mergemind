"use client"
const LANGUAGES = ["python", "javascript", "typescript", "rust", "go", "java", "ruby", "cpp", "c"]

interface Props { selected: string; onSelect: (lang: string) => void; languages?: string[] }

export function LanguageFilter({ selected, onSelect, languages = LANGUAGES }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <button onClick={() => onSelect("")}
        className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs rounded-lg capitalize transition-all ${
          !selected ? "bg-purple-600 text-white" : "bg-[#1a1a2e] text-gray-400 border border-gray-700/50 hover:bg-gray-700"
        }`}>All</button>
      {languages.map(lang => (
        <button key={lang} onClick={() => onSelect(lang)}
          className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs rounded-lg capitalize transition-all ${
            selected === lang ? "bg-purple-600 text-white" : "bg-[#1a1a2e] text-gray-400 border border-gray-700/50 hover:bg-gray-700"
          }`}>{lang}</button>
      ))}
    </div>
  )
}