"use client";

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { URLScanner } from "@/components/url-scanner"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { DashboardPreview } from "@/components/dashboard-preview"
import { ProfileSection } from "@/components/profile-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <URLScanner /> {/* 👈 THIS is where logic will work */}
      <FeaturesSection />
      <HowItWorks />
      <DashboardPreview />
      <ProfileSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}