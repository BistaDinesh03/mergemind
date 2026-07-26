import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { ArrowRight, Github, Search, GitPullRequest, CheckCircle, Sparkles, Clock, BarChart3, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-8">
          <Sparkles className="w-4 h-4" /> AI-powered open source contribution platform
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Your first open source<br />
          <span className="text-purple-400">contribution in minutes</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          MergeMind scans thousands of GitHub issues to find the perfect one for your skills. 
          Get a step-by-step guide, AI mentorship, and open your first pull request today — 
          no experience needed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/discover" className="h-[52px] px-8 bg-white text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
            Browse Issues <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="h-[52px] px-8 bg-[#18181b] text-white border border-[#27272a] rounded-[14px] font-medium text-base inline-flex items-center gap-2 hover:bg-[#27272a] transition-colors">
            <Github className="w-5 h-5" /> Sign in with GitHub
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#27272a]">
        <h2 className="text-2xl font-bold text-center mb-12">
          From zero to pull request in three steps
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">1. Discover Issues</h3>
            <p className="text-sm text-zinc-400">
              Browse beginner-friendly issues matched to your programming languages and skill level.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">2. Understand the Issue</h3>
            <p className="text-sm text-zinc-400">
              AI explains what needs to be done, estimates difficulty, and shows which files to edit.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GitPullRequest className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">3. Open a Pull Request</h3>
            <p className="text-sm text-zinc-400">
              Follow the step-by-step guide with copyable commands. Fork, clone, code, and submit your PR.
            </p>
          </div>
        </div>
      </section>

      {/* Why MergeMind */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#27272a]">
        <h2 className="text-2xl font-bold text-center mb-12">
          Why developers choose MergeMind
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Clock, title: "Save Hours", desc: "Stop browsing GitHub manually. Get matched in seconds." },
            { icon: BarChart3, title: "Know Your Fit", desc: "See difficulty scores and estimated time before you start." },
            { icon: CheckCircle, title: "Step-by-Step Guide", desc: "Fork, clone, setup, code, test, PR — we guide every step." },
            { icon: Star, title: "Real Issues Only", desc: "Every recommendation is a real, open GitHub issue. No fake data." },
          ].map(item => (
            <div key={item.title} className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6">
              <item.icon className="w-6 h-6 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-[#27272a]">
        <h2 className="text-2xl font-bold mb-4">Ready to make your first contribution?</h2>
        <p className="text-zinc-400 mb-8">Join developers who found their first open source issue through MergeMind.</p>
        <Link href="/discover" className="h-[52px] px-8 bg-white text-zinc-900 rounded-[14px] font-semibold text-base inline-flex items-center gap-2 hover:bg-zinc-200 transition-colors">
          Start Browsing Issues <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272a] py-8 px-6 text-center">
        <p className="text-sm text-zinc-600">
          MergeMind · Open Source ·{" "}
          <a href="https://github.com/BistaDinesh03/mergemind" className="text-zinc-400 hover:text-white transition-colors">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}