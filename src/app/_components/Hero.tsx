'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface HeroProps {
  category: string
  time: string
  title: string
  tags: string[]
  ctaText?: string
  onCta?: () => void
  orb?: boolean
}

export default function Hero({ 
  category, 
  time, 
  title, 
  tags, 
  ctaText = "Read article", 
  onCta,
  orb = true 
}: HeroProps) {
  return (
    <div className="relative min-h-[420px] lg:min-h-[400px] flex items-center">
      {/* Content */}
      <div className="relative z-20">
        {/* Meta - positioned like in reference image */}
        <p className="mt-4 mb-2">
          <span className="hero-category">{category}</span> <span className="hero-separator">•</span> <span className="meta">{time}</span>
        </p>
        
        {/* H1 - 36px/40px, semibold, tight leading, 28ch width */}
        <h1 className="hero-title mb-3">
          {title}
        </h1>
        
        {/* Tag chips - 12px gap after H1 */}
        <p className="hero-description mt-3 mb-4">
          Consistent visual elements (logos, color schemes etc).
        </p>
        
        {/* CTA with chevron circle - 16-20px gap after tags */}
        <button 
          className="inline-flex items-center h-9 px-4 rounded-full border border-white/25 bg-white/20 hover:bg-white/30 transition-all duration-150 ease-out hover:-translate-y-px"
          onClick={onCta}
        >
          {ctaText}
          <span className="ml-2 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border border-white/25 bg-white/10">
            <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
          </span>
        </button>
      </div>

      {/* Oval image decoration - background layer */}
      {orb && (
        <div className="absolute left-[420px] top-[260px] transform -translate-y-1/2 pointer-events-none w-[480px] h-[480px] z-10">
          <div className="relative w-full h-full overflow-hidden rounded-full bg-transparent">
            <Image 
              src="/oval.jpg" 
              alt="Decorative oval" 
              width={480}
              height={480}
              quality={100}
              priority
              unoptimized
              className="w-full h-full object-cover opacity-90 scale-105"
              style={{ 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none',
                filter: 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
