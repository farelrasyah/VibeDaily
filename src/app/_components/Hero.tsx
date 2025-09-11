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
  ctaText = 'Read article',
  onCta,
  orb = true,
}: HeroProps) {
  return (
    <section className="relative">
      {/* ORB / dekorasi kanan */}
      {orb && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-50 -bottom-90 -z-10 h-[880px] w-[880px] overflow-hidden rounded-full"
        >
          <Image
            src="/oval.gif"
            alt=""
            width={880}
            height={880}
            quality={100}
            priority
            unoptimized
            className="h-full w-full scale-110 opacity-100 object-cover animate-pulse"
            style={{
              animationDuration: '4s',
              animationTimingFunction: 'ease-in-out'
            }}
          />
        </div>
      )}

      {/* Konten */}
      <div className="relative z-20 min-h-[420px] lg:min-h-[400px] flex items-start pt-20">
        <div className="relative">
          {/* Flag "Best of the week" */}
          <div className="absolute -top-8 left-0 mb-8 mt-2">
            <div className="flex items-center relative">
              <div className="w-0.5 h-6 bg-violet-600 rounded-full z-10"></div>
              <div className="relative -ml-0.5">
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide pl-1">
                  Best of the week
                </span>
                {/* Violet fade effect overlay starting from left */}
                <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="mb-6 mt-12">
            <p>
              <span className="hero-category">{category}</span>{' '}
              <span className="hero-separator">•</span>{' '}
              <span className="meta">{time}</span>
            </p>
          </div>

          {/* Judul */}
          <div className="mb-6">
            <h1 className="hero-title">{title}</h1>
          </div>

          {/* Deskripsi singkat */}
          <p className="hero-description mt-3 mb-6">
            Consistent visual elements (logos, color schemes etc).
          </p>

          {/* CTA utama + tombol panah terpisah */}
          <div className="flex items-center gap-3">
            <button
              className="pill bg-white text-slate-900 border border-white shadow-sm hover:shadow transition-all"
              onClick={onCta}
            >
              {ctaText}
            </button>

            <button
              aria-label="Go"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 backdrop-blur hover:bg-white transition-all hover:-translate-y-px"
              onClick={onCta}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
