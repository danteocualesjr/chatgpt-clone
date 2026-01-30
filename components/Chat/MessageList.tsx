'use client'

import { Message } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import { useEffect, useRef } from 'react'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto pt-16 pb-4 scroll-smooth">
      <div className="max-w-3xl mx-auto px-4">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MessageBubble message={message} isLoading={isLoading && index === messages.length - 1} />
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  )
}
