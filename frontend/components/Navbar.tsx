"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCommandPalette } from "@/components/providers/CommandPaletteProvider"
import { Github, LogOut, Menu, X, Search } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { open: openSearch } = useCommandPalette()
  const menuRef = useRef(null)

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    const el = menuRef.current?.querySelector("a, button")
    if (el) el.focus()
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/discover", label: "Discover" },
    { href: "/portfolio", label: "Portfolio" },
  ]

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav className="sticky top-0 z-50 border-b border-[#27272a] bg-[#09090b]/85 backdrop-blur-xl" role="navigation" aria-label="Main">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="MergeMind home">
            <img src="/icon.svg" alt="" className="w-7 h-7" aria-hidden="true" />
            <span className="text-[15px] font-semibold tracking-tight text-white hidden sm:inline">MergeMind</span>
          </Link>
          <div className="hidden md:flex items-center gap-0.5" role="menubar">
            {session && links.map(l => {
              const active = pathname === l.href || pathname?.startsWith(l.href + "/")
              return <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={`px-3.5 py-2 text-[13px] rounded-[14px] transition-colors duration-150 ${active ? "text-white bg-[#18181b]" : "text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/40"}`}>{l.label}</Link>
            })}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openSearch} aria-label="Search (Cmd+K)" className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-zinc-400 hover:text-white rounded-[14px] hover:bg-[#18181b]/40 transition-colors duration-150 border border-[#27272a]">
              <Search className="w-3.5 h-3.5" aria-hidden="true" /><span className="hidden sm:inline">Search</span><kbd className="hidden sm:inline text-[10px] text-zinc-500 bg-[#27272a] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
            {session ? (
              <button onClick={() => signOut()} aria-label="Sign out" className="hidden md:flex items-center px-3 py-2 text-[13px] text-zinc-400 hover:text-zinc-200 rounded-[14px] hover:bg-[#18181b]/40 transition-colors duration-150"><LogOut className="w-3.5 h-3.5" aria-hidden="true" /></button>
            ) : (
              <button onClick={() => signIn("github")} className="hidden md:flex items-center gap-1.5 h-9 px-4 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"><Github className="w-3.5 h-3.5" /> Sign in</button>
            )}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-zinc-400 rounded-[14px]" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu">{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" ref={menuRef} className="md:hidden fixed inset-0 top-14 z-40 bg-[#09090b]/95 backdrop-blur-xl" role="dialog" aria-label="Navigation">
          <div className="px-4 py-6 space-y-1">
            {session && links.map(l => { const active = pathname === l.href; return <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={active?"page":undefined} className={`block px-5 py-4 text-base rounded-[14px] transition-colors ${active?"text-white bg-[#18181b]":"text-zinc-400 hover:text-zinc-200 hover:bg-[#18181b]/40"}`}>{l.label}</Link> })}
            <div className="pt-4 mt-4 border-t border-[#27272a]">{session ? <button onClick={()=>{signOut();setOpen(false)}} className="w-full text-left px-5 py-4 text-base text-red-400 rounded-[14px]">Sign out</button> : <button onClick={()=>signIn("github")} className="w-full h-14 bg-white text-zinc-900 rounded-[14px] text-base font-semibold">Sign in with GitHub</button>}</div>
          </div>
        </div>
      )}
    </>
  )
}