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
    <div className="mt-16 pt-8 sm:mt-20 sm:pt-10 md:mt-24 md:pt-12 lg:mt-32 lg:pt-16 relative">
      {/* Horizontal scrolling container with fade effect - responsive */}
      <div className="relative overflow-hidden">
        <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-2 px-4 sm:px-6 lg:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="relative flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px] group cursor-pointer ticker-card"
              style={{ 
                opacity: index === 0 ? 1 : index === 1 ? 0.9 : index === 2 ? 0.7 : 0.5,
                transform: `scale(${index === 0 ? 1 : index === 1 ? 0.98 : 0.96})`
              }}
            >
              {/* Text-only card design - responsive */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 h-[90px] sm:h-[100px] transition-all duration-300 hover:bg-white/60 hover:scale-[1.02] hover:shadow-xl hover:border-white/40">
                <div className="flex flex-col justify-between h-full">
                  {/* Meta - responsive font size */}
                  <div className="text-[11px] sm:text-[12px] font-medium text-slate-500">
                    {item.category} • {item.time}
                  </div>
                  
                  {/* Title - responsive typography */}
                  <h3 className="text-sm sm:text-[15px] font-semibold leading-[1.2] sm:leading-[1.3] text-slate-800/90 line-clamp-3 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        {/* Enhanced right fade gradient overlay - responsive */}
        <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-full ticker-fade pointer-events-none"></div>
      </div>
    </div>
  )
}
