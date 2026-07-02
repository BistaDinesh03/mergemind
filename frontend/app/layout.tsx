import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'MergeMind',
  description: 'The AI-powered Open Source Intelligence Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}