'use client'

import { Heart, Stethoscope, Brain, Salad, Dumbbell } from 'lucide-react'

const suggestions = [
  { icon: Stethoscope, text: "What are common cold symptoms?", color: "from-blue-500 to-cyan-500" },
  { icon: Brain, text: "Tips for managing stress", color: "from-violet-500 to-purple-500" },
  { icon: Salad, text: "How to eat a balanced diet?", color: "from-emerald-500 to-green-500" },
  { icon: Dumbbell, text: "Beginner workout routine", color: "from-orange-500 to-amber-500" },
]

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function WelcomeScreen({ onSendMessage, disabled }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-10">
          Ask me about symptoms, nutrition, fitness, mental health, or any wellness topic.
        </p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion.text)}
                disabled={disabled}
                className="group flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${suggestion.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {suggestion.text}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
