import { Header } from '@/components/sections/Header'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { SocialProofSection } from '@/components/sections/SocialProofSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { AppScreensSection } from '@/components/sections/AppScreensSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <ProblemSolutionSection />
      <AppScreensSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <SocialProofSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  )
}
