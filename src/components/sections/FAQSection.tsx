"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Do I need GST to sell on DownXtown?",
      answer: "Not necessarily! If you have GST, great - you can sell anywhere in India. But if your annual turnover is under ₹40 Lakhs, you can get an instant Enrollment ID using just your PAN card. With enrollment, you can sell within your state (intra-state only). We guide you through the entire process - it takes just 5 minutes on the GST portal."
    },
    {
      question: "What's the difference between GST and Enrollment ID?",
      answer: "GST Registration: For sellers with turnover above ₹40L. Allows inter-state selling across India. Requires full GST compliance. \n\nEnrollment ID: For sellers with turnover under ₹40L. Only allows selling within your state (intra-state). Instant approval with just PAN card. Perfect for small sellers starting out. You can upgrade to GST later when your business grows."
    },
    {
      question: "How is Downxtown different from Instagram Shopping?",
      answer: "Instagram lacks professional checkout, order management, customer analytics, and inventory tracking. Downxtown gives you complete e-commerce functionality while keeping the social connection with your customers. Plus, you own all your customer data."
    },
    {
      question: "Do I have to leave Instagram?",
      answer: "Absolutely not! Auto-sync your Downxtown products to Instagram. Post your product links and bring your Instagram followers to your Downxtown store. Best of both worlds - social presence + professional commerce."
    },
    {
      question: "What if I already sell on Amazon/Flipkart?",
      answer: "Many sellers use us alongside marketplaces. The key difference: on Downxtown YOU own customer relationships, get instant payouts, and build your brand. Use marketplaces for discovery, Downxtown for loyalty."
    },
    {
      question: "How long will it take to setup the store?",
      answer: "Max 15-20 minutes. Even non-GST sellers can create a store on our platform."
    },
    {
      question: "What about delivery?",
      answer: "You choose your delivery partner (Delhivery, Dunzo, local courier - whatever you use now). We don't control logistics. You provide tracking links to customers. This keeps YOU in control and costs low."
    },
    {
      question: "What are the transaction fees?",
      answer: "2-3% based on your plan, compared to 20-30% on traditional marketplaces. Plus you get instant payouts (not 7-15 days). No hidden fees. Calculate your savings: if you make ₹1L/month, you save ₹20,000+ in fees."
    },
    {
      question: "Can I export my customer data?",
      answer: "Yes! 100% data ownership. Export customer details, order history, analytics anytime. Use the data outside the platform. Contact customers directly. We believe your customers are YOURS, not ours."
    },
    {
      question: "What if I need help getting started?",
      answer: "Every new seller gets onboarding support. We help with store setup, product imports, and first sale. WhatsApp support during business hours. Video tutorials for everything. We want you to succeed."
    }
  ]

  return (
    <section id="faq" className="section-padding bg-gradient-to-b from-brand-dark-gray to-brand-black">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-16 stagger-children">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-10 h-10 text-brand-cyan" />
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="text-brand-white">Questions? </span>
              <span className="text-gradient-animated">We&apos;ve Got Answers</span>
            </h2>
          </div>
          <p className="text-xl text-brand-white/80 max-w-3xl mx-auto">
            Everything you need to know about switching from Instagram DMs to Downxtown
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-morphism border border-brand-cyan/30 rounded-xl overflow-hidden hover:border-brand-cyan/60 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-brand-cyan/5 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-brand-white mb-1">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-brand-cyan flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-brand-white/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 text-center">
          <div className="glass-morphism border border-brand-cyan/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-white mb-4">
              Still have questions?
            </h3>
            <p className="text-brand-white/70 mb-6">
              Chat with our team on WhatsApp or schedule a demo call
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-trust-green hover:bg-trust-green/90 text-white font-semibold rounded-lg transition-colors duration-200">
                WhatsApp Us
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-brand-cyan hover:bg-brand-cyan/10 text-brand-cyan font-semibold rounded-lg transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
