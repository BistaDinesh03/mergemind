import type { Metadata } from "next"
import { SessionProvider } from "@/components/providers/SessionProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "MergeMind — AI-Powered Open Source Intelligence",
  description: "Find the best GitHub issues. AI scores every opportunity. Start contributing today.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <SessionProvider>
          <div className="page-enter">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}