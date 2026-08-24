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
  title: 'Applytics',
  description:
    'The complete career platform for students and fresh graduates in Pakistan. AI resume tailoring, application tracking, job discovery, and career intelligence, all in one place.',
  keywords: [
    'resume', 'ATS', 'job application', 'Pakistan', 'CV', 'career',
    'AI resume', 'job search', 'internship', 'fresh graduate', 'career platform',
  ],
  openGraph: {
    title: 'Applytics',
    description: 'Turning applications into interviews for Pakistan\'s job seekers.',
    url: 'https://www.applytics.online',
    siteName: 'Applytics',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applytics',
    description: 'Turning applications into interviews for Pakistan\'s job seekers.',
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
