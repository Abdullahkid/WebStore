"use client"

import { Store, DollarSign, Users, Instagram, BarChart, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Store,
      title: "Professional Storefront",
      description: "Stop sending Google Maps links in DMs. Get a real, branded store.",
      metric: "Setup in 10 minutes"
    },
    {
      icon: DollarSign,
      title: "Instant Payouts",
      description: "Money hits your account immediately. No 7-15 day delays.",
      metric: "₹0 to ₹50K in 24 hours"
    },
    {
      icon: Users,
      title: "Own Your Customers",
      description: "Export data anytime. Build relationships outside the platform.",
      metric: "100% data ownership"
    },
    {
      icon: Instagram,
      title: "Instagram Migration",
      description: "Bring your followers. Keep posting.",
      metric: "3-click setup"
    },
    {
      icon: BarChart,
      title: "Real Analytics",
      description: "Know your buyers, not just order numbers. Make better decisions.",
      metric: "Full business insights"
    },
    {
      icon: Zap,
      title: "Organic Growth",
      description: "Followers see your posts. No mandatory ad spending.",
      metric: "Non-pay-to-play"
    }
  ]

  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to Build Your Brand
          </h2>
          <p className="text-xl text-white/70">
            Professional tools. Zero marketplace restrictions.
          </p>
        </div>

        {/* Feature Grid - 3 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-brand-cyan/30 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-brand-cyan" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white/70 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Metric */}
              <div className="text-sm font-medium text-brand-cyan flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                {feature.metric}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
