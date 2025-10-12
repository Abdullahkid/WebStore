"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Star, Zap } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-trust-green/10 border border-trust-green/30 px-4 py-2 rounded-full mb-6">
            <span className="text-trust-green font-bold text-sm">LIMITED TIME OFFER</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Free During Launch Period
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We&apos;re keeping Downxtown <span className="text-trust-green font-semibold">completely free</span> for early adopters. 
            No hidden fees, no credit card required.
          </p>
        </div>

        {/* What's Included */}
        <div className="bg-white/2 border-2 border-brand-cyan/50 rounded-3xl p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="text-7xl font-extrabold text-brand-cyan mb-4">₹0</div>
            <p className="text-2xl text-white/80">Everything included. Zero charges.</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10 text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Professional Storefront</p>
                <p className="text-white/60 text-sm">Complete branding & customization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Unlimited Products</p>
                <p className="text-white/60 text-sm">No listing limits or caps</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Instant Payouts</p>
                <p className="text-white/60 text-sm">Only 2-3% payment gateway fees</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Customer Data Ownership</p>
                <p className="text-white/60 text-sm">Export anytime, 100% yours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Direct Customer Chat</p>
                <p className="text-white/60 text-sm">Real-time messaging built-in</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-trust-green text-xl">✓</span>
              <div>
                <p className="text-white font-semibold">Full Analytics</p>
                <p className="text-white/60 text-sm">Business intelligence dashboard</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button className="px-10 py-5 text-xl font-bold bg-brand-cyan text-black rounded-full hover:bg-brand-cyan-light mb-6">
            Claim Your Free Store →
          </Button>

          {/* Fine Print */}
          <div className="space-y-2 text-sm text-white/60">
            <p>✓ No credit card required • ✓ No hidden fees • ✓ No time limit</p>
            <p className="text-white/50 italic">
              *2-3% payment gateway fee charged by payment processor (industry standard)
            </p>
            <p className="text-white/50 italic">
              *Early adopters lock in special benefits when pricing is introduced
            </p>
          </div>
        </div>

        {/* Future Pricing Note */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-white/70 leading-relaxed">
            <span className="text-brand-cyan font-semibold">Why free?</span> We&apos;re building Downxtown 
            with sellers, not just for them. Your feedback shapes our platform. When we introduce 
            pricing, early adopters will get <span className="text-trust-green">exclusive benefits</span>.
          </p>
        </div>

      </div>
    </section>
  )
}
