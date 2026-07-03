"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Github, LogOut, Sparkles, Menu, X } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false) }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/discover", label: "Discover" },
    { href: "/portfolio", label: "Portfolio" },
  ]

  return (
    <>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-to-main">Skip to main content</a>

      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#09090b]/70 backdrop-blur-2xl" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="MergeMind home">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">MergeMind</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {session && links.map(link => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
              return (
                <Link key={link.href} href={link.href} role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 text-base rounded-[14px] transition-all duration-200 ${
                    isActive ? "text-white font-medium bg-white/[0.04]" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                  }`}>
                  {link.label}
                  {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-purple-500 rounded-full" />}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <div className="hidden md:flex items-center gap-3">
                {session.user?.image && (
                  <img src={session.user.image} alt="Your avatar" className="w-8 h-8 rounded-full ring-1 ring-white/[0.06]" />
                )}
                <button onClick={() => signOut()} aria-label="Sign out"
                  className="flex items-center gap-1.5 px-3 py-2 text-base text-zinc-400 hover:text-zinc-200 rounded-[14px] hover:bg-white/[0.02] transition-all duration-200">
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button onClick={() => signIn("github")} 
                className="hidden md:flex items-center gap-2 h-11 px-5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-base font-semibold transition-all duration-200 shadow-sm shadow-white/5">
                <Github className="w-4 h-4" aria-hidden="true" /> Sign in
              </button>
            )}

            {/* Mobile hamburger */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="md:hidden p-2.5 text-zinc-400 hover:text-white rounded-[14px] hover:bg-white/[0.04] transition-all duration-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-[#09090b]/95 backdrop-blur-xl animate-fadeIn" role="dialog" aria-label="Mobile navigation">
          <div className="px-4 py-6 space-y-2">
            {session && links.map(link => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`block px-5 py-4 text-lg rounded-[14px] transition-all duration-200 ${
                    isActive ? "text-white font-medium bg-white/[0.04]" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                  }`}>{link.label}</Link>
              )
            })}
            <div className="pt-4 mt-4 border-t border-white/[0.04]">
              {session ? (
                <button onClick={() => { signOut(); setMobileOpen(false) }} 
                  className="w-full flex items-center gap-2 px-5 py-4 text-lg text-red-400 hover:bg-red-500/5 rounded-[14px] transition-all duration-200">
                  <LogOut className="w-5 h-5" aria-hidden="true" /> Sign out
                </button>
              ) : (
                <button onClick={() => signIn("github")} 
                  className="w-full flex items-center justify-center gap-2 h-14 bg-white hover:bg-zinc-100 text-zinc-900 rounded-[14px] text-lg font-semibold transition-all duration-200">
                  <Github className="w-5 h-5" aria-hidden="true" /> Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}