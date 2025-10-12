"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, TrendingUp, Users, DollarSign, Star } from "lucide-react"

export function SocialProofSection() {
  const testimonials = [
    {
      quote: "I was copy-pasting UPI QR codes 50 times a day. Downxtown gave me my time back and made my store look professional.",
      author: "Priya Sharma",
      business: "Fashion Boutique, Mumbai",
      metric: "₹85K first month",
      rating: 5
    },
    {
      quote: "Marketplace fees were eating 20% of my margins. Now I keep 98% of what I earn. Finally, a platform that values sellers.",
      author: "Rahul Verma",
      business: "Electronics Store, Bangalore",
      metric: "3x profit margins",
      rating: 5
    },
    {
      quote: "I was lost in Amazon listings. Downxtown helped me build a brand my customers actually remember and follow.",
      author: "Anjali Patel",
      business: "Cosmetics & Beauty, Pune",
      metric: "2,500 loyal followers",
      rating: 5
    }
  ]

  const stats = [
    {
      icon: Users,
      value: "200+",
      label: "Pre-Launch Sellers",
      color: "text-seller-primary"
    },
    {
      icon: TrendingUp,
      value: "5,000+",
      label: "Buyer Waitlist",
      color: "text-seller-primary"
    }
  ]

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-brand-white">200+ Sellers </span>
            <span className="text-gradient-animated">Already Building</span>
          </h2>
          <p className="text-xl text-brand-white/80 max-w-3xl mx-auto">
            Real stories from retailers who transformed their Instagram chaos into professional brands
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-brand-dark-gray/80 to-brand-medium-gray/80 border-brand-cyan/30 hover:border-brand-cyan/60 hover-glow transition-all duration-500 group"
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-brand-cyan/40 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-urgency-orange text-urgency-orange" />
                    ))}
                  </div>
                  <p className="text-brand-white/90 leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-brand-white/10 pt-4">
                  <p className="text-brand-cyan font-semibold mb-1">{testimonial.author}</p>
                  <p className="text-brand-white/60 text-sm mb-2">{testimonial.business}</p>
                  <div className="inline-flex items-center gap-2 bg-trust-green/10 border border-trust-green/30 rounded-full px-3 py-1">
                    <TrendingUp className="w-4 h-4 text-trust-green" />
                    <span className="text-trust-green text-sm font-semibold">{testimonial.metric}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="glass-morphism border border-brand-cyan/30 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-center max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="group hover-lift">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-4 rounded-full bg-gradient-to-br from-brand-dark-gray to-brand-medium-gray border border-brand-cyan/30 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <p className="text-brand-white/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-brand-white/60 mb-4">Trusted by authentic retailers across India</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-brand-white/40">
            <div className="text-xs">Mumbai • Delhi • Bangalore • Pune • Hyderabad • Chennai</div>
          </div>
        </div>
      </div>
    </section>
  )
}
