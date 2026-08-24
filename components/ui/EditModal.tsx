'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  hint?: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function EditModal({
  isOpen,
  onClose,
  title,
  hint,
  value,
  onChange,
  placeholder,
}: EditModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 80)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent scroll behind modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(10,8,6,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none px-4"
          >
            <div
              className="pointer-events-auto w-full flex flex-col"
              style={{
                maxWidth: '680px',
                maxHeight: '90dvh',
                background: 'var(--canvas)',
                border: '1px solid var(--hairline)',
                borderRadius: '10px',
                boxShadow: '0 24px 64px -12px rgba(10,8,6,0.28)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--hairline)' }}
              >
                <h2
                  className="text-base font-semibold"
                  style={{ color: 'var(--ink-deep)', letterSpacing: '-0.2px' }}
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 transition-colors rounded-full"
                  style={{ color: 'var(--slate)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  aria-label="Close"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Hint */}
              {hint && (
                <p
                  className="px-6 pt-4 text-sm"
                  style={{ color: 'var(--steel)', lineHeight: 1.55 }}
                >
                  {hint}
                </p>
              )}

              {/* Textarea */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full outline-none resize-none text-sm"
                  style={{
                    color: 'var(--ink)',
                    background: 'var(--canvas)',
                    lineHeight: 1.7,
                    fontSize: '14px',
                    minHeight: '280px',
                    border: 'none',
                  }}
                />
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderTop: '1px solid var(--hairline)' }}
              >
                <span className="text-xs" style={{ color: 'var(--stone)' }}>
                  {value.length} characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium transition-colors"
                    style={{
                      color: 'var(--ink)',
                      border: '1px solid var(--hairline-strong)',
                      borderRadius: 'var(--radius-md)',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold transition-all"
                    style={{
                      background: 'var(--brand-red)',
                      color: '#fff',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brand-red-deep)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brand-red)' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
