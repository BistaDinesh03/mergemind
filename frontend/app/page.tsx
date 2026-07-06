"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Github, ArrowRight, Shield, Zap, Loader2 } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    if (loading) return
    setLoading(true)
    try {
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      <section className="relative border-b border-[#27272a]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-32 sm:py-40 text-center">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-8">
            Get your first pull request merged.
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
            MergeMind finds the right GitHub issue for you, scores it across six dimensions, and tells you exactly what to do next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {session ? (
              <Link href="/dashboard" 
                className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">
                Find my next PR <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button 
                type="button"
                onClick={handleSignIn}
                disabled={loading}
                className="h-[52px] px-8 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" /> Sign in with GitHub
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-500" /> Read-only access</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-purple-400" /> AI runs locally</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-500" /> Nothing stored</span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#27272a]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-8">
            Most developers never ship their first contribution.
          </h2>
          <p className="text-lg text-zinc-400 text-center leading-relaxed max-w-2xl mx-auto">
            Not because they cannot code. Because finding the right issue takes longer than writing the fix.
          </p>
        </div>
      </section>

      <section className="border-b border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">How it works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Connect your GitHub account", desc: "Read-only access. We look at your public repositories." },
              { step: "2", title: "We analyze repositories for you", desc: "Every repository gets scored on health, activity, and community." },
              { step: "3", title: "Every issue receives a score", desc: "Six factors: difficulty, merge probability, time, beginner friendliness, health, and clarity." },
              { step: "4", title: "You get one clear recommendation", desc: "Open it, read the AI breakdown, and start coding with confidence." },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">{s.step}</div>
                <div><h3 className="text-base font-semibold">{s.title}</h3><p className="text-sm text-zinc-500 mt-1">{s.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#27272a]">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-16">Built with your privacy in mind</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: "Read-only access", desc: "We never write to your repositories." },
              { icon: Zap, title: "AI runs locally", desc: "No data is sent to external servers." },
              { icon: Shield, title: "Nothing stored", desc: "Your data stays private on your machine." },
            ].map((t, i) => (
              <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 text-center">
                <t.icon className="w-6 h-6 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1.5">{t.title}</h3>
                <p className="text-xs text-zinc-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-28 sm:py-36 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to get your first PR merged?</h2>
          <p className="text-lg text-zinc-400 mb-10">Sign in with GitHub and find your next contribution in seconds.</p>
          {session ? (
            <Link href="/dashboard" className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98]">Find my next PR <ArrowRight className="w-5 h-5" /></Link>
          ) : (
            <button type="button" onClick={handleSignIn} disabled={loading}
              className="h-[52px] px-10 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] font-semibold text-lg inline-flex items-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Redirecting...</> : <><Github className="w-5 h-5"/> Sign in with GitHub</>}
            </button>
          )}
          <p className="text-xs text-zinc-600 mt-6">Free and open source. Read-only access. Nothing stored.</p>
        </div>
      </section>

      <footer className="border-t border-[#27272a] py-10 text-center">
        <p className="text-sm text-zinc-600">MergeMind · Open Source · <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-400 hover:text-white transition-colors">GitHub</a></p>
      </footer>
    </div>
  )
}