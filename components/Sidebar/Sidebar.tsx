'use client'

import { useChatContext } from '@/context/ChatContext'
import { Plus, Search, PanelLeft, Heart } from 'lucide-react'
import { ChatHistory } from './ChatHistory'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { chats, currentChatId, createNewChat, selectChat, deleteChat } = useChatContext()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[hsl(var(--sidebar-bg))] flex flex-col transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden'
        )}
      >
        {/* Header with logo */}
        <div className="flex items-center justify-between p-3 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors lg:flex hidden"
            aria-label="Close sidebar"
          >
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-2">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 mb-4">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground">
            <Search className="w-5 h-5" />
            <span className="text-sm">Search chats</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          <ChatHistory
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={(id) => {
              selectChat(id)
              if (window.innerWidth < 1024) setIsOpen(false)
            }}
            onDeleteChat={deleteChat}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <span className="text-sm font-medium text-foreground">User</span>
          </button>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed lg:absolute top-3 left-3 z-50 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <PanelLeft className="w-5 h-5 text-foreground" />
        </button>
      )}
    </>
  )
}
