"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle2, Store, Zap, TrendingUp } from "lucide-react"

export function AboutSection() {
  const marketplaceIssues = [
    {
      text: "Platform owns all customer data",
      detail: "Can't export contacts or reach customers outside platform"
    },
    {
      text: "Forced ad spending for visibility",
      detail: "Pay ₹10,000s monthly just to appear in search results"
    },
    {
      text: "7-15 day payment delays",
      detail: "Your money is held hostage while bills pile up"
    },
    {
      text: "Your brand stays invisible",
      detail: "Customers remember Amazon, not your store name"
    },
    {
      text: "Platform competes with you",
      detail: "Private labels copy your products at lower prices"
    }
  ]

  const DownxtownBenefits = [
    {
      text: "You own 100% of customer data",
      detail: "Export anytime, contact anywhere, build relationships"
    },
    {
      text: "Grow organically through followers",
      detail: "Zero mandatory ad spend, your posts reach your audience"
    },
    {
      text: "Instant payouts in minutes",
      detail: "Money hits your account immediately after order"
    },
    {
      text: "Your brand front and center",
      detail: "Customers follow YOUR store, remember YOUR name"
    },
    {
      text: "We never compete with sellers",
      detail: "No private labels, no conflicts, your success is our success"
    }
  ]

  const bridgeFeatures = [
    {
      icon: Store,
      title: "Store-First Design",
      description: "Your storefront is the hero. Buyers discover stores first, products second. Build a brand customers remember and trust.",
      color: "text-brand-cyan",
      stat: "85% of buyers follow stores"
    },
    {
      icon: Zap,
      title: "Direct Customer Chat",
      description: "Real-time messaging built in. Answer questions, provide support, build loyalty. No middleman between you and your customers.",
      color: "text-brand-teal",
      stat: "3x higher repeat purchases"
    },
    {
      icon: TrendingUp,
      title: "Complete Autonomy",
      description: "Set your prices, choose delivery partners, design your store. Run your business your way, with zero platform interference.",
      color: "text-seller-primary",
      stat: "100% seller control"
    }
  ]

  return (
    <section id="about" className="section-padding bg-black">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-20 stagger-children">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-white">The </span>
            <span className="text-brand-cyan">Bridge Model</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-4">
            We <span className="text-brand-cyan font-semibold">connect</span>, not control
          </p>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Traditional marketplaces own your customers and control your business. 
            Downxtown gives you the tools while you keep complete ownership.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Traditional Marketplaces */}
          <Card className="bg-white/2 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-red-400 flex items-center gap-3">
                  <X className="w-7 h-7" />
                  Traditional Marketplaces
                </h3>
              </div>
              
              <div className="space-y-5">
                {marketplaceIssues.map((issue, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white/90 font-medium mb-1">{issue.text}</p>
                        <p className="text-white/60 text-sm">{issue.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-red-500/20">
                <p className="text-red-400 font-semibold text-center">
                  You&apos;re renting customers, not building a business
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Downxtown Bridge */}
          <Card className="bg-brand-cyan/5 border-2 border-brand-cyan/50 hover:border-brand-cyan/80 transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-brand-cyan text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                THE BETTER WAY
              </span>
            </div>
            
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6 mt-2">
                <h3 className="text-2xl font-bold text-brand-cyan flex items-center gap-3">
                  <CheckCircle2 className="w-7 h-7" />
                  Downxtown Bridge
                </h3>
              </div>
              
              <div className="space-y-5">
                {DownxtownBenefits.map((benefit, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-trust-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-semibold mb-1">{benefit.text}</p>
                        <p className="text-white/70 text-sm">{benefit.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-brand-cyan/20">
                <p className="text-brand-cyan font-semibold text-center">
                  Build lasting relationships, own your destiny
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bridge Model Features */}
        <div className="mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            How the Bridge Model Works
          </h3>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            Three principles that make Downxtown fundamentally different
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {bridgeFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white/2 border border-white/10 rounded-2xl p-8 hover:bg-white/4 hover:border-brand-cyan/30 transition-all duration-300 group"
              >
                {/* Icon with background */}
                <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors duration-300">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                {/* Title */}
                <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-cyan transition-colors duration-300">
                  {feature.title}
                </h4>
                
                {/* Description */}
                <p className="text-white/70 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                {/* Stat */}
                <div className="flex items-center gap-2 text-brand-cyan font-medium text-sm">
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section with stronger CTA */}
        <div className="bg-white/2 border border-brand-cyan/30 rounded-3xl p-12 md:p-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl text-brand-cyan mb-6 opacity-50"></div>
            <p className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
              We&apos;re not a marketplace.
              <br />
              We&apos;re a <span className="text-brand-cyan">bridge</span> connecting authentic retailers with conscious buyers.
            </p>
            <p className="text-lg md:text-xl text-white/70 mb-8">
              Your customers, your data, your brand. Always.
            </p>
            
            {/* CTA in quote section */}
            <Button className="px-8 py-4 text-lg font-semibold bg-brand-cyan text-black rounded-full hover:bg-brand-cyan-light transition-all duration-300">
              See How It Works →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
