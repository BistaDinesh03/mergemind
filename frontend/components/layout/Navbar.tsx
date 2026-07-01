"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Github, LogOut, Menu, X, Search } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-dark-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">MergeMind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {session && (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/discover" className="text-gray-300 hover:text-white transition-colors">
                  Discover
                </Link>
                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-gray-600"
                  />
                )}
                <span className="text-gray-300 text-sm">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="flex items-center gap-2 px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600 text-sm"
              >
                <Github className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-dark-900">
          <div className="px-4 py-4 space-y-3">
            {session ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-dark-800">
                  Dashboard
                </Link>
                <Link href="/discover" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-dark-800">
                  Discover
                </Link>
                <Link href="/portfolio" className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-dark-800">
                  Portfolio
                </Link>
                <hr className="border-gray-700" />
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-dark-800 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("github")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 rounded-lg"
              >
                <Github className="w-5 h-5" />
                Sign In with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
