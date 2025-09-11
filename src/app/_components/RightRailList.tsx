'use client'

import Image from 'next/image'
import SearchGlass from './SearchGlass'

interface RightRailItem {
  thumb: string
  meta: string
  title: string
  href: string
  featured?: boolean
}

interface RightRailListProps {
  items: RightRailItem[]
  title?: string
  viewAllHref?: string
  onSearch?: (query: string) => void
}

export default function RightRailList({ 
  items, 
  title = "Recommended",
  viewAllHref = "#",
  onSearch
}: RightRailListProps) {
  const featuredItem = items.find(item => item.featured) || items[0]
  const regularItems = items.filter(item => !item.featured).slice(0, 5)

  return (
    <aside className="w-full xl:w-[380px] flex-shrink-0">
      {/* Toolbar: Search with language selector */}
      <div className="mb-4">
        <SearchGlass onSearch={onSearch} />
      </div>

      {/* Header: Recommended + View all */}
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[18px] font-semibold text-slate-900/90">{title}</h3>
        <a href={viewAllHref} className="text-[13px] text-slate-600 hover:text-slate-800 transition-colors">
          View all
        </a>
      </div>

      {/* Featured card with overlay and text on image */}
      {featuredItem && (
        <a href={featuredItem.href} className="featured-card block">
          <div className="relative w-full aspect-video">
            <Image
              src={featuredItem.thumb}
              alt={featuredItem.title}
              fill
              className="object-cover saturate-90 brightness-105"
            />
            {/* Purple overlay gradient */}
            <div className="featured-overlay"></div>
            {/* Content on top of image */}
            <div className="featured-content">
              <p className="text-xs opacity-90 mb-1">{featuredItem.meta}</p>
              <h4 className="text-[15px] font-medium leading-snug line-clamp-2">
                {featuredItem.title}
              </h4>
            </div>
          </div>
        </a>
      )}

      {/* Compact list - text left, thumbnail right */}
      <div className="space-y-3">
        {regularItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="media-item"
          >
            <div className="min-w-0">
              <p className="meta">{item.meta}</p>
              <h5 className="text-[15px] leading-snug line-clamp-2 text-slate-700/95">
                {item.title}
              </h5>
            </div>
            <div className="relative w-[64px] h-[64px] rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={item.thumb}
                alt={item.title}
                fill
                className="object-cover saturate-90 brightness-105"
              />
            </div>
          </a>
        ))}
      </div>
    </aside>
  )
}
