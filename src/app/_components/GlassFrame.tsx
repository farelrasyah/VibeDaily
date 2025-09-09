'use client'

import { ReactNode } from 'react'

interface GlassFrameProps {
  children: ReactNode
  className?: string
}

export default function GlassFrame({ children, className = '' }: GlassFrameProps) {
  return (
    <section className={`max-w-7xl mx-auto glass-frame ${className}`}>
      {children}
    </section>
  )
}
