import type { Metadata } from "next"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { CommandPaletteProvider } from "@/components/providers/CommandPaletteProvider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "MergeMind — AI-Powered Open Source Intelligence",
    template: "%s — MergeMind",
  },
  description: "Find the best GitHub issues. AI scores every opportunity by difficulty, merge chance, and career value.",
  keywords: ["open source", "github", "contributions", "AI", "developer tools"],
  openGraph: { title: "MergeMind", description: "AI-powered open source intelligence", type: "website" },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090b] text-white antialiased">
        <ErrorBoundary>
          <SessionProvider>
            <CommandPaletteProvider>
              {children}
            </CommandPaletteProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}