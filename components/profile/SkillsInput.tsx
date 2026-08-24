'use client'

import { useState, KeyboardEvent, useRef } from 'react'
import { X } from '@phosphor-icons/react'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
  placeholder?: string
}

export default function SkillsInput({
  value,
  onChange,
  placeholder = 'Type a skill and press Enter…',
}: SkillsInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addSkill = (raw: string) => {
    const skill = raw.trim()
    if (!skill || value.includes(skill)) return
    onChange([...value, skill])
    setInput('')
  }

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center min-h-[44px] px-3 py-2 cursor-text"
      style={{
        border: '1px solid var(--hairline-strong)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--charcoal)',
          }}
        >
          {skill}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeSkill(skill) }}
            className="hover:text-red-600 transition-colors"
            style={{ color: 'var(--steel)', lineHeight: 1 }}
            aria-label={`Remove ${skill}`}
          >
            <X size={10} weight="bold" />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addSkill(input)}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[140px] outline-none bg-transparent text-sm"
        style={{
          color: 'var(--ink)',
          fontSize: '14px',
        }}
      />
    </div>
  )
}
