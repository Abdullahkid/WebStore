"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "For Sellers", href: "#about" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" }
  ]

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? "bg-brand-black/95 backdrop-blur-xl border-b border-brand-cyan/20 py-3" : "bg-transparent py-6"}`}>
      <div className="container-width">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 mr-3 group-hover:scale-110 transition-all duration-300">
              <Image
                src="/logo.svg"
                alt="Downxtown Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
                priority
              />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-brand-white group-hover:text-gradient-animated transition-all duration-300">Downxtown</span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-brand-white/80 hover:text-brand-cyan transition-all duration-300 px-3 py-2 rounded-lg hover:bg-brand-cyan/10 font-medium group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-cyan to-brand-teal group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Enhanced CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              size="lg"
              className="font-semibold shadow-lg bg-gradient-to-r from-seller-primary to-brand-teal hover:from-brand-cyan-light hover:to-seller-primary"
            >
              Claim Your Store
            </Button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="md:hidden text-brand-white p-2 rounded-lg hover:bg-brand-cyan/10 transition-colors duration-300 hover:text-brand-cyan"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 py-6 border-t border-brand-cyan/20 glass-morphism rounded-b-2xl mx-4">
            <div className="flex flex-col space-y-4 stagger-children">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-brand-white/80 hover:text-brand-cyan transition-all duration-300 py-3 px-4 rounded-lg hover:bg-brand-cyan/10 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 space-y-3">
                <Button className="font-semibold w-full shadow-lg bg-gradient-to-r from-seller-primary to-brand-teal">
                  Claim Your Store
                </Button>
                <Button
                  variant="outline"
                  className="font-semibold w-full border-2 border-buyer-primary hover:bg-buyer-primary/10"
                >
                  Get Early Access
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
