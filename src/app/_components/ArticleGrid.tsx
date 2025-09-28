
'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ArticleGridItem {
  id: string
  title: string
  category: string
  time: string
  href: string
  image?: string
  featured?: boolean
  tags?: string[]
  description?: string
}

interface ArticleGridProps {
  items: ArticleGridItem[]
}

/**
 * Trending Now:
 * - Flag "TRENDING NOW" di dalam kartu featured.
 * - Kartu featured dibikin full-bleed kiri (nempel pojok kiri viewport) pakai kelas bleed-left.
 * - Gambar bawah: dibentuk seperti referensi (rounded besar di dalam kartu + border halus).
 * - Kanan: 6 thumbnail (3×2) dengan deskripsi lengkap + panah di bawah.
 */
export default function ArticleGrid({ items }: ArticleGridProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before fully visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const featuredPool = useMemo(() => {
    const feats = items.filter(i => i.featured)
    return feats.length ? feats : (items.length ? [items[0]] : [])
  }, [items])

  const thumbsPool = useMemo(() => items.filter(i => !i.featured), [items])

  const [current, setCurrent] = useState(0)
  const totalSlides = useMemo(() => {
    const thumbsSlides = Math.max(1, Math.ceil((thumbsPool.length || 1) / 6))
    return Math.max(thumbsSlides, Math.max(1, featuredPool.length))
  }, [thumbsPool.length, featuredPool.length])

  const next = () => setCurrent(v => (v + 1) % totalSlides)
  const prev = () => setCurrent(v => (v - 1 + totalSlides) % totalSlides)

  const featured = featuredPool.length ? featuredPool[current % featuredPool.length] : undefined
  const start = ((current % totalSlides) * 6) % (thumbsPool.length || 1)
  const smallItems = thumbsPool.length
    ? Array.from({ length: 6 }, (_, i) => thumbsPool[(start + i) % thumbsPool.length])
    : []

  return (
    <section 
      ref={sectionRef}
      className="mt-8 pt-4 sm:mt-10 sm:pt-5 md:mt-12 md:pt-6"
    >
      {/* Header atas: hanya View more (flag pindah ke dalam kartu) */}
    

      {/* GRID: Mobile-first responsive grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-5 lg:gap-6">
        {/* KIRI: FEATURED – responsive margins */}
        <div className="lg:col-span-3 -mx-4 sm:-mx-6 md:-mx-8 lg:bleed-left lg:sm:bleed-left lg:lg:bleed-left lg:-ml-12">
          <article className="group h-full">
            <div onClick={() => router.push('/article-view')} className="block h-full cursor-pointer">
              <div
                className="
                  h-full flex flex-col overflow-hidden rounded-[28px]
                  bg-white/75 backdrop-blur-xl border border-white/40
                  shadow-[0_32px_80px_rgba(15,23,42,0.10)]
                  transition-all duration-300 hover:bg-white/85 hover:shadow-[0_36px_96px_rgba(15,23,42,0.14)]
                "
              >
                {/* KONTEN ATAS */}
                <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4 md:px-8 md:pt-6 md:pb-5 lg:pl-12 lg:pt-6 lg:pb-5 xl:pl-16 xl:pt-8 xl:pb-6">
                  {/* Flag TRENDING NOW */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center relative">
                      <div className="w-0.5 h-6 bg-violet-600 rounded-full z-10"></div>
                      <div className="relative -ml-0.5">
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide pl-1">
                          TRENDING NOW
                        </span>
                        {/* Violet fade effect overlay starting from left */}
                        <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mb-2 sm:mb-3 text-[11px] sm:text-[12px] font-medium">
                    <span className="text-[#567FB0] font-semibold">E-commerce</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-slate-500">{featured?.time || 'a year ago'}</span>
                  </div>

                  {/* Judul */}
                  <h3 className="text-xl sm:text-2xl md:text-[26px] leading-[1.1] sm:leading-[1.06] font-semibold text-slate-900 max-w-[30ch]" style={{ fontFamily: "'Sequel Sans', sans-serif" }}>
                    {featured?.title}
                  </h3>

                  {/* Deskripsi */}
                  {featured?.description && (
                    <p className="mt-3 sm:mt-4 text-sm sm:text-[15px] leading-[1.5] sm:leading-[1.6] text-slate-600 max-w-[65ch]">
                      {featured.description}
                    </p>
                  )}

                  {/* CTA segmented */}
                  <div className="mt-4 sm:mt-6">
                    <a
                      href={featured?.href || '#'}
                      className="
                        inline-flex items-center rounded-full bg-slate-900/90 text-white
                        pl-3 sm:pl-4 pr-1 h-9 sm:h-10 text-xs sm:text-[14px] font-semibold
                        hover:bg-slate-900 transition-colors
                      "
                    >
                      <span>Read article</span>
                      <span
                        className="
                          ml-2 sm:ml-3 inline-flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 rounded-full
                          bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.15)]
                        "
                      >
                        <svg width="12" height="12" viewBox="0 0 14 14" className="sm:w-[14px] sm:h-[14px]">
                          <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Garis pemisah tipis */}
                <div className="h-px bg-slate-200/70" />

                {/* GAMBAR BAWAH – dibentuk seperti referensi */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-5 md:px-8 md:pb-6 lg:pl-12 lg:pb-6 xl:pl-16 xl:pb-8">
                  <div
                    className="
                      relative h-[200px] sm:h-[240px] md:h-[280px] lg:h-[340px]
                      rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden
                      border border-white/55 bg-white/40 backdrop-blur-[2px]
                      shadow-[0_18px_50px_rgba(15,23,42,0.12)]
                    "
                  >
                    <img
                      src={
                        featured?.image && featured.image.trim() !== ''
                          ? featured.image
                          : 'https://picsum.photos/1400/900?random=34'
                      }
                      alt={featured?.title || 'featured'}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${
                        isVisible ? 'zoom-in-image' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* KANAN: THUMBNAILS - responsive grid layout */}
        <div className="lg:col-span-2 relative">
          <div className="lg:pl-6 xl:pl-10 relative">
            {/* Container dengan ukuran responsif */}
            <div className="relative lg:static lg:w-[220%] xl:w-[240%]">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-14">
              {smallItems.map((item, i) => (
                <article key={`${item.id}-${i}`} className="group">
                  <div onClick={() => router.push('/article-view')} className="block cursor-pointer">
                    <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden bg-white/65 border border-white/35 backdrop-blur-xl shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:bg-white/75 transition-all duration-300 mb-3 sm:mb-4">
                      <div className="relative w-full h-[120px] sm:h-[140px] md:h-[120px] lg:h-[150px] overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
                              isVisible ? 'zoom-in-thumbnail' : ''
                            }`}
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 transition-transform duration-700 ease-out ${
                            isVisible ? 'zoom-in-thumbnail' : ''
                          }`} style={{ animationDelay: `${i * 150}ms` }} />
                        )}
                      </div>
                    </div>

                    <div className="px-2 sm:px-3">
                      <div className="mb-1 text-[11px] sm:text-[13px] font-medium">
                        <span className="text-[#567FB0] font-semibold">{item.category}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-slate-500">{item.time}</span>
                      </div>

                      <h3 className="text-base sm:text-lg md:text-[19px] leading-[1.2] font-semibold text-slate-900 mb-1">
                        {item.title}
                      </h3>

                        {/* show single hashtag like reference; fallback to category if no tags present */}
                        {(item.tags && item.tags.length > 0) || item.category ? (
                          <div className="mt-0 text-sm sm:text-[15px] text-slate-500">#{item.tags && item.tags.length > 0 ? item.tags[0] : item.category}</div>
                        ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Nav arrows */}
            {totalSlides > 1 && (
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3">
                <button
                  aria-label="Previous"
                  onClick={prev}
                  className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full transition-all flex items-center justify-center ${
                    current === 0
                      ? 'bg-white/90 border border-slate-200 text-slate-700 shadow-[0_6px_12px_rgba(15,23,42,0.06)] hover:bg-white'
                      : 'bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800'
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" className="sm:w-3 sm:h-3 mx-auto">
                    <path d="M7.5 3.25L4.5 6L7.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800 transition-all flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" className="sm:w-3 sm:h-3 mx-auto">
                    <path d="M4.5 3.25L7.5 6L4.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  </section>
  )
}
