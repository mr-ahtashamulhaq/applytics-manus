import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const GA_ID = 'G-R5145PRGPK'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Applytics',
  description:
    'Paste a job description, get a tailored ATS-friendly resume in seconds. Built for students and fresh graduates in Pakistan.',
  keywords: ['resume', 'ATS', 'job application', 'Pakistan', 'CV', 'career'],
  icons: {
    icon: '/chrome-shiny-wordmark.png',
  },
  openGraph: {
    title: 'Applytics',
    description: 'Tailored resumes for every job. Built for Pakistani students and graduates.',
    url: 'https://applytics.co',
    siteName: 'Applytics',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applytics',
    description: 'Tailored resumes for every job.',
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
            {/* Google Analytics */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
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
