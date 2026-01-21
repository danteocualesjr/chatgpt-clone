'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { Chat, Message, Attachment } from '@/lib/types'
import { generateId } from '@/lib/utils'

const STORAGE_KEY = 'healthchat-chats'

interface AttachedFile {
  id: string
  file: File
  preview?: string
  type: 'image' | 'file'
}

interface ChatContextType {
  chats: Chat[]
  currentChat: Chat | null
  currentChatId: string | null
  isLoading: boolean
  error: string | null
  createNewChat: () => string
  deleteChat: (chatId: string) => void
  selectChat: (chatId: string) => void
  sendMessage: (content: string, files?: AttachedFile[]) => Promise<void>
  stopGeneration: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load chats from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedChats = JSON.parse(stored).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setChats(parsedChats)
      }
    } catch (err) {
      console.error('Failed to load chats from localStorage:', err)
    }
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (err) {
      console.error('Failed to save chats to localStorage:', err)
    }
  }, [chats])

  const currentChat = chats.find(chat => chat.id === currentChatId) || null

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setError(null)
    return newChat.id
  }, [])

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const remaining = prev.filter(chat => chat.id !== chatId)
      if (currentChatId === chatId) {
        setCurrentChatId(remaining.length > 0 ? remaining[0].id : null)
      }
      return remaining
    })
  }, [currentChatId])

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId)
    setError(null)
  }, [])

  const sendMessage = useCallback(async (content: string, files?: AttachedFile[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || isLoading) return

    setError(null)
    setIsLoading(true)

    let chatId = currentChatId
    let existingMessages: Message[] = []

    if (!chatId) {
      chatId = createNewChat()
    } else {
      const chat = chats.find(c => c.id === chatId)
      existingMessages = chat?.messages || []
    }

    // Process attachments
    const attachments: Attachment[] = files?.map(f => ({
      id: f.id,
      name: f.file.name,
      type: f.type,
      url: f.preview || '',
      mimeType: f.file.type,
    })) || []

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    const assistantMessageId = generateId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    // Add both messages and update title
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id !== chatId) return chat
        
        const isFirstMessage = chat.messages.length === 0
        const newTitle = isFirstMessage ? (content.trim() || 'Image chat').slice(0, 50) : chat.title
        
        return {
          ...chat,
          title: newTitle,
          messages: [...chat.messages, userMessage, assistantMessage],
          updatedAt: new Date(),
        }
      })
    })

    // Prepare API messages with image support
    const apiMessages = [
      ...existingMessages.map(msg => {
        if (msg.attachments && msg.attachments.length > 0) {
          const imageAttachments = msg.attachments.filter(a => a.type === 'image')
          if (imageAttachments.length > 0) {
            return {
              role: msg.role,
              content: [
                { type: 'text', text: msg.content || 'What do you see in this image?' },
                ...imageAttachments.map(a => ({
                  type: 'image_url',
                  image_url: { url: a.url }
                }))
              ]
            }
          }
        }
        return { role: msg.role, content: msg.content }
      }),
      // Current message
      attachments.length > 0 && attachments.some(a => a.type === 'image')
        ? {
            role: 'user' as const,
            content: [
              { type: 'text', text: content.trim() || 'What do you see in this image?' },
              ...attachments.filter(a => a.type === 'image').map(a => ({
                type: 'image_url',
                image_url: { url: a.url }
              }))
            ]
          }
        : { role: 'user' as const, content: content.trim() },
    ]

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                accumulatedContent += parsed.content
                setChats(prev =>
                  prev.map(chat =>
                    chat.id === chatId
                      ? {
                          ...chat,
                          messages: chat.messages.map(msg =>
                            msg.id === assistantMessageId
                              ? { ...msg, content: accumulatedContent }
                              : msg
                          ),
                          updatedAt: new Date(),
                        }
                      : chat
                  )
                )
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      }

      setIsLoading(false)
    } catch (err: any) {
      if (err.name === 'AbortError') return
      
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
      setIsLoading(false)

      // Remove empty assistant message on error
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.filter(msg => msg.id !== assistantMessageId),
              }
            : chat
        )
      )
    }
  }, [currentChatId, chats, isLoading, createNewChat])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        currentChatId,
        isLoading,
        error,
        createNewChat,
        deleteChat,
        selectChat,
        sendMessage,
        stopGeneration,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
