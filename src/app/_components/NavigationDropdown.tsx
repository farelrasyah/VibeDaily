'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  active?: boolean
  dropdownItems: string[]
}

interface NavigationDropdownProps {
  items: NavItem[]
  onItemClick?: (item: NavItem) => void
  onDropdownItemClick?: (parentLabel: string, dropdownItem: string) => void
}

export default function NavigationDropdown({ 
  items, 
  onItemClick, 
  onDropdownItemClick 
}: NavigationDropdownProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <nav className="flex gap-3" style={{ overflow: 'visible' }}>
      {items.map((item, index) => (
        <div
          key={index}
          className="relative flex-shrink-0"
          style={{ overflow: 'visible' }}
          onMouseEnter={() => {
            console.log(`🔥 Hovering: ${item.label}`)
            setHoveredItem(item.label)
          }}
          onMouseLeave={() => {
            console.log(`❄️ Leaving: ${item.label}`)
            setHoveredItem(null)
          }}
        >
          {/* Main Navigation Button - Enhanced Hover */}
          <button
            onClick={() => {
              console.log(`🎯 CLICKED: ${item.label}`)
              onItemClick?.(item)
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              border transition-all duration-500
              ${item.active 
                ? 'bg-white/45 border-white/35 shadow-lg' 
                : 'bg-white/20 border-white/25 hover:bg-white/35 hover:border-white/40'
              }
            `}
            style={{
              fontFamily: 'Sequel Sans, sans-serif',
              fontSize: '14px',
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
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            )}
            <span style={{ 
              fontFamily: 'Sequel Sans, sans-serif', 
              fontSize: '14px', 
              fontWeight: '700', // Bold
              color: '#000000' 
            }}>
              {item.label}
            </span>
            <svg 
              className="w-3.5 h-3.5" 
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

          {/* Dropdown Menu - ENHANCED SMOOTH ANIMATIONS */}
          <div
            className="absolute left-0 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
            style={{
              top: 'calc(100% + 12px)',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              zIndex: 50,
              position: 'absolute',
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
            }}
            onMouseLeave={() => {
              console.log(`🚪 DROPDOWN LEAVE: ${item.label}`)
              setHoveredItem(null)
            }}
          >
            {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
              <button
                key={dropdownIndex}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/60 hover:text-slate-800 transition-all duration-200"
                onClick={() => {
                  console.log(`✅ Selected: ${dropdownItem} from ${item.label}`)
                  onDropdownItemClick?.(item.label, dropdownItem)
                  setHoveredItem(null)
                }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  borderRadius: dropdownIndex === 0 ? '12px 12px 4px 4px' : 
                               dropdownIndex === item.dropdownItems.length - 1 ? '4px 4px 12px 12px' : '4px',
                  // Staggered animation untuk setiap item
                  opacity: hoveredItem === item.label ? 1 : 0,
                  transform: hoveredItem === item.label 
                    ? 'translateY(0px)' 
                    : 'translateY(-8px)',
                  transition: hoveredItem === item.label 
                    ? `all 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${dropdownIndex * 0.08}s` // Lebih lambat dengan stagger delay yang lebih panjang
                    : `all 0.35s cubic-bezier(0.4, 0, 0.6, 0.15) ${(item.dropdownItems.length - dropdownIndex) * 0.05}s`
                }}
              >
                {dropdownItem}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
