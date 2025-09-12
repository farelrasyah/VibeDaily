'use client'

import { useState } from 'react'

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

export default function ArticleGrid({ items }: ArticleGridProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = Math.ceil(items.length / 5) // 1 featured + 4 small items per slide

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentItems = () => {
    const startIndex = currentSlide * 5
    return items.slice(startIndex, startIndex + 5)
  }

  const currentItems = getCurrentItems()
  const featuredItem = currentItems[0]
  const smallItems = currentItems.slice(1, 5)

  return (
    <section className="mt-12 pt-6">
      {/* Section Header - persis seperti referensi */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-purple-600 to-blue-500 rounded-full"></div>
          <h2 className="text-lg font-bold text-slate-900 tracking-normal">TRENDING NOW</h2>
        </div>
        <a 
          href="#" 
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors group"
        >
          View more 
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            className="group-hover:translate-x-0.5 transition-transform"
          >
            <path 
              d="M5.25 2.5L9.5 7L5.25 11.5" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* Main Content Grid - persis seperti referensi */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Featured Article - Left Side (3/5 width) */}
        {featuredItem && (
          <div className="lg:col-span-3">
            <article className="group cursor-pointer h-full">
              <a href={featuredItem.href} className="block h-full">
                <div className="bg-white/65 backdrop-blur-xl border border-white/35 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/80 hover:scale-[1.005] hover:shadow-xl hover:border-white/50 h-full flex flex-col">
                  {/* Featured Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                    {featuredItem.image ? (
                      <img 
                        src={featuredItem.image} 
                        alt={featuredItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
                        {/* Grid layout mockup - sesuai referensi */}
                        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                          {/* Row 1 - 3 items */}
                          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                          {/* Row 2 - 3 items */}
                          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg aspect-square flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/20 rounded-md"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                        {featuredItem.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {featuredItem.time}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors flex-1">
                      {featuredItem.title}
                    </h3>

                    {featuredItem.description && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {featuredItem.description}
                      </p>
                    )}

                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors mt-auto self-start">
                      Read article
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </a>
            </article>
          </div>
        )}

        {/* Small Articles Grid - Right Side (2/5 width) */}
        <div className="lg:col-span-2 space-y-3">
          {smallItems.map((item, index) => (
            <article key={item.id} className="group cursor-pointer">
              <a href={item.href} className="block">
                <div className="bg-white/60 backdrop-blur-xl border border-white/30 rounded-xl p-3.5 transition-all duration-300 hover:bg-white/75 hover:scale-[1.01] hover:shadow-lg hover:border-white/45 flex items-start gap-3">
                  {/* Small Image */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/70 rounded-md"></div>
                      </div>
                    )}
                  </div>

                  {/* Small Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 mb-1 font-medium">
                      {item.category} • {item.time}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2 leading-[1.3]">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - persis seperti referensi */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={prevSlide}
            className="w-9 h-9 bg-slate-200/70 hover:bg-slate-300/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-slate-700">
              <path 
                d="M8.75 3.5L5.25 7L8.75 10.5" 
                stroke="currentColor" 
                strokeWidth="1.3" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-9 h-9 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-white">
              <path 
                d="M5.25 3.5L8.75 7L5.25 10.5" 
                stroke="currentColor" 
                strokeWidth="1.3" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
