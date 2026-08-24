import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import ProblemSection from '@/components/landing/ProblemSection'
import PlatformOverview from '@/components/landing/PlatformOverview'
import Features from '@/components/landing/Features'
import VisionSection from '@/components/landing/VisionSection'
import WhoItsFor from '@/components/landing/WhoItsFor'
import PricingSection from '@/components/landing/PricingSection'
import MissionBand from '@/components/landing/MissionBand'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job search tools for Pakistan',
  description: 'Find current listings, tailor a resume to a selected role, and keep applications connected during Applytics early access.',
  keywords: ['jobs in Pakistan', 'resume tailoring', 'application tracker', 'CV', 'career'],
  openGraph: {
    title: 'Applytics | Job search tools for Pakistan',
    description: 'Find current listings, tailor a resume to a selected role, and keep applications connected.',
    siteName: 'Applytics',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applytics | Job search tools for Pakistan',
    description: 'Find current listings, tailor a resume to a selected role, and keep applications connected.',
  },
}

export default async function RootPage() {
  const { userId } = await auth()

  // Authenticated users go straight to the dashboard
  if (userId) redirect('/app/dashboard')

  // Unauthenticated users see the landing page
  return (
    <main className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--canvas)' }}>
      <Navbar />
      <Hero />
      <ProblemSection />
      <PlatformOverview />
      <Features />
      <VisionSection />
      <WhoItsFor />
      <PricingSection />
      <MissionBand />
      <FinalCTA />
      <Footer />
    </main>
  )
}
