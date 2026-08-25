'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquaresFour,
  FileText,
  Kanban,
  User,
  List,
  X,
  ShieldCheck,
} from '@phosphor-icons/react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/app/dashboard', icon: SquaresFour },
  { label: 'Generate Resume', href: '/app/generate', icon: FileText },
  { label: 'Tracker', href: '/app/tracker', icon: Kanban },
  { label: 'Profile', href: '/app/profile', icon: User },
  { label: 'Privacy and data', href: '/app/account', icon: ShieldCheck },
]

const drawerVariants = {
  hidden: { opacity: 0, x: '-100%' },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.26, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    x: '-100%',
    transition: { duration: 0.18, ease: 'easeInOut' as const },
  },
}

export default function MobileTopBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top bar — mobile only */}
      <header
        className="md:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-40"
        style={{
          background: 'var(--canvas)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <Link href="/" className="flex items-center gap-2" aria-label="Applytics home">
          <Image
            src="/applytics-logo.png"
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain"
            aria-hidden="true"
          />
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--ink-deep)' }}>
            Applytics
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: 'w-7 h-7 rounded-md' },
            }}
          />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            className="p-1.5 rounded-md transition-colors"
            style={{ color: 'var(--charcoal)' }}
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 md:hidden"
              style={{ background: 'rgba(15,12,8,0.3)' }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-14 left-0 bottom-0 w-64 z-40 md:hidden flex flex-col"
              style={{
                background: 'var(--canvas)',
                borderRight: '1px solid var(--hairline)',
              }}
            >
              <ul className="flex flex-col gap-0.5 list-none m-0 p-3">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/app/dashboard' &&
                      pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors"
                        style={{
                          color: isActive ? 'var(--brand-red)' : 'var(--charcoal)',
                          background: isActive ? 'var(--brand-red-subtle)' : 'transparent',
                          fontWeight: isActive ? 600 : 500,
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <Icon
                          size={18}
                          weight={isActive ? 'fill' : 'regular'}
                          color={isActive ? 'var(--brand-red)' : 'var(--steel)'}
                          aria-hidden="true"
                        />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
