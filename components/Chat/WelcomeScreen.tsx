'use client'

import { Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          How can I help with your health today?
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Ask me about symptoms, nutrition, fitness, mental health, or any wellness topic.
        </p>
      </div>
    </div>
  )
}
