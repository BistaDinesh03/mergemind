"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Github, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/50 bg-[#0a0b0f]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <Link href="/" className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text tracking-tight">
          MergeMind
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {session && [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/discover", label: "Discover" },
            { href: "/portfolio", label: "Portfolio" },
          ].map(l => (
            <Link key={l.href} href={l.href} className="px-2.5 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-200">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {session ? (
            <button onClick={() => signOut()} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <button onClick={() => signIn("github")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all">
              <Github className="w-4 h-4" /> Sign In
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-2 -mr-2 text-gray-400 hover:text-white rounded-lg btn-touch">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden px-4 pb-4 space-y-1 border-t border-gray-800/50 pt-3 bg-[#0a0b0f]">
          {session && [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/discover", label: "Discover" },
            { href: "/portfolio", label: "Portfolio" },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-3 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all btn-touch">
              {l.label}
            </Link>
          ))}
          {session ? (
            <button onClick={() => signOut()} className="w-full text-left px-3 py-3 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-all btn-touch">Sign Out</button>
          ) : (
            <button onClick={() => signIn("github")} className="w-full text-left px-3 py-3 text-sm text-purple-400 hover:bg-purple-500/5 rounded-lg transition-all btn-touch">Sign In with GitHub</button>
          )}
        </div>
      )}
    </nav>
  )
}