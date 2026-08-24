'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

// ── Metal/Chrome Button (adapted from liquid-button.md MetalButton) ──────────
// Using "error" palette mapped to our brand-red
type ColorVariant = 'default' | 'brand' | 'dark'

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
  asChild?: boolean
}

const colorVariants: Record<ColorVariant, {
  outer: string
  inner: string
  button: string
  textColor: string
  textShadow: string
}> = {
  brand: {
    outer:      'bg-[linear-gradient(to_bottom,#5a0000,#de0d12)]',
    inner:      'bg-[linear-gradient(to_bottom,#ff8080,#680002,#ffb0b0)]',
    button:     'bg-[linear-gradient(to_bottom,#e84040,#b30a0f)]',
    textColor:  'text-white',
    textShadow: '[text-shadow:_0_-1px_0_rgba(80,0,0,0.8)]',
  },
  dark: {
    outer:      'bg-[linear-gradient(to_bottom,#000,#3a3a3a)]',
    inner:      'bg-[linear-gradient(to_bottom,#fafafa,#2a2a2a,#e5e5e5)]',
    button:     'bg-[linear-gradient(to_bottom,#2a2a2a,#0f0f0f)]',
    textColor:  'text-white',
    textShadow: '[text-shadow:_0_-1px_0_rgba(0,0,0,0.8)]',
  },
  default: {
    outer:      'bg-[linear-gradient(to_bottom,#000,#a0a0a0)]',
    inner:      'bg-[linear-gradient(to_bottom,#fafafa,#3e3e3e,#e5e5e5)]',
    button:     'bg-[linear-gradient(to_bottom,#b9b9b9,#969696)]',
    textColor:  'text-white',
    textShadow: '[text-shadow:_0_-1px_0_rgba(80,80,80,1)]',
  },
}

const ShineEffect = ({ isPressed }: { isPressed: boolean }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300 ${isPressed ? 'opacity-30' : 'opacity-0'}`}
  >
    <div className="absolute inset-0 rounded-md bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.4),transparent)]" />
  </div>
)

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className = '', variant = 'default', asChild = false, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isTouchDevice, setIsTouchDevice] = React.useState(false)
    const Comp = asChild ? Slot : 'button'

    React.useEffect(() => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    const colors = colorVariants[variant]
    const transitionStyle = 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)'

    const wrapperStyle: React.CSSProperties = {
      transform: isPressed ? 'translateY(2px) scale(0.99)' : 'translateY(0) scale(1)',
      boxShadow: isPressed
        ? '0 1px 3px rgba(0,0,0,0.2)'
        : isHovered && !isTouchDevice
          ? '0 6px 20px rgba(0,0,0,0.2)'
          : '0 3px 10px rgba(0,0,0,0.12)',
      transition: transitionStyle,
      transformOrigin: 'center center',
    }

    const buttonStyle: React.CSSProperties = {
      transform: isPressed ? 'scale(0.97)' : 'scale(1)',
      transition: transitionStyle,
      filter: isHovered && !isPressed && !isTouchDevice ? 'brightness(1.05)' : 'none',
    }

    return (
      <div
        className={`relative inline-flex transform-gpu rounded-md p-[1.5px] will-change-transform ${colors.outer} ${className}`}
        style={wrapperStyle}
      >
        <div className={`absolute inset-[1px] transform-gpu rounded-[4px] will-change-transform ${colors.inner}`} />
        <Comp
          ref={ref}
          className={`relative z-10 m-[1px] inline-flex h-11 transform-gpu cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[4px] px-6 py-2 text-sm font-semibold leading-none will-change-transform outline-none ${colors.button} ${colors.textColor} ${colors.textShadow}`}
          style={buttonStyle}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => { setIsPressed(false); setIsHovered(false) }}
          onMouseEnter={() => { if (!isTouchDevice) setIsHovered(true) }}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => setIsPressed(false)}
          {...props}
        >
          <ShineEffect isPressed={isPressed} />
          {children}
          {isHovered && !isPressed && !isTouchDevice && (
            <div className="pointer-events-none absolute inset-0 rounded-[4px] bg-[linear-gradient(to_top,transparent,rgba(255,255,255,0.08))]" />
          )}
        </Comp>
      </div>
    )
  }
)
MetalButton.displayName = 'MetalButton'
