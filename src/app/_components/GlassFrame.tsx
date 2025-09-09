'use client'

import { ReactNode } from 'react'

interface GlassFrameProps {
  children: ReactNode
  className?: string
}

export default function GlassFrame({ children, className = '' }: GlassFrameProps) {
  return (
    <section className={`container glass-frame ${className}`}>
      {children}
    </section>
  )
}
