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
    <div className="relative min-h-[420px] lg:min-h-[460px] flex items-center">
      {/* Content */}
      <div className="relative z-20">
        {/* Meta - 8px margin bottom */}
        <p className="meta mb-2">{category} • {time}</p>
        
        {/* H1 - 36px/40px, semibold, tight leading, 28ch width */}
        <h1 className="hero-title mb-3">
          {title}
        </h1>
        
        {/* Tag chips - 12px gap after H1 */}
        <div className="mt-3 flex gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center h-7 px-3 rounded-full bg-white/40 border border-white/25 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        
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
