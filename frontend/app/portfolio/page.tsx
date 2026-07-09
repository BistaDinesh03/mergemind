"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { Star, Users, GitFork, ExternalLink, Sparkles, Layers, Github, AlertCircle, RefreshCw } from "lucide-react"

const API = "http://localhost:8000"

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const username = session?.user?.name || null

  useEffect(() => {
    if (status !== "authenticated" || !username) return
    setLoading(true)
    setError(null)
    fetch(`${API}/api/portfolio/${username}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError("Failed to load"); setLoading(false) })
  }, [status, username])

  if (loading) return <div className="min-h-screen bg-[#09090b]"><Navbar /><div className="max-w-5xl mx-auto px-6 py-12"><div className="h-32 skeleton rounded-[20px]"/></div></div>

  if (status === "unauthenticated") return (
    <div className="min-h-screen bg-[#09090b]"><Navbar />
      <div className="flex flex-col items-center justify-center py-32"><Github className="w-10 h-10 text-zinc-600 mb-4"/><h2 className="text-lg font-bold mb-2">Sign in required</h2><p className="text-sm text-zinc-400 mb-6">Connect GitHub to see your portfolio.</p><button onClick={()=>signIn("github")} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold">Sign in with GitHub</button></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#09090b]"><Navbar />
      <div className="flex flex-col items-center justify-center py-32"><AlertCircle className="w-10 h-10 text-red-400 mb-4"/><p className="text-sm text-zinc-400 mb-6">{error}</p><button onClick={()=>window.location.reload()} className="h-10 px-5 bg-white text-zinc-900 rounded-[14px] text-sm font-semibold inline-flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Retry</button></div>
    </div>
  )

  if (!data) return <div className="min-h-screen bg-[#09090b]"><Navbar /><div className="flex items-center justify-center py-32"><p className="text-zinc-400">No data available</p></div></div>

  const totalStars = data.repositories?.reduce((s,r)=>s+(r.stars||0),0)||0
  const languages = [...new Set(data.repositories?.map(r=>r.language).filter(Boolean)||[])]

  return (
    <div className="min-h-screen bg-[#09090b] text-white"><Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="flex items-start gap-6 pb-8 border-b border-[#27272a]">
          {data.avatar && <img src={data.avatar} alt="" className="w-20 h-20 rounded-full ring-2 ring-[#27272a]"/>}
          <div><h1 className="text-2xl font-bold">{data.name||username}</h1><p className="text-zinc-500">@{data.username||username}</p>
            <div className="flex items-center gap-5 mt-3 text-sm text-zinc-400"><span><b className="text-white">{data.followers||0}</b> followers</span><span><b className="text-white">{data.public_repos||0}</b> repos</span><span><b className="text-white">{totalStars}</b> stars</span><span><b className="text-white">{languages.length}</b> languages</span></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[{icon:GitFork,value:data.public_repos||0,label:"Repos",color:"text-blue-400"},{icon:Star,value:totalStars,label:"Stars",color:"text-yellow-400"},{icon:Users,value:data.followers||0,label:"Followers",color:"text-green-400"},{icon:Layers,value:languages.length,label:"Languages",color:"text-purple-400"}].map(s=><div key={s.label} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-5 text-center"><s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`}/><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-zinc-500">{s.label}</p></div>)}
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Repositories ({data.public_repos||0})</h2>
          <div className="space-y-2">{data.repositories?.map(repo=><a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-[20px] p-4 hover:border-zinc-600 transition-all"><p className="font-medium text-sm">{repo.name}</p><div className="flex items-center gap-2 text-xs text-zinc-500">{repo.language&&<span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"/>{repo.language}</span>}<span className="flex items-center gap-1"><Star className="w-3 h-3"/>{repo.stars||0}</span></div></a>)}</div>
        </div>
      </main>
    </div>
  )
}