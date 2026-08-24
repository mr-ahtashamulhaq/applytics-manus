'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import {
  SquaresFour,
  FileText,
  Kanban,
  User,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: SquaresFour,
  },
  {
    label: 'Generate Resume',
    href: '/app/generate',
    icon: FileText,
  },
  {
    label: 'Tracker',
    href: '/app/tracker',
    icon: Kanban,
  },
  {
    label: 'Profile',
    href: '/app/profile',
    icon: User,
  },
]

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const navItemVariant = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: 'easeOut' as const },
  },
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0"
      style={{
        background: 'var(--canvas)',
        borderRight: '1px solid var(--hairline)',
      }}
    >
      {/* Logo area */}
      <div
        className="flex items-center gap-2 px-5 py-5"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/wordmark.png" alt="Applytics Logo" width={32} height={32} className="object-contain" />
          <span
            className="text-h4 tracking-tight select-none"
            style={{ color: 'var(--ink-deep)', letterSpacing: '-0.5px' }}
          >
            Applytics
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-0.5 list-none m-0 p-0"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/app/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <motion.li key={item.href} variants={navItemVariant}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all select-none"
                  style={{
                    color: isActive ? 'var(--brand-red)' : 'var(--slate)',
                    background: isActive
                      ? 'var(--brand-red-subtle)'
                      : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: 'var(--radius-md)',
                    transitionDuration: 'var(--dur-fast)',
                    transitionTimingFunction: 'var(--ease-out)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      ;(e.currentTarget as HTMLElement).style.background =
                        'var(--surface)'
                      ;(e.currentTarget as HTMLElement).style.color =
                        'var(--ink)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      ;(e.currentTarget as HTMLElement).style.background =
                        'transparent'
                      ;(e.currentTarget as HTMLElement).style.color =
                        'var(--slate)'
                    }
                  }}
                >
                  <Icon
                    size={18}
                    weight={isActive ? 'fill' : 'regular'}
                    color={isActive ? 'var(--brand-red)' : 'var(--steel)'}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* User area */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8 rounded-md',
              userButtonPopoverCard: 'rounded-lg shadow-lg border border-[--hairline]',
            },
          }}
        />
        <span
          className="text-sm font-medium truncate"
          style={{ color: 'var(--charcoal)' }}
        >
          Account
        </span>
      </div>
    </aside>
  )
}
