'use client'

import { useState } from 'react'
import { NewsSource } from '@/lib/news-categories'

interface NavItem {
  label: string
  active?: boolean
  source?: NewsSource
  dropdownItems: string[]
  dropdownIds?: string[]
  sources?: NewsSource[]
}

interface NavigationDropdownProps {
  items: NavItem[]
  onItemClick?: (item: NavItem) => void
  onDropdownItemClick?: (parentLabel: string, dropdownItem: string, dropdownId?: string, source?: NewsSource) => void
}

export default function NavigationDropdown({ 
  items, 
  onItemClick, 
  onDropdownItemClick 
}: NavigationDropdownProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMouseInContent, setIsMouseInContent] = useState(false)

  const handleMouseLeave = (label: string) => {
    // Only close the dropdown if the mouse is not in the content area
    if (!isMouseInContent) {
      console.log(`❄️ Leaving: ${label} (content: ${isMouseInContent})`)
      setHoveredItem(null)
    }
  }

  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start" style={{ overflow: 'visible' }}>
      {items.map((item, index) => (
        <div
          key={index}
          className="relative flex-shrink-0"
          style={{ overflow: 'visible' }}
          onMouseEnter={() => {
            console.log(`🔥 Hovering: ${item.label}`)
            setHoveredItem(item.label)
          }}
          onMouseLeave={() => handleMouseLeave(item.label)}
        >
          {/* Main Navigation Button - Enhanced Hover + Responsive */}
          <button
            onClick={() => {
              console.log(`🎯 CLICKED: ${item.label}`)
              onItemClick?.(item)
            }}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
              border transition-all duration-500
              ${item.active 
                ? 'bg-white/45 border-white/35 shadow-lg' 
                : 'bg-white/20 border-white/25 hover:bg-white/35 hover:border-white/40'
              }
            `}
            style={{
              fontFamily: 'Sequel Sans, sans-serif',
              fontSize: 'clamp(12px, 3vw, 14px)',
              fontWeight: '700', // Bold
              color: '#000000', // Hitam pekat
              transform: hoveredItem === item.label ? 'translateY(-1px)' : 'translateY(0px)',
              boxShadow: hoveredItem === item.label 
                ? '0 8px 25px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.08)'
                : item.active 
                  ? '0 4px 15px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)' // Lebih lambat dan smooth
            }}
          >
            {item.active && (
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-black rounded-full"></span>
            )}
            <span style={{ 
              fontFamily: 'Sequel Sans, sans-serif', 
              fontSize: 'clamp(12px, 3vw, 14px)', 
              fontWeight: '700', // Bold
              color: '#000000' 
            }}>
              {item.label}
            </span>
            <svg 
              className="w-3 sm:w-3.5 h-3 sm:h-3.5" 
              fill="none" 
              stroke="#000000" 
              viewBox="0 0 24 24"
              style={{
                opacity: 0.7,
                transform: hoveredItem === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)' // Lebih lambat dan smooth
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu - Grid Layout with Enhanced Animations */}
          <div
            className="absolute left-0 bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
            style={{
              top: 'calc(100% + 12px)',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              zIndex: 50,
              position: 'absolute',
              maxHeight: '400px',
              overflowY: 'auto',
              width: item.label === 'Category' ? 'max-content' : 'w-48 sm:w-52',
              // Custom scrollbar
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
              // NATURAL SLIDE DOWN & FADE IN - SLIDE UP & FADE OUT
              opacity: hoveredItem === item.label ? 1 : 0,
              transform: hoveredItem === item.label 
                ? 'translateY(0px) scale(1)' // Muncul: slide down dari button dengan scale normal
                : 'translateY(-16px) scale(0.96)', // Hilang: slide up ke button dengan slight scale down
              visibility: hoveredItem === item.label ? 'visible' : 'hidden',
              transformOrigin: 'top center', // Origin animasi dari atas tengah (dekat button)
              transition: hoveredItem === item.label 
                ? 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' // Muncul: lebih lambat dengan smooth ease-out
                : 'all 0.4s cubic-bezier(0.4, 0, 0.6, 0.15)', // Hilang: lebih lambat dengan gentle ease-in
              pointerEvents: hoveredItem === item.label ? 'auto' : 'none'
            }}
            onMouseEnter={() => {
              console.log(`🎯 DROPDOWN ENTER: ${item.label}`)
              setHoveredItem(item.label)
              setIsMouseInContent(true)
            }}
            onMouseLeave={() => {
              console.log(`🚪 DROPDOWN LEAVE: ${item.label}`)
              setIsMouseInContent(false)
              // Add a small delay to check if mouse moved to another part of the dropdown
              setTimeout(() => {
                if (!isMouseInContent) {
                  setHoveredItem(null)
                }
              }, 100)
            }}
          >
            <div className={`
              ${item.label === 'Category' ? 'grid grid-cols-2 sm:grid-cols-3 gap-1' : 'flex flex-col'}
              p-1
            `}>
              {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                <button
                  key={dropdownIndex}
                  className={`
                    text-left px-3 py-2 text-sm text-gray-700 
                    hover:bg-white/60 hover:text-slate-800 transition-all duration-200
                    ${item.label === 'Category' ? 'min-w-[120px]' : 'w-full'}
                  `}
                  onClick={() => {
                    console.log('🔄 Category Selection Details:')
                    console.log(`✅ Selected Item: "${dropdownItem}" from "${item.label}"`)
                    const dropdownId = item.dropdownIds?.[dropdownIndex]
                    const source = item.sources?.[dropdownIndex] || item.source
                    console.log(`🔍 Selection Data:`)
                    console.log(`  - Dropdown ID: ${dropdownId || 'undefined'}`)
                    console.log(`  - Source: ${source || 'undefined'}`)
                    console.log(`  - Index: ${dropdownIndex}`)
                    console.log(`  - Parent: ${item.label}`)
                    console.log(`  - Available Sources:`, item.sources)
                    onDropdownItemClick?.(item.label, dropdownItem, dropdownId, source)
                    setHoveredItem(null)
                  }}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    borderRadius: '8px',
                    // Staggered animation untuk setiap item
                    opacity: hoveredItem === item.label ? 1 : 0,
                    transform: hoveredItem === item.label 
                      ? 'translateY(0px)' 
                      : 'translateY(-8px)',
                    transition: hoveredItem === item.label 
                      ? `all 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${dropdownIndex * 0.05}s` // Faster stagger
                      : `all 0.35s cubic-bezier(0.4, 0, 0.6, 0.15) ${(item.dropdownItems.length - dropdownIndex) * 0.03}s`
                  }}
                >
                  {dropdownItem}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
