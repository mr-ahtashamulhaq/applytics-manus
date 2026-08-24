import type { Metadata } from 'next'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import ResearchDashboard from '@/components/research/ResearchDashboard'

export const metadata: Metadata = {
  title: 'Market Research - Applytics',
  description:
    'Student survey data validating the job search problem in Pakistan. 52 students and graduates surveyed in April 2026.',
  openGraph: {
    title: 'Market Research - Applytics',
    description: 'What 52 Pakistani students told us about job searching.',
    url: 'https://www.applytics.online/research',
    siteName: 'Applytics',
    type: 'website',
  },
}

export default function ResearchPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--canvas)' }}>
      <Navbar />
      <ResearchDashboard />
      <Footer />
    </main>
  )
}
