"use client"
import { Star, GitFork, AlertCircle, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { memo } from "react"

interface RepoCardProps {
  repo: {
    full_name: string
    owner: { login: string; avatar: string }
    description: string
    stars: number
    forks: number
    open_issues: number
    language: string
    topics: string[]
    updated_at: string
  }
}

export const RepoCard = memo(function RepoCard({ repo }: RepoCardProps) {
  const daysAgo = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / 86400000)

  return (
    <Link href={`/repo/${repo.full_name}`}
      className="block bg-[#111318] border border-gray-800/50 rounded-xl p-4 sm:p-5 hover:border-gray-600 hover:bg-[#151820] transition-all duration-200 group">
      <div className="flex items-start gap-3 mb-3">
        <Image src={repo.owner.avatar} alt={repo.owner.login} width={40} height={40} 
          className="rounded-full border border-gray-700/50 flex-shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{repo.full_name}</h3>
          <p className="text-xs text-gray-500">{repo.owner.login}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 transition-colors flex-shrink-0 mt-1" />
      </div>
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {repo.topics.slice(0,4).map(t => <span key={t} className="px-2 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded-full">{t}</span>)}
        </div>
      )}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {repo.language && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"/>{repo.language}</span>}
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5"/>{repo.stars.toLocaleString()}</span>
        <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5"/>{repo.forks.toLocaleString()}</span>
        <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>{repo.open_issues}</span>
        <span className="ml-auto flex items-center gap-1"><Clock className="w-3 h-3"/>{daysAgo}d ago</span>
      </div>
    </Link>
  )
})

export const RepoCardSkeleton = memo(function RepoCardSkeleton() {
  return (
    <div className="bg-[#111318] border border-gray-800/50 rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex items-start gap-3"><div className="w-10 h-10 bg-gray-700/40 rounded-full"/><div className="flex-1 space-y-2"><div className="h-4 bg-gray-700/40 rounded w-3/4"/><div className="h-3 bg-gray-700/40 rounded w-1/2"/></div></div>
      <div className="h-4 bg-gray-700/40 rounded w-full"/><div className="h-4 bg-gray-700/40 rounded w-2/3"/>
      <div className="flex gap-3"><div className="h-3 bg-gray-700/40 rounded w-16"/><div className="h-3 bg-gray-700/40 rounded w-16"/></div>
    </div>
  )
})