'use client'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { ChatArea } from '@/components/Chat/ChatArea'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatArea />
        
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="group absolute top-4 right-4 p-2.5 rounded-xl bg-background/70 backdrop-blur-xl border border-border/50 hover:bg-background/90 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 z-10"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
          ) : (
            <Moon className="w-5 h-5 text-foreground group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
      </main>
    </div>
  )
}
