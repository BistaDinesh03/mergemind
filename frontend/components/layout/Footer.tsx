export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 MergeMind. The AI-powered Open Source Intelligence Platform.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              GitHub
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
