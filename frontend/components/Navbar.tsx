"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCommandPalette } from "@/components/providers/CommandPaletteProvider"
import { Github, LogOut, Menu, X, Search } from "lucide-react"

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { open: openSearch } = useCommandPalette()

  useEffect(() => { setOpen(false) }, [pathname])

  const handleSignOut = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setOpen(false)
    await signOut({ callbackUrl: "/" })
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/discover", label: "Discover" },
    { href: "/portfolio", label: "Portfolio" },
  ]

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav className="sticky top-0 z-50 border-b border-[#27272a] bg-[#09090b]/85 backdrop-blur-xl" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="MergeMind home">
            <img src="/icon.svg" alt="MergeMind" className="w-7 h-7" />
            <span className="text-[15px] font-semibold tracking-tight text-white hidden sm:inline">MergeMind</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5" role="menubar">
            {status === "authenticated" && links.map(l => {
              const active = pathname === l.href || pathname?.startsWith(l.href + "/")
              return (
                <Link key={l.href} href={l.href} role="menuitem" aria-current={active ? "page" : undefined}
                  className={`px-3.5 py-2 text-sm rounded-[14px] transition-colors duration-200 ${active ? "text-white bg-[#18181b]" : "text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50"}`}>{l.label}</Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openSearch} aria-label="Search (Cmd+K)"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white rounded-[14px] hover:bg-[#18181b]/50 transition-colors duration-200 border border-[#27272a]">
              <Search className="w-3.5 h-3.5" /><span className="hidden sm:inline">Search</span><kbd className="hidden sm:inline text-[10px] text-zinc-500 bg-[#27272a] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
            
            {status === "authenticated" ? (
              <button onClick={handleSignOut} disabled={loggingOut} aria-label="Sign out"
                className="hidden md:flex items-center px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 rounded-[14px] hover:bg-[#18181b]/50 transition-colors duration-200 disabled:opacity-50">
                {loggingOut ? <span className="text-xs">Signing out...</span> : <LogOut className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <button onClick={() => signIn("github")} aria-label="Sign in with GitHub"
                className="hidden md:flex items-center gap-1.5 h-9 px-4 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-sm font-medium transition-all duration-200 active:scale-[0.97]">
                <Github className="w-3.5 h-3.5" /> Sign in
              </button>
            )}
            
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-zinc-400 rounded-[14px]" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-[#09090b]/95 backdrop-blur-xl">
          <div className="px-4 py-6 space-y-1">
            {status === "authenticated" && links.map(l => {
              const active = pathname === l.href
              return <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={active?"page":undefined} className={`block px-5 py-4 text-base rounded-[14px] transition-colors ${active?"text-white bg-[#18181b]":"text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/50"}`}>{l.label}</Link>
            })}
            <div className="pt-4 mt-4 border-t border-[#27272a]">
              {status === "authenticated" ? (
                <button onClick={handleSignOut} className="w-full text-left px-5 py-4 text-base text-red-400 rounded-[14px]">Sign out</button>
              ) : (
                <button onClick={() => signIn("github")} className="w-full h-14 bg-white text-zinc-900 rounded-[14px] text-base font-semibold">Sign in with GitHub</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}