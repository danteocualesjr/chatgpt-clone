'use client'

import { useChatContext } from '@/context/ChatContext'
import { MessageList } from './MessageList'
import { InputArea } from './InputArea'
import { WelcomeScreen } from './WelcomeScreen'
import { ChevronDown } from 'lucide-react'

export function ChatArea() {
  const { currentChat, isLoading, error, sendMessage, stopGeneration } = useChatContext()

  const showWelcome = !currentChat || currentChat.messages.length === 0

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Model selector style */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <span className="text-sm font-semibold text-foreground">HealthChat</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen onSendMessage={sendMessage} disabled={isLoading} />
        ) : (
          <MessageList
            messages={currentChat?.messages || []}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl text-sm shadow-lg">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0">
        <InputArea
          onSend={sendMessage}
          onStop={stopGeneration}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
