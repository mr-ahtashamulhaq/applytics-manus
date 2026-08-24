'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedTextCycleProps {
  words: string[]
  interval?: number
  className?: string
}

export default function AnimatedTextCycle({
  words,
  interval = 2800,
  className = '',
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState<string>('auto')
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children
      if (elements.length > currentIndex) {
        const newWidth = (elements[currentIndex] as HTMLElement).getBoundingClientRect().width
        setWidth(`${newWidth}px`)
      }
    }
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval, words.length])

  const variants = {
    hidden:  { y: -16, opacity: 0, filter: 'blur(6px)' },
    visible: { y: 0,   opacity: 1, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit:    { y: 16,  opacity: 0, filter: 'blur(6px)', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
  }

  return (
    <>
      {/* Hidden measurement div */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: 'hidden' }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>{word}</span>
        ))}
      </div>

      {/* Animated word */}
      <motion.span
        className="relative inline-block"
        animate={{ width, transition: { type: 'spring', stiffness: 160, damping: 18, mass: 1 } }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: 'nowrap' }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  )
}
