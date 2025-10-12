"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Store, Upload, TrendingUp, CheckCircle2, Clock } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Set Up Your Store",
      description: "Create your professional storefront. Add your store name, logo, business hours, and location. Upload your products with photos and descriptions.",
      time: "15-20 minutes",
      color: "text-brand-cyan",
      benefits: [
        "Add store logo & name",
        "GST or instant enrollment ID",
        "Add location & contact",
        "Free onboarding support"
      ]
    },
    {
      number: "02",
      icon: Store,
      title: "Share Your Store Link",
      description: "Get your unique Downxtown store URL. Share it on Instagram bio, stories, and posts. Replace those DM conversations with a professional checkout.",
      time: "5 minutes",
      color: "text-brand-teal",
      benefits: [
        "Unique store URL",
        "Share on Instagram",
        "Professional checkout",
        "No more manual QR codes"
      ]
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Build & Grow",
      description: "Your Instagram followers become Downxtown customers. Chat with them directly, manage orders easily, and get paid instantly after each sale.",
      time: "Ongoing",
      color: "text-seller-primary",
      benefits: [
        "Direct customer chat",
        "Easy order management",
        "Instant payouts",
        "Build loyal following"
      ]
    }
  ]

  return (
    <section id="how-it-works" className="section-padding bg-black">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-white">From Instagram DMs to </span>
            <span className="text-brand-cyan">Professional Brand</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-4">
            In 3 simple steps
          </p>
          <p className="text-lg text-white/70">
            <span className="text-trust-green font-semibold">Setup time:</span> 15-20 minutes • Free onboarding support included
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start pb-12">
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center gap-4 relative">
                  <div className="w-16 h-16 rounded-full bg-black border-2 border-brand-cyan/30 flex items-center justify-center relative z-20">
                    <div className="w-full h-full rounded-full bg-brand-cyan/10 flex items-center justify-center">
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                  </div>

                  {/* Connection Line - appears below icon */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-[4rem] bottom-[-3rem] w-0.5 bg-gradient-to-b from-brand-cyan via-brand-teal to-seller-primary opacity-30 z-0"></div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full z-20 relative bg-black">
                    <Clock className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-xs text-white/60 font-medium">{step.time}</span>
                  </div>
                </div>

                {/* Step Content */}
                <Card className="bg-white/2 border border-white/10 hover:border-brand-cyan/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-brand-cyan/60 text-sm font-bold mb-2">STEP {step.number}</div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Benefits List */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-trust-green flex-shrink-0" />
                          <span className="text-white/70 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Result Section */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-brand-cyan/5 border border-brand-cyan/20 rounded-2xl p-8 max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              The Result?
            </h3>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-brand-cyan">Professional</div>
                <p className="text-white/70">Branded storefront</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-trust-green">Instant</div>
                <p className="text-white/70">Payments on every sale</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-brand-teal">100%</div>
                <p className="text-white/70">Data ownership</p>
              </div>
            </div>

            <p className="text-lg text-white/80">
              Stop juggling DMs. Start building your brand.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
