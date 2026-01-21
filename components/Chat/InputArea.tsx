'use client'

import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { ArrowUp, Square, Paperclip, Mic } from 'lucide-react'

interface InputAreaProps {
  onSend: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

export function InputArea({ onSend, onStop, isLoading }: InputAreaProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-muted/50 rounded-3xl border border-border shadow-sm">
          {/* Attachment button */}
          <button
            className="flex-shrink-0 p-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 max-h-[200px]"
          />

          {/* Right side buttons */}
          <div className="flex items-center gap-1 pr-2">
            {/* Status dot */}
            <div className="w-2 h-2 rounded-full bg-primary mr-1" />
            
            {/* Microphone button */}
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send/Stop button */}
            {isLoading ? (
              <button
                onClick={onStop}
                className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                aria-label="Stop generation"
              >
                <Square className="w-4 h-4" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          HealthChat can make mistakes. Consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  )
}
