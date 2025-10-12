"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Instagram,
  Send,
  MessageSquare
} from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-brand-dark-gray to-brand-black">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="text-brand-white">Get in </span>
            <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-brand-white/80 max-w-4xl mx-auto leading-relaxed">
            Have questions about Downxtown? Want to partner with us? Or simply want to say hello? 
            We&apos;d love to hear from you. Reach out and let&apos;s start a conversation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold text-brand-cyan mb-8">
              Let&apos;s Connect
            </h3>
            <p className="text-lg text-brand-white/70 mb-10">
              We&apos;re always excited to connect with entrepreneurs, investors, potential partners, 
              and users who share our vision of transforming commerce through social connections.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-cyan/20 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-brand-white font-semibold">Email Us</div>
                  <div className="text-brand-cyan">abdullahkidwai3@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-teal/20 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-brand-teal" />
                </div>
                <div>
                  <div className="text-brand-white font-semibold">Call Us</div>
                  <div className="text-brand-teal">+91 9651209308</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-cyan-light/20 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-brand-cyan-light" />
                </div>
                <div>
                  <div className="text-brand-white font-semibold">Visit Us</div>
                  <div className="text-brand-cyan-light">Lucknow, Uttar Pradesh, India</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h4 className="text-xl font-semibold text-brand-white mb-4">
                Follow Our Journey
              </h4>
              <div className="flex space-x-4">
                <Button size="icon" variant="outline" className="hover-glow">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="outline" className="hover-glow">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="outline" className="hover-glow">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-to-b from-brand-dark-gray to-brand-medium-gray border-brand-cyan/30">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-cyan">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-brand-black/50 border border-brand-cyan/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:border-brand-cyan focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-white mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-brand-black/50 border border-brand-cyan/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:border-brand-cyan focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-brand-black/50 border border-brand-cyan/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:border-brand-cyan focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-2">
                  Subject
                </label>
                <select className="w-full px-4 py-2 bg-brand-black/50 border border-brand-cyan/30 rounded-lg text-brand-white focus:border-brand-cyan focus:outline-none">
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="investor">Investor Relations</option>
                  <option value="support">Technical Support</option>
                  <option value="press">Press & Media</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-white mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-brand-black/50 border border-brand-cyan/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:border-brand-cyan focus:outline-none resize-none"
                  placeholder="Tell us about your inquiry..."
                ></textarea>
              </div>

              <Button className="w-full font-semibold hover-glow">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  )
}
