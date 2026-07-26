"use client"

const LANGUAGES = [
  "python", "javascript", "typescript", "rust", "go", "java", 
  "ruby", "cpp", "c", "php", "swift", "kotlin", "csharp", "html", "css"
]

export function LanguageFilter({ selected, onSelect }: { selected: string; onSelect: (lang: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onSelect("")}
        className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all scale-press ${
          !selected ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-[#1a1a2e] text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-white"
        }`}>All</button>
      {LANGUAGES.map(lang => (
        <button key={lang} onClick={() => onSelect(lang)}
          className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all scale-press ${
            selected === lang ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-[#1a1a2e] text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-white"
          }`}>{lang === "cpp" ? "C++" : lang === "csharp" ? "C#" : lang}</button>
      ))}
    </div>
  )
}