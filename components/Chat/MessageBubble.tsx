'use client'

import { Message } from '@/lib/types'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Heart, FileText } from 'lucide-react'
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

  // Loading state for assistant
  if (!message.content && message.role === 'assistant') {
    return (
      <div className="py-5">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse-soft">
            <Heart className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce-soft" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce-soft" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce-soft" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-5 group/message">
      <div className="flex gap-4">
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover/message:shadow-emerald-500/30 transition-shadow">
            <Heart className="w-4.5 h-4.5 text-white" fill="white" />
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${isUser ? 'ml-12' : ''}`}>
          {isUser ? (
            <div className="flex flex-col items-end gap-3">
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2.5 justify-end max-w-[85%]">
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="group/attachment animate-fade-in">
                      {attachment.type === 'image' ? (
                        <div className="rounded-2xl overflow-hidden border-2 border-border shadow-lg max-w-xs hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="max-w-full h-auto max-h-72 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted border border-border hover:border-primary/30 hover:shadow-md transition-all group-hover/attachment:scale-105">
                          <FileText className="w-5 h-5 text-muted-foreground group-hover/attachment:text-primary transition-colors" />
                          <span className="text-sm text-foreground font-medium">{attachment.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Text content */}
              {message.content && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl rounded-br-lg px-5 py-3.5 max-w-[85%] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.01]">
                  <p className="text-white whitespace-pre-wrap leading-relaxed select-text">{message.content}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-4 last:mb-0 text-foreground leading-relaxed text-[15px]">{children}</p>,
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
                        <code className="bg-muted px-2 py-1 rounded-lg text-sm font-mono text-foreground border border-border/50">
                          {children}
                        </code>
                      ) : (
                        <code className="text-foreground">{children}</code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="bg-muted/70 p-4 rounded-2xl overflow-x-auto mb-4 text-sm border border-border shadow-sm">
                        {children}
                      </pre>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold mb-3 mt-5 first:mt-0 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-3 border-emerald-500/50 pl-4 italic my-4 text-muted-foreground bg-muted/30 py-2 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Action buttons */}
              {message.content && (
                <div className="flex items-center gap-1 mt-5 opacity-0 group-hover/message:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                    aria-label="Copy message"
                    title="Copy"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500 animate-fade-in" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                    aria-label="Good response"
                    title="Good response"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                    aria-label="Bad response"
                    title="Bad response"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                    aria-label="Regenerate response"
                    title="Regenerate"
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
