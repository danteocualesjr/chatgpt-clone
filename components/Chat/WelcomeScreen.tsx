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
    <div className="h-full flex flex-col items-center justify-center px-4 animate-fade-in pt-14">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="relative mb-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-shadow duration-500 hover:scale-105 transition-transform">
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed">
          Ask me about symptoms, nutrition, fitness, mental health, or any wellness topic.
        </p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion.text)}
                disabled={disabled}
                className="group flex items-center gap-3.5 p-4.5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${suggestion.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
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
