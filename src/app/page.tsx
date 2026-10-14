import { DemoAccessBar } from "@/components/auth/copy-password"
import { CallToAction } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Navbar } from "@/components/landing/navbar"
import { Testimonials } from "@/components/landing/testimonials"

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <DemoAccessBar />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
