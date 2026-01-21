import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChatProvider } from '@/context/ChatContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthChat - Your AI Health Assistant',
  description: 'A healthcare-focused AI chat assistant for health and wellness information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  )
}
