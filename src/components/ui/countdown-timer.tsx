"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ launchDate }: { launchDate: Date }) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +launchDate - +new Date()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  return (
    <div className="inline-flex items-center gap-2 sm:gap-4 bg-urgency-orange/10 border border-urgency-orange/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 animate-urgency-pulse">
      <span className="text-urgency-orange font-semibold text-xs sm:text-sm">Launching in:</span>
      <div className="flex items-center gap-1 sm:gap-2">
        <TimeUnit value={timeLeft.days} label="d" />
        <span className="text-urgency-orange">:</span>
        <TimeUnit value={timeLeft.hours} label="h" />
        <span className="text-urgency-orange">:</span>
        <TimeUnit value={timeLeft.minutes} label="m" />
        <span className="text-urgency-orange hidden sm:inline">:</span>
        <TimeUnit value={timeLeft.seconds} label="s" className="hidden sm:flex" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label, className = "" }: { value: number; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      <span className="text-brand-white font-bold text-base sm:text-lg min-w-[1.5rem] sm:min-w-[2rem] text-center">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-urgency-orange/80 text-xs">{label}</span>
    </div>
  )
}
