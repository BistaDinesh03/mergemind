"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Sparkles, Send, Bot, User, Loader2, Zap, FileText, Lightbulb } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  actionItems?: string[]
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your MergeMind AI assistant. I can help you find the best issues to contribute to, analyze repositories, and give PR advice. What would you like help with?",
      actionItems: [
        "Find beginner-friendly issues",
        "Analyze a repository",
        "Get PR preparation tips",
        "Check contribution opportunities",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response (will be replaced with real API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        default: "I analyzed the available opportunities. Here are my recommendations based on your skills and goals. Would you like me to dive deeper into any specific repository or issue?",
        find: "I found several good first issues that match your profile. The top pick is in the 'react' repository - it's well-documented and has active maintainers. Would you like me to analyze it in detail?",
        analyze: "Based on my analysis, this repository has excellent documentation (85/100) and active maintainers who typically respond within 4 hours. The merge probability for well-prepared PRs is around 75%.",
        pr: "Before submitting your PR, make sure to: 1) Read CONTRIBUTING.md carefully, 2) Run all existing tests, 3) Keep your changes focused and under 200 lines, 4) Reference the issue number in your PR description.",
      }

      let responseText = responses.default
      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("find") || lowerInput.includes("issue")) {
        responseText = responses.find
      } else if (lowerInput.includes("analyze") || lowerInput.includes("repo")) {
        responseText = responses.analyze
      } else if (lowerInput.includes("pr") || lowerInput.includes("pull request")) {
        responseText = responses.pr
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseText,
        actionItems: [
          "Show me more details",
          "Find similar issues",
          "Add to my daily plan",
        ],
      }

      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleActionClick = (action: string) => {
    setInput(action)
    handleSend()
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Assistant</h1>
                <p className="text-sm text-gray-400">Powered by Ollama + Llama 3</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={lex gap-3 animate-fadeIn }
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={max-w-[70%]  p-4}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Action items */}
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actionItems.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(action)}
                          className="px-3 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 border border-gray-600 rounded-lg transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-dark-800 border border-gray-700 rounded-xl p-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-6 py-3 border-t border-gray-800 flex gap-2 overflow-x-auto">
            {[
              { icon: Zap, label: "Find good first issues" },
              { icon: FileText, label: "Analyze a repository" },
              { icon: Lightbulb, label: "PR tips for beginners" },
            ].map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => setInput(prompt.label)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-dark-800 border border-gray-700 rounded-lg hover:bg-dark-700 transition-colors whitespace-nowrap"
              >
                <prompt.icon className="w-3 h-3 text-gray-400" />
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about issues, repositories, or contribution advice..."
                className="flex-1 px-4 py-3 bg-dark-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
