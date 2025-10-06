
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
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => new Set([...prev, articleId]))
  }

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
    const feats = items.filter(i => i && i.featured && i.id && i.title)
    console.log('ArticleGrid featured pool:', feats.length)
    return feats.length ? feats : (items.length ? [items[0]].filter(i => i && i.id && i.title) : [])
  }, [items])

  const thumbsPool = useMemo(() => {
    // Get non-featured items and ensure uniqueness
    const thumbs = items.filter(i => i && !i.featured && i.id && i.title)
    
    // Remove duplicates based on URL and title
    const uniqueThumbs: ArticleGridItem[] = []
    const usedUrls = new Set<string>()
    const usedTitles = new Set<string>()
    
    // Also exclude featured articles from thumbnails to prevent duplication
    const featuredUrls = new Set(featuredPool.map(f => f.href))
    const featuredTitles = new Set(featuredPool.map(f => f.title.toLowerCase().trim()))
    
    for (const thumb of thumbs) {
      const thumbUrl = thumb.href
      const thumbTitle = thumb.title.toLowerCase().trim()
      
      // Skip if already used or if it matches a featured article
      if (!usedUrls.has(thumbUrl) && 
          !usedTitles.has(thumbTitle) && 
          !featuredUrls.has(thumbUrl) && 
          !featuredTitles.has(thumbTitle)) {
        uniqueThumbs.push(thumb)
        usedUrls.add(thumbUrl)
        usedTitles.add(thumbTitle)
      }
    }
    
    console.log('ArticleGrid thumbs pool (unique):', uniqueThumbs.length)
    return uniqueThumbs
  }, [items, featuredPool])

  const [current, setCurrent] = useState(0)
  const totalSlides = useMemo(() => {
    const thumbsSlides = Math.max(1, Math.ceil((thumbsPool.length || 1) / 6))
    return Math.max(thumbsSlides, Math.max(1, featuredPool.length))
  }, [thumbsPool.length, featuredPool.length])

  const next = () => setCurrent(v => (v + 1) % totalSlides)
  const prev = () => setCurrent(v => (v - 1 + totalSlides) % totalSlides)

  const featured = featuredPool.length ? featuredPool[current % featuredPool.length] : undefined
  
  // Improved small items selection to ensure no duplicates
  const start = ((current % totalSlides) * 6) % Math.max(1, thumbsPool.length)
  const smallItems = thumbsPool.length >= 6
    ? thumbsPool.slice(start, start + 6)
    : thumbsPool.length > 0
    ? (() => {
        // If we have fewer than 6 unique articles, cycle through them uniquely
        const result: ArticleGridItem[] = []
        for (let i = 0; i < 6; i++) {
          if (thumbsPool.length > 0) {
            const index = (start + i) % thumbsPool.length
            const article = thumbsPool[index]
            
            // Only add if not already in result (prevent immediate duplicates)
            if (!result.some(item => item.href === article.href || item.title.toLowerCase().trim() === article.title.toLowerCase().trim())) {
              result.push(article)
            } else if (result.length < 6) {
              // If we can't avoid duplication and still need items, add with modified data
              result.push({
                ...article,
                id: `${article.id}-cycle-${i}`,
                title: `${article.title} (${i + 1})`
              })
            }
          }
        }
        
        // Fill remaining slots if needed
        while (result.length < 6 && thumbsPool.length > 0) {
          const fallbackIndex = result.length % thumbsPool.length
          const fallbackArticle = thumbsPool[fallbackIndex]
          result.push({
            ...fallbackArticle,
            id: `${fallbackArticle.id}-fill-${result.length}`,
            title: `Loading more articles...`
          })
        }
        
        return result
      })()
    : []

  // Debug logging
  console.log('ArticleGrid render:', {
    totalItems: items.length,
    featuredPool: featuredPool.length,
    thumbsPool: thumbsPool.length,
    currentSlide: current,
    totalSlides,
    smallItemsCount: smallItems.length,
    featuredHasImage: featured?.image ? 'yes' : 'no',
    uniqueSmallItems: new Set(smallItems.map(item => item.href)).size,
    duplicatesInSmallItems: smallItems.length - new Set(smallItems.map(item => item.href)).size
  })

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
            <div onClick={() => router.push(featured?.href || '/')} className="block h-full cursor-pointer">
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
                  <div className="mb-3 sm:mb-4 transition-all duration-1200 ease-in-out" style={{ transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(15%) scale(0.95)', opacity: isVisible ? 1 : 0 }}>
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

                    <h3 className="text-2xl sm:text-3xl md:text-[32px] leading-[1.1] sm:leading-[1.06] font-semibold text-slate-900 max-w-[30ch] group" style={{ fontFamily: "'Sequel Sans', sans-serif" }}>
                    {featured?.title.split('').map((char, index) => (
                      <span
                        key={index}
                        className="inline-block transition-all duration-200 ease-out"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          filter: isVisible ? 'blur(0)' : 'blur(5px)',
                          transitionDelay: `${index * 20}ms`
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </h3>

                  {/* Deskripsi */}
                  {featured?.description && (
                    <p
                      className="mt-3 sm:mt-4 text-sm sm:text-[15px] leading-[1.5] sm:leading-[1.6] text-slate-600 max-w-[65ch] line-clamp-3 overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                        transition: 'transform 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.9s'
                      }}
                    >
                      {featured.description}
                    </p>
                  )}

                  {/* CTA segmented */}
                  <div className="mt-4 sm:mt-6">
                    <div className="flex gap-2 items-center">
                      <a
                        href={featured?.href || '#'}
                        className="inline-flex items-center rounded-full bg-[#e6eefc] text-slate-900 pl-4 pr-2 h-9 sm:h-10 text-xs sm:text-[14px] font-semibold shadow-none border-none hover:bg-[#dbe7fa] transition-colors"
                        style={{
                          boxShadow: 'none',
                          transition: 'transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.7s',
                          transform: isVisible ? 'scale(1)' : 'scale(0.85)',
                          opacity: isVisible ? 1 : 0
                        }}
                      >
                        <span>Read article</span>
                      </a>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full bg-[#e6eefc] w-8 h-8 sm:w-9 sm:h-9 shadow-none border-none ml-0.5 hover:bg-[#dbe7fa] transition-colors"
                        tabIndex={-1}
                        aria-label="Go to article"
                        style={{
                          boxShadow: 'none',
                          transition: 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.6s',
                          transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
                          opacity: isVisible ? 1 : 0
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" className="text-slate-500">
                          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
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
                    {featured?.image && !imageErrors.has(featured.id) ? (
                      <img
                        src={featured.image}
                        alt={featured.title || 'featured'}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${
                          isVisible ? 'zoom-in-image' : ''
                        }`}
                        onError={() => handleImageError(featured.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className={`absolute inset-0 w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center transition-transform duration-1000 ease-out ${
                        isVisible ? 'zoom-in-image' : ''
                      }`}>
                        <div className="text-center text-white/80">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">News Image</span>
                        </div>
                      </div>
                    )}
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
                  <div onClick={() => router.push(item.href)} className="block cursor-pointer">
                    <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden bg-white/65 border border-white/35 backdrop-blur-xl shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:bg-white/75 transition-all duration-300 mb-3 sm:mb-4">
                      <div className="relative w-full h-[120px] sm:h-[140px] md:h-[120px] lg:h-[150px] overflow-hidden">
                        {item.image && !imageErrors.has(item.id) ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
                              isVisible ? 'zoom-in-thumbnail' : ''
                            }`}
                            style={{ animationDelay: `${i * 150}ms` }}
                            onError={() => handleImageError(item.id)}
                            loading="lazy"
                          />
                        ) : (
                          <div 
                            className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center transition-transform duration-700 ease-out ${
                              isVisible ? 'zoom-in-thumbnail' : ''
                            }`} 
                            style={{ animationDelay: `${i * 150}ms` }}
                          >
                            <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-2 sm:px-3">
                      <div className="mb-1 text-[11px] sm:text-[13px] font-medium">
                        <span className="text-[#567FB0] font-semibold">{item.category}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-slate-500">{item.time}</span>
                      </div>

                      <div className="relative mb-1">
                        <h3
                          className="text-base sm:text-lg md:text-[19px] leading-[1.2] font-semibold text-slate-900 max-w-full"
                          style={{
                            fontFamily: "'Sequel Sans', sans-serif",
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            position: 'relative',
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                          }}
                        >
                          {item.title}
                        </h3>
                      </div>

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
