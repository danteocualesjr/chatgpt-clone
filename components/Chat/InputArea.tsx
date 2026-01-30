'use client'

import { useState, KeyboardEvent, useRef, useEffect, DragEvent } from 'react'
import { ArrowUp, Square, Paperclip, Mic, X, ImageIcon, FileText } from 'lucide-react'

interface AttachedFile {
  id: string
  file: File
  preview?: string
  type: 'image' | 'file'
}

interface InputAreaProps {
  onSend: (message: string, files?: AttachedFile[]) => void
  onStop: () => void
  isLoading: boolean
}

export function InputArea({ onSend, onStop, isLoading }: InputAreaProps) {
  const [input, setInput] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substring(7)
      const isImage = file.type.startsWith('image/')
      
      if (isImage) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setAttachedFiles(prev => [...prev, {
            id,
            file,
            preview: e.target?.result as string,
            type: 'image'
          }])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachedFiles(prev => [...prev, {
          id,
          file,
          type: 'file'
        }])
      }
    })
  }

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleSend = () => {
    if ((input.trim() || attachedFiles.length > 0) && !isLoading) {
      onSend(input, attachedFiles.length > 0 ? attachedFiles : undefined)
      setInput('')
      setAttachedFiles([])
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

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    const files: File[] = []
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) files.push(file)
      }
    }
    
    if (files.length > 0) {
      const dt = new DataTransfer()
      files.forEach(f => dt.items.add(f))
      handleFiles(dt.files)
    }
  }

  return (
    <div className="pb-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative flex flex-col rounded-3xl border transition-all duration-300 shadow-lg ${
            isDragging 
              ? 'border-primary bg-primary/5 shadow-primary/30 scale-[1.01]' 
              : 'bg-card border-border shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:border-border/80'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-3xl z-10 pointer-events-none backdrop-blur-sm">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-medium text-primary">Drop files here</p>
              </div>
            </div>
          )}

          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2.5 p-3.5 pb-2 animate-fade-in">
              {attachedFiles.map((file) => (
                <div key={file.id} className="relative group animate-fade-in">
                  {file.type === 'image' && file.preview ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border shadow-md hover:shadow-lg transition-all group-hover:scale-105">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted border border-border hover:border-primary/30 hover:shadow-md transition-all group-hover:scale-105">
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-foreground max-w-[120px] truncate font-medium">
                        {file.file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 hover:bg-red-600 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end">
            {/* Attachment button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 p-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            {/* Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Ask anything about health..."
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent py-4 text-[15px] placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 max-h-[200px] leading-relaxed focus:placeholder:text-muted-foreground/40 transition-colors"
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-2 pr-3 pb-3">
              {/* Microphone button */}
              <button
                className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all hover:scale-110 active:scale-95"
                aria-label="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send/Stop button */}
              {isLoading ? (
                <button
                  onClick={onStop}
                  className="p-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:scale-110 active:scale-95"
                  aria-label="Stop generation"
                >
                  <Square className="w-5 h-5" fill="currentColor" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() && attachedFiles.length === 0}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none hover:scale-110 active:scale-95 hover:shadow-emerald-500/40"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground/60 mt-3 text-center">
          HealthChat provides information only. Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  )
}
