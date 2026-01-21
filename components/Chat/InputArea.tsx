'use client'

import { useState, KeyboardEvent, useRef, useEffect, DragEvent } from 'react'
import { ArrowUp, Square, Paperclip, Mic, X, Image as ImageIcon, File } from 'lucide-react'

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

    const newFiles: AttachedFile[] = []
    
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
    <div className="pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative flex flex-col bg-muted/50 rounded-3xl border transition-all ${
            isDragging 
              ? 'border-primary border-2 bg-primary/5' 
              : 'border-border'
          } shadow-sm`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-3xl z-10 pointer-events-none">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-primary">Drop files here</p>
              </div>
            </div>
          )}

          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 pb-0">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group"
                >
                  {file.type === 'image' && file.preview ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-foreground max-w-[100px] truncate">
                        {file.file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
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
              className="flex-shrink-0 p-3 text-muted-foreground hover:text-foreground transition-colors"
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
                  disabled={!input.trim() && attachedFiles.length === 0}
                  className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          HealthChat can make mistakes. Consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  )
}
