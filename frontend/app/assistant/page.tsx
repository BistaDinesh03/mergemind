"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about open source. I respond in seconds!" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setMessages(prev => [...prev, { role: "user", content: text }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.response || "No response" }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Cannot reach AI. Is backend running?" }])
    }
    
    setLoading(false)
  }

  const quick = [
    "Best repos for beginners?",
    "How to make first PR?",
    "Tips for open source?",
    "Python projects to join?"
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <p className="text-xs text-green-400">Llama 3 - Fast responses</p>
        </div>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-purple-600" : "bg-gray-600"}`}>
              {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600" : "bg-[#1a1a2e] border border-gray-700"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5" /></div>
            <div className="bg-[#1a1a2e] border border-gray-700 rounded-2xl px-4 py-2.5"><Loader2 className="w-4 h-4 animate-spin text-purple-400" /></div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-800">
        {quick.map((q, i) => (
          <button key={i} onClick={() => send(q)} className="px-3 py-1.5 text-xs bg-[#1a1a2e] border border-gray-700 rounded-full hover:bg-gray-700 whitespace-nowrap">
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-3 bg-[#1a1a2e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl disabled:opacity-40">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  )
}