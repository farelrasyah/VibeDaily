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
          {/* Main Navigation Button */}
          <button
            onClick={() => {
              console.log(`🎯 CLICKED: ${item.label}`)
              onItemClick?.(item)
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              border transition-all duration-200
              ${item.active 
                ? 'bg-white/40 border-white/30 text-slate-800' 
                : 'bg-white/20 border-white/25 text-slate-700 hover:bg-white/30'
              }
            `}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {item.active && (
              <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
            )}
            <span>{item.label}</span>
            <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu - SLIDE DOWN/UP ANIMATIONS */}
          <div
            className="absolute left-0 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
            style={{
              top: 'calc(100% + 8px)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              borderRadius: '12px',
              zIndex: 50,
              position: 'absolute',
              // SLIDE DOWN FROM BUTTON / SLIDE UP TO BUTTON
              opacity: hoveredItem === item.label ? 1 : 0,
              transform: hoveredItem === item.label 
                ? 'translateY(0px)' 
                : 'translateY(-20px)', // Slide up ke button saat menghilang
              visibility: hoveredItem === item.label ? 'visible' : 'hidden',
              transition: hoveredItem === item.label 
                ? 'all 0.3s ease-out' // Ease-out saat turun
                : 'all 0.25s ease-in', // Ease-in saat naik
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
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => {
                  console.log(`✅ Selected: ${dropdownItem} from ${item.label}`)
                  onDropdownItemClick?.(item.label, dropdownItem)
                  setHoveredItem(null)
                }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  borderRadius: dropdownIndex === 0 ? '12px 12px 0 0' : 
                               dropdownIndex === item.dropdownItems.length - 1 ? '0 0 12px 12px' : '0'
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
