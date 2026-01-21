'use client'

import { Chat } from '@/lib/types'
import { Trash2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatHistoryProps {
  chats: Chat[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export function ChatHistory({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: ChatHistoryProps) {
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <MessageCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground text-center">No conversations yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1 text-center">Start a new chat to begin</p>
      </div>
    )
  }

  // Group chats by date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const groups: { label: string; chats: Chat[] }[] = [
    { label: 'Today', chats: [] },
    { label: 'Yesterday', chats: [] },
    { label: 'Previous 7 Days', chats: [] },
    { label: 'Older', chats: [] },
  ]

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt)
    if (chatDate.toDateString() === today.toDateString()) {
      groups[0].chats.push(chat)
    } else if (chatDate.toDateString() === yesterday.toDateString()) {
      groups[1].chats.push(chat)
    } else if (chatDate > lastWeek) {
      groups[2].chats.push(chat)
    } else {
      groups[3].chats.push(chat)
    }
  })

  return (
    <div className="space-y-6 py-2">
      {groups.map((group, groupIndex) => {
        if (group.chats.length === 0) return null
        
        return (
          <div key={group.label} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 50}ms` }}>
            <div className="px-4 mb-2">
              <span className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
                {group.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.chats.map((chat, chatIndex) => {
                const isActive = chat.id === currentChatId
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      'group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20'
                        : 'hover:bg-foreground/5'
                    )}
                    onClick={() => onSelectChat(chat.id)}
                    style={{ animationDelay: `${(groupIndex * 50) + (chatIndex * 30)}ms` }}
                  >
                    <MessageCircle className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-emerald-500' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'flex-1 text-sm truncate transition-colors',
                      isActive ? 'text-foreground font-medium' : 'text-foreground/80'
                    )}>
                      {chat.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
