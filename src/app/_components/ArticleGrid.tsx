
'use client'

import { useMemo, useState } from 'react'

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
    <section className="mt-12 pt-6">
      {/* Header atas: hanya View more (flag pindah ke dalam kartu) */}
    

      {/* GRID: 3/5 Featured – 2/5 Thumbs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
        {/* KIRI: FEATURED – nempel kiri viewport (tanpa sisa padding) */}
        <div className="lg:col-span-3 bleed-left sm:bleed-left lg:bleed-left -ml-6 sm:-ml-8 lg:-ml-12">
          <article className="group h-full">
            <a href={featured?.href || '#'} className="block h-full">
              <div
                className="
                  h-full flex flex-col overflow-hidden rounded-[28px]
                  bg-white/75 backdrop-blur-xl border border-white/40
                  shadow-[0_32px_80px_rgba(15,23,42,0.10)]
                  transition-all duration-300 hover:bg-white/85 hover:shadow-[0_36px_96px_rgba(15,23,42,0.14)]
                "
              >
                {/* KONTEN ATAS */}
                <div className="px-6 md:px-8 pl-12 md:pl-16 pt-6 md:pt-8 pb-5 md:pb-6">
                  {/* Flag TRENDING NOW */}
                  <div className="mb-4">
                    <div className="flex items-center relative">
                      <div className="w-0.5 h-6 bg-violet-600 rounded-full z-10"></div>
                      <div className="relative -ml-0.5">
                        <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide pl-1">
                          TRENDING NOW
                        </span>
                        {/* Violet fade effect overlay starting from left */}
                        <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mb-3 text-[12px] font-medium">
                    <span className="text-[#567FB0] font-semibold">E-commerce</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-slate-500">{featured?.time || 'a year ago'}</span>
                  </div>

                  {/* Judul */}
                  <h3 className="text-[26px] leading-[1.06] font-semibold text-slate-900 max-w-[30ch]" style={{ fontFamily: "'Sequel Sans', sans-serif" }}>
                    {featured?.title}
                  </h3>

                  {/* Deskripsi */}
                  {featured?.description && (
                    <p className="mt-4 text-[15px] leading-[1.6] text-slate-600 max-w-[65ch]">
                      {featured.description}
                    </p>
                  )}

                  {/* CTA segmented */}
                  <div className="mt-6">
                    <a
                      href={featured?.href || '#'}
                      className="
                        inline-flex items-center rounded-full bg-slate-900/90 text-white
                        pl-4 pr-1 h-10 text-[14px] font-semibold
                        hover:bg-slate-900 transition-colors
                      "
                    >
                      <span>Read article</span>
                      <span
                        className="
                          ml-3 inline-flex items-center justify-center w-8 h-8 rounded-full
                          bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.15)]
                        "
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14">
                          <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>

                {/* Garis pemisah tipis */}
                <div className="h-px bg-slate-200/70" />

                {/* GAMBAR BAWAH – dibentuk seperti referensi */}
                <div className="px-5 md:px-8 pl-12 md:pl-16 pb-6 md:pb-8">
                  <div
                    className="
                      relative h-[240px] md:h-[300px] lg:h-[340px]
                      rounded-[22px] md:rounded-[24px] overflow-hidden
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
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </a>
          </article>
        </div>

        {/* KANAN: 6 THUMBNAILS (3×2) dengan deskripsi - layout stabil untuk zoom */}
        <div className="lg:col-span-2 relative">
          <div className="lg:pl-6 xl:pl-10 relative">
            {/* Container dengan ukuran diperlebar untuk tampilan yang lebih besar */}
            <div className="relative lg:static lg:w-[220%] xl:w-[240%]">
              <div className="grid grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-14">
              {smallItems.map((item, i) => (
                <article key={`${item.id}-${i}`} className="group">
                  <a href={item.href} className="block">
                    <div className="rounded-[24px] overflow-hidden bg-white/65 border border-white/35 backdrop-blur-xl shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:bg-white/75 transition-all duration-300 mb-4">
                      <div className="relative w-full h-[100px] sm:h-[120px] lg:h-[150px] overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100" />
                        )}
                      </div>
                    </div>

                    <div className="px-3">
                      <div className="mb-1 text-[13px] font-medium">
                        <span className="text-[#567FB0] font-semibold">{item.category}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span className="text-slate-500">{item.time}</span>
                      </div>

                      <h3 className="text-[19px] leading-[1.2] font-semibold text-slate-900 mb-1">
                        {item.title}
                      </h3>

                        {/* show single hashtag like reference; fallback to category if no tags present */}
                        {(item.tags && item.tags.length > 0) || item.category ? (
                          <div className="mt-0 text-[15px] text-slate-500">#{item.tags && item.tags.length > 0 ? item.tags[0] : item.category}</div>
                        ) : null}
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {/* Nav arrows */}
            {totalSlides > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  aria-label="Previous"
                  onClick={prev}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
                    current === 0
                      ? 'bg-white/90 border border-slate-200 text-slate-700 shadow-[0_6px_12px_rgba(15,23,42,0.06)] hover:bg-white'
                      : 'bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" className="mx-auto">
                    <path d="M7.5 3.25L4.5 6L7.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800 transition-all flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" className="mx-auto">
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
