'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CopySimple, Check, Download } from '@phosphor-icons/react'
import type { AIResult } from '@/lib/actions/generate'

interface Props {
  ai: AIResult
  jobTitle: string
  company: string
  resumeId: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--steel)' }}>
          {title}
        </h3>
        <div className="flex-1 divider-h" />
      </div>
      {children}
    </div>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="text-sm leading-relaxed flex gap-2" style={{ color: 'var(--charcoal)' }}>
      <span style={{ color: 'var(--brand-red)', flexShrink: 0 }}>▸</span>
      <span>{text}</span>
    </li>
  )
}

export default function ResumePreview({ ai, jobTitle, company, resumeId }: Props) {
  const [copied, setCopied] = useState(false)

  // Build plain text version for copy
  const buildPlainText = (): string => {
    const lines: string[] = []

    lines.push('PROFESSIONAL SUMMARY')
    lines.push('─'.repeat(40))
    lines.push(ai.summary ?? '')
    lines.push('')

    lines.push('SKILLS')
    lines.push('─'.repeat(40))
    lines.push((ai.skills_to_emphasize ?? []).join(' • '))
    lines.push('')

    if ((ai.rewritten_experience ?? []).length > 0) {
      lines.push('WORK EXPERIENCE')
      lines.push('─'.repeat(40))
      for (const exp of ai.rewritten_experience) {
        lines.push(`${exp.role} — ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}`)
        for (const bullet of exp.bullets) lines.push(`• ${bullet}`)
        lines.push('')
      }
    }

    if ((ai.rewritten_projects ?? []).length > 0) {
      lines.push('PROJECTS')
      lines.push('─'.repeat(40))
      for (const proj of ai.rewritten_projects) {
        lines.push(proj.title)
        for (const bullet of proj.bullets) lines.push(`• ${bullet}`)
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--hairline)' }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>
            Tailored Resume
          </p>
          <p className="text-xs" style={{ color: 'var(--stone)' }}>
            {jobTitle} at {company}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded"
          style={{
            border: '1px solid var(--hairline-strong)',
            background: 'var(--canvas)',
            color: 'var(--ink)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {copied ? <Check size={12} weight="bold" /> : <CopySimple size={12} />}
          {copied ? 'Copied!' : 'Copy text'}
        </button>
      </div>

      {/* Resume body */}
      <div
        className="p-6 md:p-8"
        style={{ background: 'var(--canvas)', fontFamily: 'var(--font-sans)' }}
      >
        {/* Summary */}
        {ai.summary && (
          <Section title="Professional Summary">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
              {ai.summary}
            </p>
          </Section>
        )}

        {/* Skills */}
        {(ai.skills_to_emphasize ?? []).length > 0 && (
          <Section title="Skills to Emphasize">
            <div className="flex flex-wrap gap-1.5">
              {ai.skills_to_emphasize.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 font-medium"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--charcoal)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {(ai.rewritten_experience ?? []).length > 0 && (
          <Section title="Work Experience">
            <div className="flex flex-col gap-4">
              {ai.rewritten_experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-1.5 gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>
                      {exp.role}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--steel)' }}>
                      {exp.company}{exp.duration ? ` • ${exp.duration}` : ''}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1.5 pl-1">
                    {exp.bullets.map((bullet, j) => (
                      <Bullet key={j} text={bullet} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {(ai.rewritten_projects ?? []).length > 0 && (
          <Section title="Projects">
            <div className="flex flex-col gap-4">
              {ai.rewritten_projects.map((proj, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--ink-deep)' }}>
                    {proj.title}
                  </p>
                  <ul className="flex flex-col gap-1.5 pl-1">
                    {proj.bullets.map((bullet, j) => (
                      <Bullet key={j} text={bullet} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </motion.div>
  )
}
