'use client'

interface TickerItem {
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
    <div className="mt-32 pt-16 relative">
      {/* Horizontal scrolling container with fade effect */}
      <div className="relative overflow-hidden">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="relative flex-shrink-0 w-[280px] group cursor-pointer ticker-card"
              style={{ 
                opacity: index === 0 ? 1 : index === 1 ? 0.8 : index === 2 ? 0.6 : 0.4,
                transform: `scale(${index === 0 ? 1 : index === 1 ? 0.98 : 0.96})`
              }}
            >
              {/* Text-only card design */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl p-5 h-[100px] transition-all duration-300 hover:bg-white/60 hover:scale-[1.02] hover:shadow-xl hover:border-white/40">
                <div className="flex flex-col justify-between h-full">
                  {/* Meta - sama dengan referensi */}
                  <div className="meta">
                    {item.category} • {item.time}
                  </div>
                  
                  {/* Title - ukuran font sesuai referensi */}
                  <h3 className="text-[15px] font-semibold leading-[1.3] text-slate-800/90 line-clamp-3 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* Enhanced right fade gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-full ticker-fade pointer-events-none"></div>
      </div>
    </div>
  )
}
