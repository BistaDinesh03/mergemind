// GitHub Types
export interface GitHubOwner {
  login: string
  avatar: string
  type?: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  owner: GitHubOwner
  description: string
  stars: number
  forks: number
  open_issues: number
  watchers?: number
  language: string
  topics: string[]
  updated_at: string
  pushed_at?: string
  url: string
  homepage?: string
  license?: string | null
  default_branch?: string
  archived?: boolean
  has_issues?: boolean
  has_wiki?: boolean
  has_pages?: boolean
  has_discussions?: boolean
  subscribers?: number
  latest_release?: { tag: string; published_at?: string } | null
  health?: HealthData
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body?: string
  state: string
  labels: string[]
  comments: number
  comments_count?: number
  created_at: string
  updated_at?: string
  url: string
  author?: GitHubOwner
  assignees?: GitHubOwner[]
  is_beginner_friendly: boolean
}

export interface IssueDetail {
  id: number
  number: number
  title: string
  body?: string
  state: string
  labels: string[]
  comments_count?: number
  created_at: string
  updated_at?: string
  url: string
  author?: GitHubOwner
  assignees?: GitHubOwner[]
  is_beginner_friendly: boolean
  repository: { full_name: string; stars: number; language?: string }
  comments: GitHubComment[]
  scoring: IssueScore
}

export interface GitHubComment {
  id: number
  body: string
  author: GitHubOwner
  created_at: string
}

// Scoring Types
export interface ScoreFactor {
  score: number
  weight: number
  weighted?: number
  label: string
  reason: string
  icon: string
}

export interface IssueScore {
  overall_score: number
  verdict: string
  factors: Record<string, ScoreFactor>
  summary: string[]
  recommendation: string
}

export interface HealthCategory {
  score: number
  label: string
  icon: string
  reasons: string[]
}

export interface HealthData {
  overall: number
  status: string
  categories: Record<string, HealthCategory>
  summary: string[]
  recommendations: string[]
}

// Portfolio Types
export interface PortfolioData {
  username: string
  name?: string
  bio?: string
  avatar?: string
  followers: number
  public_repos: number
  repositories: GitHubRepo[]
  generated_by: string
}

// Recommendation Types
export interface Recommendation {
  issue_number: number
  title: string
  repo: string
  repo_stars: number
  labels: string[]
  composite_score: number
  overall_score: number
  difficulty_score: number
  merge_chance: number
  beginner_score: number
  repo_health: number
  url: string
  verdict: string
  estimated_hours: string
  reason: string
}

// Component Props
export interface EmptyStateProps {
  type: "repos" | "issues" | "recommendations" | "portfolio" | "search" | "generic"
  title?: string
  description?: string
}

export interface ErrorDisplayProps {
  type?: "network" | "api" | "notfound" | "auth" | "generic"
  message?: string
  onRetry?: () => void
}