'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperPlaneTilt, Check } from '@phosphor-icons/react'
import { submitSuggestion } from '@/lib/actions/suggestions'

export default function SuggestionForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!suggestion.trim()) return
    setError('')
    startTransition(async () => {
      const res = await submitSuggestion({ name, email, suggestion })
      if (res.success) {
        setSubmitted(true)
      } else {
        setError(res.error ?? 'Something went wrong.')
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    border: '1px solid var(--hairline-strong)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    fontSize: '14px',
    width: '100%',
    padding: '10px 14px',
    outline: 'none',
  }

  return (
    <section
      className="w-full"
      style={{ background: 'var(--surface)', padding: 'clamp(64px, 8vw, 100px) 0', borderTop: '1px solid var(--hairline)' }}
    >
      <div className="max-w-[640px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
            Built in public
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold mb-3" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Tell us what to build next
          </h2>
          <p className="text-base" style={{ color: 'var(--charcoal)', lineHeight: 1.65 }}>
            Applytics is built with feedback from job seekers in Pakistan. Your suggestion directly shapes what we build. No account needed.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 py-10 text-center"
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: 'var(--brand-red-subtle)' }}
              >
                <Check size={22} weight="bold" style={{ color: 'var(--brand-red)' }} />
              </div>
              <p className="text-base font-semibold" style={{ color: 'var(--ink-deep)' }}>Thank you!</p>
              <p className="text-sm" style={{ color: 'var(--charcoal)' }}>Your suggestion has been received. We read every single one.</p>
              <button
                onClick={() => { setSubmitted(false); setSuggestion(''); setName(''); setEmail('') }}
                className="mt-2 text-sm underline"
                style={{ color: 'var(--steel)' }}
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                    Name <span style={{ color: 'var(--stone)' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ahmed"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                    Email <span style={{ color: 'var(--stone)' }}>(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ahmed@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                  Your suggestion <span style={{ color: 'var(--brand-red)' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="I wish Applytics could..."
                  value={suggestion}
                  onChange={e => setSuggestion(e.target.value)}
                  required
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {error && (
                <p className="text-xs" style={{ color: 'var(--brand-red)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={isPending || !suggestion.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all self-start"
                style={{
                  background: isPending ? 'var(--steel)' : 'var(--brand-black)',
                  color: 'var(--on-dark)',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: isPending || !suggestion.trim() ? 'not-allowed' : 'pointer',
                  opacity: !suggestion.trim() ? 0.5 : 1,
                }}
              >
                <PaperPlaneTilt size={14} />
                {isPending ? 'Sending…' : 'Send suggestion'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
