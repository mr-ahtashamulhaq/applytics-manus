import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = {
  Product: [
    { label: 'The Problem', href: '/#problem' },
    { label: 'Platform',    href: '/#platform' },
    { label: 'Features',    href: '/#features' },
    { label: 'Pricing',     href: '/#pricing' },
    { label: 'Research',    href: '/research' },
  ],
  Company: [
    { label: 'About', href: '/#mission' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Contact', href: 'mailto:hello@applytics.online' },
  ],
  Account: [
    { label: 'Sign in', href: '/sign-in' },
    { label: 'Create account', href: '/sign-up' },
    { label: 'Dashboard', href: '/app/dashboard' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="w-full"
      style={{ background: 'var(--canvas)', borderTop: '1px solid var(--hairline)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-16">

          {/* Brand column */}
          <div>
            <Image
              src="/wordmark.png"
              alt="Applytics"
              width={100}
              height={28}
              className="h-7 w-auto object-contain mb-4"
            />
            <p className="text-sm max-w-[240px]" style={{ color: 'var(--slate)', lineHeight: 1.65 }}>
              Career operating system for Pakistan&apos;s students and fresh graduates.
            </p>
            <p className="mt-4 text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}>
              Lahore, Pakistan
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ink)', fontFamily: 'var(--font-geist-mono)' }}>
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid var(--hairline)' }}
        >
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            &copy; {year} Applytics. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            Built for Pakistan&apos;s next generation of professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
