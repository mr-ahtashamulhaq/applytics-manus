'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { MetalButton } from '@/components/ui/liquid-glass-button'

const NAV_LINKS = [
  { label: 'The Problem', href: '/#problem' },
  { label: 'Platform',    href: '/#platform' },
  { label: 'Features',    href: '/#features' },
  { label: 'Pricing',     href: '/#pricing' },
  { label: 'Research',    href: '/research' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link and we're on the home page, scroll smoothly
    if (href.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault()
      const hash = href.replace('/', '')
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      setMobileOpen(false)
    }
    // Otherwise let default Next.js routing handle it (cross-page)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        height: '64px',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,1)',
        borderBottom: '1px solid var(--hairline)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <nav className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/wordmark.png"
            alt="Applytics"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={e => handleAnchor(e, link.href)}
                className="px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: 'var(--slate)', borderRadius: 'var(--radius-sm)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate)'; e.currentTarget.style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--ink)', borderRadius: 'var(--radius-md)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            Sign in
          </Link>
          <Link href="/sign-up">
            <MetalButton variant="brand">Get started</MetalButton>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ color: 'var(--ink)' }}
        >
          {mobileOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden absolute top-full left-0 right-0 px-6 py-4 flex flex-col gap-2"
            style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--hairline)' }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={e => handleAnchor(e, link.href)}
                className="py-2.5 text-sm font-medium"
                style={{ color: 'var(--ink)', borderBottom: '1px solid var(--hairline)' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/sign-in" className="py-2.5 text-sm font-medium text-center" style={{ color: 'var(--slate)' }}>
                Sign in
              </Link>
              <Link href="/sign-up" className="w-full">
                <MetalButton variant="brand" className="w-full justify-center">Get started free</MetalButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
