'use client'

import { useEffect, useRef } from 'react'

interface Props { score: number }

export default function MatchScoreRing({ score }: Props) {
  const circleRef = useRef<SVGCircleElement>(null)

  const size = 96
  const stroke = 6
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    if (!circleRef.current) return
    const offset = circumference - (score / 100) * circumference
    circleRef.current.style.strokeDashoffset = String(offset)
  }, [score, circumference])

  const color =
    score >= 75 ? 'var(--success)' :
    score >= 50 ? '#f59e0b' :
    'var(--brand-red)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
          {score}
        </span>
        <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--stone)' }}>/ 100</span>
      </div>
    </div>
  )
}
