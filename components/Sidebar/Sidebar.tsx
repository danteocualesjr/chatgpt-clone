'use client'

import { useChatContext } from '@/context/ChatContext'
import { Plus, Search, PanelLeft, Heart, Menu } from 'lucide-react'
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[hsl(var(--sidebar-bg))] flex flex-col transition-all duration-300 ease-out border-r border-border/50',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="font-semibold text-foreground tracking-tight">HealthChat</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-foreground/5 transition-all duration-200 hover:scale-110 active:scale-95 lg:flex hidden"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 mb-1">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 transition-all duration-200 text-foreground group hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95"
            title="New chat (Ctrl+N)"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-foreground/5 transition-all duration-200 text-muted-foreground hover:text-foreground group active:scale-95" title="Search chats (Ctrl+K)">
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Search chats</span>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-border/50" />

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
        <div className="p-3 border-t border-border/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-foreground/5 transition-all duration-200 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-medium text-foreground block">User</span>
              <span className="text-xs text-muted-foreground">Free plan</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed lg:absolute top-4 left-4 z-50 p-2.5 rounded-xl bg-background/80 backdrop-blur border border-border shadow-lg hover:bg-foreground/5 transition-all duration-200"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}
    </>
  )
}
