'use client'

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-foreground mb-2">
          How can I help with your health today?
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Ask me about symptoms, nutrition, fitness, mental health, or any wellness topic.
        </p>
      </div>
    </div>
  )
}
