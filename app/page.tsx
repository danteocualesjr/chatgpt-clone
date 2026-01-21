'use client'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { ChatArea } from '@/components/Chat/ChatArea'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatArea />
        
        {/* Dark mode toggle - top right */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
        </button>
      </main>
    </div>
  )
}
