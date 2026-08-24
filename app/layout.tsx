import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://applytics-k6a9len1d-mr-ahtashamulhaqs-projects.vercel.app'),
  title: {
    default: 'Applytics | Job search tools for Pakistan',
    template: '%s | Applytics',
  },
  description: 'Find jobs, tailor a resume to a selected listing, and track applications in one place.',
  keywords: ['jobs in Pakistan', 'resume tailoring', 'application tracker', 'CV', 'career'],
  alternates: { canonical: '/' },
  icons: { icon: '/chrome-shiny-wordmark.png' },
  openGraph: {
    title: 'Applytics | Job search tools for Pakistan',
    description: 'Find jobs, tailor a resume to a selected listing, and track applications in one place.',
    siteName: 'Applytics',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applytics | Job search tools for Pakistan',
    description: 'Find jobs, tailor a resume to a selected listing, and track applications in one place.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      signInFallbackRedirectUrl="/app/dashboard"
      signUpFallbackRedirectUrl="/app/dashboard"
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '13px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--hairline)',
                  background: 'var(--canvas)',
                  color: 'var(--ink-deep)',
                },
              }}
            />
          </body>
      </html>
    </ClerkProvider>
  )
}
