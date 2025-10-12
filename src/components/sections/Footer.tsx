"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Smartphone,
  MapPin,
  Users,
  ArrowRight
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Calculate launch date (should match Hero section)
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 14)

  const footerLinks = {
    "For Sellers": [
      { name: "Bridge Model", href: "#about" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Instagram Migration", href: "#how-it-works" }
    ],
    Resources: [
      { name: "FAQ", href: "#faq" },
      { name: "Success Stories", href: "#" },
      { name: "Compare vs Marketplaces", href: "#pricing" },
      { name: "Seller Guide", href: "#" }
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Contact", href: "#contact" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Data Ownership", href: "#" }
    ]
  }

  return (
    <footer className="bg-brand-black border-t border-brand-cyan/20">
      <div className="container-width">
        {/* Pre-Launch CTA Section */}
        <div className="py-16 border-b border-brand-cyan/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <CountdownTimer launchDate={launchDate} />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
              Ready to <span className="text-gradient-animated">Own Your Brand?</span>
            </h3>

            <p className="text-lg text-brand-white/80 mb-8 max-w-2xl mx-auto">
              Join 200+ sellers who are done with Instagram DM chaos and marketplace fees
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="font-semibold shadow-lg bg-gradient-to-r from-seller-primary to-brand-teal hover:from-brand-cyan-light hover:to-seller-primary px-8"
              >
                Claim Your Store
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold border-2 border-buyer-primary hover:bg-buyer-primary/10 px-8"
              >
                Get Early Access
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-trust-green text-sm">
              <Users className="w-4 h-4" />
              <span className="font-semibold">200+ sellers • 5,000+ buyer waitlist • Launching soon</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-cyan rounded-lg flex items-center justify-center mr-3">
                <Smartphone className="w-6 h-6 text-brand-black" />
              </div>
              <span className="text-2xl font-bold text-brand-white">Downxtown</span>
            </div>
            <p className="text-brand-white/70 mb-6 leading-relaxed">
              India&apos;s first Bridge Model e-commerce platform. We connect authentic retailers with conscious buyers.
              Your customers, your data, your brand. Always.
            </p>
            <div className="mb-6">
              <p className="text-xs text-brand-white/50 mb-2">Built in India, for Indian Retailers</p>
              <div className="flex flex-wrap gap-2 text-xs text-brand-white/60">
                <span className="bg-trust-green/10 border border-trust-green/30 px-2 py-1 rounded">Zero Listing Fees</span>
                <span className="bg-trust-green/10 border border-trust-green/30 px-2 py-1 rounded">Instant Payouts</span>
                <span className="bg-trust-green/10 border border-trust-green/30 px-2 py-1 rounded">100% Data Ownership</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="hover:bg-brand-cyan/20 hover:text-brand-cyan">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-brand-cyan/20 hover:text-brand-cyan">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-brand-cyan/20 hover:text-brand-cyan">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-brand-cyan/20 hover:text-brand-cyan">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-brand-cyan mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-brand-white/70 hover:text-brand-cyan transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-brand-cyan/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-semibold text-brand-white mb-2">
                Stay Updated on Launch
              </h4>
              <p className="text-brand-white/70">
                Get launch notifications, seller resources, and migration guides straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-brand-dark-gray border border-brand-cyan/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:border-brand-cyan focus:outline-none"
              />
              <Button className="font-semibold bg-gradient-to-r from-seller-primary to-brand-teal">
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-brand-cyan/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 text-brand-white/60 text-sm">
              <span>© {currentYear} Downxtown. All rights reserved.</span>
              <span className="hidden sm:block">•</span>
              <span>Made with ❤️ in India for Indian Retailers</span>
            </div>
            <div className="flex items-center gap-6 text-brand-white/60 text-sm">
              <a href="#privacy" className="hover:text-brand-cyan transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-brand-cyan transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-brand-cyan transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-6 border-t border-brand-cyan/20">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-brand-white/60 text-sm">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-brand-cyan" />
              abdullahkidwai3@gmail.com
            </div>
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-2 text-brand-teal" />
              +91 96512 09308
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-brand-cyan-light" />
              Delhi, India
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
