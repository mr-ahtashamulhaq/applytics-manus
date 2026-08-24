'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard'
type BGMaskType =
  | 'fade-center'
  | 'fade-edges'
  | 'fade-top'
  | 'fade-bottom'
  | 'fade-left'
  | 'fade-right'
  | 'fade-x'
  | 'fade-y'
  | 'none'

type BGPatternProps = React.ComponentProps<'div'> & {
  variant?: BGVariantType
  mask?: BGMaskType
  size?: number
  fill?: string
}

const maskStyles: Record<BGMaskType, React.CSSProperties> = {
  'fade-edges':  { maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' },
  'fade-center': { maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)' },
  'fade-top':    { maskImage: 'linear-gradient(to bottom, transparent, black)' },
  'fade-bottom': { maskImage: 'linear-gradient(to bottom, black, transparent)' },
  'fade-left':   { maskImage: 'linear-gradient(to right, transparent, black)' },
  'fade-right':  { maskImage: 'linear-gradient(to right, black, transparent)' },
  'fade-x':      { maskImage: 'linear-gradient(to right, transparent, black, transparent)' },
  'fade-y':      { maskImage: 'linear-gradient(to bottom, transparent, black, transparent)' },
  'none':        {},
}

function getBgImage(variant: BGVariantType, fill: string, size: number): string | undefined {
  switch (variant) {
    case 'dots':
      return `radial-gradient(${fill} 1px, transparent 1px)`
    case 'grid':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`
    case 'diagonal-stripes':
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`
    case 'horizontal-lines':
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`
    case 'vertical-lines':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`
    case 'checkerboard':
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`
    default:
      return undefined
  }
}

const BGPattern = ({
  variant = 'grid',
  mask = 'none',
  size = 32,
  fill = '#e5e3df',
  className,
  style,
  ...props
}: BGPatternProps) => {
  const bgSize = `${size}px ${size}px`
  const backgroundImage = getBgImage(variant, fill, size)
  const maskStyle = maskStyles[mask]

  return (
    <div
      className={cn('absolute inset-0 size-full', className)}
      style={{
        backgroundImage,
        backgroundSize: bgSize,
        zIndex: 0,
        ...maskStyle,
        ...style,
      }}
      {...props}
    />
  )
}

BGPattern.displayName = 'BGPattern'
export { BGPattern }
