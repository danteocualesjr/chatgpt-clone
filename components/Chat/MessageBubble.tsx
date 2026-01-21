'use client'

import { Message } from '@/lib/types'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Heart } from 'lucide-react'
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
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
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
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${isUser ? 'ml-11' : ''}`}>
          {isUser ? (
            <div className="flex justify-end">
              <div className="bg-muted rounded-3xl px-5 py-3 max-w-[85%]">
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
