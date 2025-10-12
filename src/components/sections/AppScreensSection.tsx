"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export function AppScreensSection() {
  const appScreens = [
    {
      title: "Social Feed",
      tagline: "Discover products through stores you follow",
      imageSrc: "/app-mockups/feed-screen/feed-screen.png",
      highlights: [
        "Personalized For You feed",
        "Follow stores like Instagram",
        "Category-based discovery"
      ]
    },
    {
      title: "Store Profiles",
      tagline: "Professional storefronts that build brand identity",
      imageSrc: "/app-mockups/store-profile/store-profile.png",
      highlights: [
        "Complete product catalog",
        "Customer reviews & ratings",
        "Direct contact options"
      ]
    },
    {
      title: "Direct Chat",
      tagline: "Talk to sellers in real-time, build relationships",
      imageSrc: "/app-mockups/chat-screen/chat-screen.png",
      highlights: [
        "Image sharing for inquiries",
        "Instant responses",
        "Order negotiation"
      ]
    },
    {
      title: "Local Discovery",
      tagline: "Find nearby stores and support local businesses",
      imageSrc: "/app-mockups/location-feed/location-feed.png",
      highlights: [
        "Distance-based search",
        "Faster delivery times",
        "Support local economy"
      ]
    }
  ]

  return (
    <section id="app-screens" className="section-padding bg-gradient-to-b from-brand-dark-gray to-brand-black">
      <div className="container-width">
        <div className="text-center mb-24 stagger-children">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-brand-white">App </span>
            <span className="text-gradient-animated">Features</span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-white/80 max-w-4xl mx-auto leading-relaxed">
            Explore the key screens that make Downxtown the ultimate social commerce experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 stagger-children">
          {appScreens.map((screen, index) => (
            <Card
              key={index}
              className="hover-glow transition-all duration-500 bg-gradient-to-br from-brand-dark-gray/80 to-brand-medium-gray/80 border-brand-cyan/30 backdrop-blur-sm hover:border-brand-cyan/60 hover:shadow-2xl hover:shadow-brand-cyan/20 group"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-brand-white text-xl xl:text-lg group-hover:text-brand-cyan transition-colors duration-300">
                  {screen.title}
                </CardTitle>
                <CardDescription className="text-brand-white/70 text-sm mt-2">
                  {screen.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full max-w-xs mx-auto">
                    <Image
                      src={screen.imageSrc}
                      alt={`${screen.title} - Downxtown App`}
                      width={288}
                      height={600}
                      className="w-full rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500 border border-brand-cyan/20"
                    />
                  </div>
                  <ul className="space-y-2 w-full">
                    {screen.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-brand-white/70 text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
