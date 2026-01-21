'use client'

import { Chat } from '@/lib/types'
import { Trash2, MessageSquare } from 'lucide-react'
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
    return null
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
    <div className="space-y-6">
      {groups.map((group) => {
        if (group.chats.length === 0) return null
        
        return (
          <div key={group.label}>
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {group.label}
              </span>
            </div>
            <div className="space-y-0.5">
              {group.chats.map((chat) => {
                const isActive = chat.id === currentChatId
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors',
                      isActive
                        ? 'bg-black/5 dark:bg-white/5'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-sm truncate text-foreground">{chat.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteChat(chat.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
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
