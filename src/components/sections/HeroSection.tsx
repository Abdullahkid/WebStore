"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { ArrowRight, Users } from "lucide-react"

export function HeroSection() {
  // Calculate launch date (14 days from now - adjust as needed)
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 14)

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Pre-launch Badge - Small, not prominent */}
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 bg-trust-green rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm text-white/70">
                Launching in 14 days • 200+ sellers ready
              </span>
            </div>

            {/* MASSIVE Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6">
              Your Store, Your Brand, <span className="text-brand-cyan">Your Customers</span>
              <br />
              {/* Not Another Marketplace That Owns Them. */}
            </h1>

            {/* Subheading - Clear value prop */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed">
              The social commerce marketplace that bridges 
              <br className="hidden sm:block" />
              buyers and sellers, never controls them.
            </p>

            {/* Single Primary CTA - HUGE */}
            <div className="flex flex-col items-center lg:items-start gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Button className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl font-bold bg-brand-cyan text-black rounded-full hover:bg-brand-cyan-light transition-all duration-300 shadow-2xl shadow-brand-cyan/30 hover:scale-105 w-full sm:w-auto">
                Claim Your Store →
              </Button>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-white/50">
                Free setup • No credit card required
              </p>
            </div>

            {/* Trust Badges - Small, subtle */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-trust-green rounded-full" />
                <span>Zero listing fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-trust-green rounded-full" />
                <span>Instant payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-trust-green rounded-full" />
                <span>Own your data</span>
              </div>
            </div>
          </div>

          {/* Right Column - Marketplace Feed Images - Desktop */}
          <div className="relative hidden lg:block">
            {/* Marketplace Feed - Back */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl translate-x-12">
              <img
                src="/marketplace-feed.png"
                alt="Marketplace Feed Preview"
                className="w-full h-auto"
              />
            </div>
            {/* Store Profile - Front, overlapping bottom left */}
            <div className="absolute bottom-0 left-0 h-full w-auto rounded-2xl overflow-hidden shadow-2xl z-10 -translate-x-8 translate-y-16">
              <img
                src="/store-profile.png"
                alt="Store Profile Preview"
                className="h-full w-auto object-cover"
              />
            </div>
          </div>

          {/* Mobile Version - Images */}
          <div className="lg:hidden mt-8 sm:mt-12">
            <div className="relative max-w-sm mx-auto pb-12">
              {/* Marketplace Feed - Back */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/marketplace-feed.png"
                  alt="Marketplace Feed Preview"
                  className="w-full h-auto"
                />
              </div>
              {/* Store Profile - Front, overlapping bottom left */}
              <div className="absolute bottom-0 left-0 h-3/4 w-auto rounded-xl overflow-hidden shadow-2xl z-10 -translate-x-3 sm:-translate-x-4 translate-y-8 sm:translate-y-12">
                <img
                  src="/store-profile.png"
                  alt="Store Profile Preview"
                  className="h-full w-auto object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
