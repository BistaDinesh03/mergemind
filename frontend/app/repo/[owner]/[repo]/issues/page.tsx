"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { IssuesSkeleton } from "@/components/Skeletons"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { EmptyState } from "@/components/EmptyState"
import { Search, ArrowUpDown, Tag, X, MessageSquare, Clock, ChevronRight } from "lucide-react"

export default function IssuesPage() {
  const params = useParams()
  const owner = params?.owner as string
  const repo = params?.repo as string
  const [issues, setIssues] = useState<any[]>([])
  const [allLabels, setAllLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [sort, setSort] = useState("updated")
  const [order, setOrder] = useState("desc")
  const [showLabels, setShowLabels] = useState(false)

  const fetchIssues = () => {
    setLoading(true); setError("")
    const lp = selectedLabels.length > 0 ? `&labels=${selectedLabels.join(",")}` : ""
    fetch(`http://localhost:8000/api/github/repositories/${owner}/${repo}/issues?sort=${sort}&order=${order}${lp}&per_page=30`)
      .then(r => { if(!r.ok) throw new Error(); return r.json() })
      .then(d => { setIssues(d.issues||[]); setAllLabels(d.all_labels||[]) })
      .catch(() => setError("Failed to load issues"))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if(owner && repo) fetchIssues() }, [owner, repo, sort, order, selectedLabels])

  if (loading) return <IssuesSkeleton />
  if (error) return <div className="min-h-screen bg-[#0a0b0f]"><Navbar /><ErrorDisplay type="api" message={error} onRetry={fetchIssues} /></div>

  const filtered = issues.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return i.title.toLowerCase().includes(q) || i.labels?.some((l:string) => l.toLowerCase().includes(q))
  })

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/discover" className="hover:text-gray-300">Discover</Link><span>/</span>
          <Link href={"/repo/"+owner+"/"+repo} className="hover:text-gray-300">{owner}/{repo}</Link><span>/</span>
          <span className="text-gray-300">Issues ({issues.length})</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search issues..." className="w-full pl-10 pr-4 py-2.5 bg-[#111318] border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500" />
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} className="px-3 py-2.5 bg-[#111318] border border-gray-700/50 rounded-lg text-white text-sm">
            <option value="updated">Recently Updated</option><option value="created">Newest</option><option value="comments">Most Comments</option>
          </select>
          <button onClick={()=>setOrder(o=>o==="desc"?"asc":"desc")} className="px-3 py-2.5 bg-[#111318] border border-gray-700/50 rounded-lg text-white text-sm"><ArrowUpDown className="w-4 h-4"/> {order==="desc"?"↓":"↑"}</button>
          <div className="relative">
            <button onClick={()=>setShowLabels(!showLabels)} className="px-3 py-2.5 bg-[#111318] border border-gray-700/50 rounded-lg text-white text-sm flex items-center gap-2"><Tag className="w-4 h-4"/> Labels {selectedLabels.length>0&&`(${selectedLabels.length})`}</button>
            {showLabels && <div className="absolute top-full mt-1 right-0 w-56 bg-[#111318] border border-gray-700/50 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">{allLabels.map(l=><button key={l} onClick={()=>setSelectedLabels(p=>p.includes(l)?p.filter(x=>x!==l):[...p,l])} className={`w-full text-left px-3 py-1.5 text-sm ${selectedLabels.includes(l)?"bg-purple-600 text-white":"text-gray-300 hover:bg-gray-700"}`}>{l}</button>)}</div>}
          </div>
          {(search||selectedLabels.length>0)&&<button onClick={()=>{setSearch("");setSelectedLabels([])}} className="px-3 py-2.5 text-sm text-gray-400 hover:text-white">Clear</button>}
        </div>

        {filtered.length === 0 ? (
          <EmptyState type={search ? "search" : "issues"} description={search ? "Try a different search term" : "No open issues found in this repository"} />
        ) : (
          <div className="space-y-2">
            {filtered.map(i => (
              <Link key={i.id} href={"/repo/"+owner+"/"+repo+"/issues/"+i.number}
                className="flex items-start gap-3 bg-[#111318] border border-gray-800/50 rounded-xl p-4 hover:border-gray-600 transition-all group">
                <span className="text-xs text-gray-500 mt-1">#{i.number}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm group-hover:text-purple-400">{i.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {i.labels?.map((l:string)=><span key={l} className="px-1.5 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded">{l}</span>)}
                    {i.is_beginner_friendly&&<span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-400 rounded">🎯 Beginner</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                  <span><MessageSquare className="w-3 h-3 inline"/> {i.comments}</span>
                  <span><Clock className="w-3 h-3 inline"/> {new Date(i.created_at).toLocaleDateString()}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300"/>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}