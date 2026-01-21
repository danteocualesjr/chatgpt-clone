'use client'

import { useChatContext } from '@/context/ChatContext'
import { MessageList } from './MessageList'
import { InputArea } from './InputArea'
import { WelcomeScreen } from './WelcomeScreen'
import { ChevronDown, Zap } from 'lucide-react'

export function ChatArea() {
  const { currentChat, isLoading, error, sendMessage, stopGeneration } = useChatContext()

  const showWelcome = !currentChat || currentChat.messages.length === 0

  return (
    <div className="flex flex-col h-full relative bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 hover:bg-background/80 hover:border-border transition-all duration-200 shadow-sm">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
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
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 animate-fade-in">
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-3 rounded-2xl text-sm shadow-xl backdrop-blur">
            {error}
          </div>
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
