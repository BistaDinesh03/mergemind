"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Github, LogOut } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-[#0a0a0f]">
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">MergeMind</Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
            <Link href="/assistant" className="text-gray-300 hover:text-white text-sm">AI Chat</Link>
            <button onClick={() => signOut()} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => signIn("github")} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg">
            <Github className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </nav>
  )
}