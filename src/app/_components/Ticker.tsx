'use client'

import Image from 'next/image'

interface TickerItem {
  thumb: string
  title: string
  href: string
  category?: string
  time?: string
}

interface TickerProps {
  items: TickerItem[]
}

export default function Ticker({ items }: TickerProps) {
  return (
    <div className="mt-6 flex gap-3 overflow-x-auto pb-1">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="glass-card flex items-center gap-3 p-2.5 min-w-[280px] h-[84px] transition-all duration-150 ease-out"
        >
          {/* Thumbnail 64px on left */}
          <div className="relative w-[64px] h-[64px] rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={item.thumb}
              alt={item.title}
              fill
              className="object-cover saturate-90 brightness-105"
            />
          </div>
          
          {/* Text content on right */}
          <div className="flex-1 min-w-0">
            <p className="meta mb-0.5">
              {item.category} • {item.time}
            </p>
            <p className="text-[14.5px] leading-snug line-clamp-2 text-slate-700/95">
              {item.title}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
