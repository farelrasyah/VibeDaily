'use client'

import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface HeroProps {
  category: string
  time: string
  title: string
  tags: string[]
  ctaText?: string
  onCta?: () => void
  orb?: boolean
  articleId?: string // Add articleId prop for routing
}

export default function Hero({
  category,
  time,
  title,
  tags: _tags,
  ctaText = 'Read article',
  onCta,
  orb = true,
  articleId,
}: HeroProps) {
  const router = useRouter()

  // Internal navigation function
  const handleCta = () => {
    if (articleId) {
      router.push(`/article/${articleId}`)
    } else if (onCta) {
      onCta()
    }
  }
  return (
    <section className="relative">
      {/* ORB / dekorasi kanan - responsive positioning */}
      {orb && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 sm:-right-32 md:-right-40 lg:-right-50 -bottom-20 sm:-bottom-30 md:bottom-10 lg:-bottom-60 -z-10 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] md:h-[760px] md:w-[760px] lg:h-[880px] lg:w-[880px] overflow-hidden rounded-full"
        >
          <Image
            src="/oval.gif"
            alt=""
            width={880}
            height={880}
            quality={100}
            priority
            unoptimized
            className="h-full w-full scale-110 opacity-80 sm:opacity-90 md:opacity-100 object-cover animate-pulse"
            style={{
              animationDuration: '4s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
        </div>
      )}

      {/* Konten */}
      <div className="relative z-20 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[400px] flex items-start pt-12 sm:pt-16 md:pt-18 lg:pt-20">
        <div className="relative">
          {/* Flag "Best of the week" - responsive */}
          <div className="absolute -top-6 sm:-top-7 md:-top-8 left-0 mb-6 sm:mb-7 md:mb-8 mt-2">
            <div className="flex items-center relative">
              <div className="w-0.5 h-5 sm:h-6 bg-violet-600 rounded-full z-10"></div>
              <div className="relative -ml-0.5">
                <span className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide pl-1">
                  Best of the week
                </span>
                {/* Violet fade effect overlay starting from left */}
                <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mb-4 sm:mb-5 md:mb-6 mt-8 sm:mt-10 md:mt-12">
            <p>
              <span className="hero-category">{category}</span>{' '}
              <span className="hero-separator">•</span>{' '}
              <span className="meta">{time}</span>
            </p>
          </div>

          {/* Judul - responsive typography */}
            <div className="mb-4 sm:mb-5 md:mb-6">
            {title.split('\n').length <= 4 && (
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.95] sm:leading-[0.92] md:leading-[0.9] lg:leading-[0.88] xl:leading-[0.86] text-slate-900 max-w-[20ch] sm:max-w-[18ch] md:max-w-[16ch] tracking-tight"
                  style={{
                  fontFamily: "'Sequel Sans', sans-serif",
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  wordBreak: 'break-word'
                  }}
                >
                  {title}
                </h1>
            )}
            </div>

          {/* Deskripsi singkat - responsive */}
          <p className="text-sm sm:text-base md:text-lg leading-[1.6] sm:leading-[1.5] md:leading-[1.4] text-slate-600 mt-2 sm:mt-3 mb-4 sm:mb-5 md:mb-6 max-w-[35ch] sm:max-w-[40ch] md:max-w-[45ch]">
            Consistent visual elements (logos, color schemes etc).
          </p>

          {/* CTA utama + tombol panah terpisah - responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white text-slate-900 border border-white shadow-sm hover:shadow transition-all text-sm sm:text-base font-semibold"
              onClick={handleCta}
            >
              {ctaText}
            </button>

            <button
              aria-label="Go"
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 backdrop-blur hover:bg-white transition-all hover:-translate-y-px"
              onClick={handleCta}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}