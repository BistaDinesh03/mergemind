// API Configuration
export const API_BASE = "http://localhost:8000"

// Languages for filtering
export const LANGUAGES = ["python", "javascript", "typescript", "rust", "go", "java", "ruby"]

// Sort options
export const SORT_OPTIONS = [
  { value: "stars", label: "Most Stars" },
  { value: "updated", label: "Recently Updated" },
  { value: "forks", label: "Most Forks" },
]

// Navigation links
export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/portfolio", label: "Portfolio" },
]

// Score thresholds
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
}