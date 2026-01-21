'use client'

import { Message } from '@/lib/types'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Don't render empty assistant messages (loading state handled separately)
  if (!message.content && message.role === 'assistant') {
    return (
      <div className="py-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="flex gap-4">
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${isUser ? 'ml-12' : ''}`}>
          {isUser ? (
            <div className="flex justify-end">
              <div className="bg-muted/70 rounded-3xl px-5 py-3 max-w-[85%]">
                <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0 text-foreground leading-relaxed">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-foreground">{children}</li>,
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                          {children}
                        </code>
                      ) : (
                        <code className="text-foreground">{children}</code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-muted p-4 rounded-xl overflow-x-auto mb-4 text-sm">
                        {children}
                      </pre>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl font-semibold mb-4 mt-6 first:mt-0 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Action buttons for assistant messages */}
              {message.content && (
                <div className="flex items-center gap-1 mt-4">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy message"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Good response"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Bad response"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Regenerate response"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
