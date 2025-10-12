"use client"

import { Button } from "@/components/ui/button"

export function ProblemSolutionSection() {
  const comparisons = [
    { 
      problem: "Manual DMs for every order inquiry",
      solution: "Professional checkout & order management"
    },
    {
      problem: "Sharing payment QR codes one by one",
      solution: "Integrated payment gateway"
    },
    {
      problem: "Zero order tracking or history",
      solution: "Complete order dashboard & analytics"
    },
    {
      problem: "Lost Instagram posts, no storefront",
      solution: "Your own branded store that lasts"
    }
  ]

  return (
    <section className="py-32 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Instagram Sellers Are Switching
          </h2>
          <p className="text-xl text-white/70">
            From DM chaos to professional e-commerce
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Instagram DMs Way */}
          <div>
            <h3 className="text-2xl font-semibold text-white/50 mb-6">
              Instagram DMs
            </h3>
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-red-500 text-xl flex-shrink-0">✕</span>
                  <p className="text-white/70">{item.problem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Downxtown Way */}
          <div>
            <h3 className="text-2xl font-semibold text-brand-cyan mb-6">
              Downxtown
            </h3>
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg">
                  <span className="text-trust-green text-xl flex-shrink-0">✓</span>
                  <p className="text-white/90">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
